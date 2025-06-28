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
      setAuthTokens(result);
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