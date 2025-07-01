import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import AlertPopup from '../components/AlertPopup';
import { login } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    keepLoggedIn: false
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = e.target.checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
      // Clear error when user starts typing
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await login({
        username: formData.username,
        password: formData.password
      });

      if (response.success) {
        console.log('Login successful!');
        setShowSuccessPopup(true);
        // Wait for 2ms before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 2);
      } else {
        // Set error message directly from response
        setError(response.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Enter your username and password to sign in!">
      <AlertPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        message="Login successful! Redirecting to dashboard..."
        type="success"
        autoCloseMs={900}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}
        <Input 
          label="Username*" 
          type="text" 
          id="username" 
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <Input 
          label="Password*" 
          type="password" 
          id="password" 
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              id="keepLoggedIn"
              className="form-checkbox"
              checked={formData.keepLoggedIn}
              onChange={handleInputChange}
            />
            <span className="ml-2 text-sm text-gray-600">Keep me logged in</span>
          </label>
          <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-8">
        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
      </p>
    </AuthLayout>
  );
};

export default Login; 