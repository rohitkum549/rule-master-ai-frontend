import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

// For now, this is a simple pass-through component.
// In the future, it can be updated to check for an authentication token
// and redirect to the login page if the user is not authenticated.
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  return <>{children}</>;
};

export default AuthGuard; 