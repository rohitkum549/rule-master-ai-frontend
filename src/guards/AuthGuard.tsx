import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

// For now, this is a simple pass-through component.
// In the future, it can be updated to check for an authentication token
// and redirect to the login page if the user is not authenticated.
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // If not authenticated, don't render children
  if (!isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard; 