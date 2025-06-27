import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    keepLoggedIn: false
  });

  const [error, setError] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for admin credentials hardcoded login i am doing  this will be removed later i will use the backend to check the credentials!
    if (formData.email === 'admin@gmail.com' && formData.password === 'admin') {
      console.log('Login successful!');
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Try admin/admin');
      console.log('Login failed:', formData);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Enter your email and password to sign in!">
      <form onSubmit={handleSubmit}>
        <Input 
          label="Email*" 
          type="email" 
          id="email" 
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          error={error}
        />
        <Input 
          label="Password*" 
          type="password" 
          id="password" 
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <div className="flex items-center justify-between mb-6">
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
        <Button type="submit">Sign In</Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-8">
        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
      </p>
    </AuthLayout>
  );
};

export default Login; 