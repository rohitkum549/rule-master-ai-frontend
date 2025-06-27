// A real implementation would use a library like axios or fetch
// to make real API calls.

export const login = async (data: any) => {
  console.log('Logging in with', data);
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ token: 'fake-jwt-token' });
    }, 1000);
  });
};

export const signup = async (data: any) => {
  console.log('Signing up with', data);
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Signup successful' });
    }, 1000);
  });
}; 