// A real implementation would use a library like axios or fetch
// to make real API calls.

import config from '../config';

interface ApiErrorResponse {
  message: string;
  details?: {
    errorMessage: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  details?: {
    errorMessage?: string;
  };
  data?: any;
}

interface SignupData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  groupName: string;
  roleName: string;
}

interface LoginData {
  username: string;  // Changed from email to username
  password: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar?: string;
}

class ApiError extends Error {
  constructor(
    message: string, 
    public statusCode?: number,
    public details?: { errorMessage: string }
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token storage functions
export const setAuthTokens = (tokens: AuthTokens) => {
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
  localStorage.setItem('token_expiry', (Date.now() + (tokens.expires_in || 0) * 1000).toString());
  localStorage.setItem('token_type', tokens.token_type);
};

export const getAuthTokens = (): Partial<AuthTokens> => {
  return {
    access_token: localStorage.getItem('access_token') || '',
    refresh_token: localStorage.getItem('refresh_token') || '',
    expires_in: parseInt(localStorage.getItem('token_expiry') || '0') - Date.now(),
    token_type: localStorage.getItem('token_type') || 'Bearer'
  };
};

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expiry');
  localStorage.removeItem('token_type');
};

export const isAuthenticated = (): boolean => {
  const tokens = getAuthTokens();
  return !!(tokens.access_token && (tokens.expires_in ?? 0) > 0);
};

export const setUserData = (data: UserData) => {
  localStorage.setItem('user_data', JSON.stringify(data));
};

// Function to decode JWT token
const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Get user data from access token
export const getUserData = (): UserData | null => {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) return null;

  const decodedToken = decodeJWT(accessToken);
  if (!decodedToken) return null;

  return {
    firstName: decodedToken.firstName || decodedToken.given_name || '',
    lastName: decodedToken.lastName || decodedToken.family_name || '',
    email: decodedToken.email || '',
    username: decodedToken.username || decodedToken.preferred_username || '',
    avatar: decodedToken.avatar || decodedToken.picture || ''
  };
};

export const clearUserData = () => {
  localStorage.removeItem('user_data');
};

const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      data.message || 'API request failed',
      response.status,
      data.details
    );
  }
  
  return data;
};

export const signup = async (data: SignupData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${config.API.BASE_URL}${config.API.ENDPOINTS.AUTH.SIGNUP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await handleApiResponse(response);
    
    return {
      success: true,
      message: 'Signup successful',
      data: result
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        details: error.details
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

export const login = async (data: LoginData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${config.API.BASE_URL}${config.API.ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: result.details?.error_description || result.error || 'Login failed',
        data: result
      };
    }

    // Store the tokens
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);
      localStorage.setItem('token_expiry', (Date.now() + (result.expires_in * 1000)).toString());
      localStorage.setItem('token_type', result.token_type);
      
      // Store user data
      if (result.user) {
        setUserData({
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          username: result.user.username,
          avatar: result.user.avatar
        });
      }
    }
    
    return {
      success: true,
      message: 'Login successful',
      data: result
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred'
    };
  }
};

export const logout = async (): Promise<ApiResponse> => {
  try {
    const tokens = getAuthTokens();
    if (!tokens.refresh_token) {
      clearAuthTokens();
      clearUserData(); // Clear user data on logout
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }

    const response = await fetch(`${config.API.BASE_URL}${config.API.ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: tokens.refresh_token
      }),
    });

    // Clear tokens and user data regardless of the response
    clearAuthTokens();
    clearUserData();

    if (!response.ok) {
      const result = await response.json();
      return {
        success: false,
        message: result.message || 'Logout failed',
        details: result.details
      };
    }

    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    // Clear tokens and user data even if the API call fails
    clearAuthTokens();
    clearUserData();
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'An error occurred during logout'
    };
  }
}; 