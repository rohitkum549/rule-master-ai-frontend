import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';

const Signup: React.FC = () => {
  const departmentOptions = [
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'HR' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'it', label: 'IT' },
  ];

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    verifyPassword: '',
    department: 'sales',
    role: 'user',
    agreeToTerms: false
  });

  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
      
      // Clear password error when either password field changes
      if (id === 'password' || id === 'verifyPassword') {
        setPasswordError('');
      }
    }
  };

  const validatePasswords = (): boolean => {
    if (formData.password !== formData.verifyPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    console.log('Signup Form Data:', formData);
  };

  return (
    <AuthLayout title="Sign Up" subtitle="Enter your details to create an account">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="First Name*" 
            type="text" 
            id="firstName" 
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <Input 
            label="Last Name*" 
            type="text" 
            id="lastName" 
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <Input 
          label="Username*" 
          type="text" 
          id="username" 
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <Input 
          label="Email*" 
          type="email" 
          id="email" 
          placeholder="Enter your email"
          value={formData.email}
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
        <Input 
          label="Verify Password*" 
          type="password" 
          id="verifyPassword" 
          placeholder="Verify your password"
          value={formData.verifyPassword}
          onChange={handleInputChange}
          error={passwordError}
        />
        <Select 
          label="Department" 
          id="department" 
          options={departmentOptions}
          value={formData.department}
          onChange={handleInputChange}
        />
        <Select 
          label="Role" 
          id="role" 
          options={roleOptions}
          value={formData.role}
          onChange={handleInputChange}
        />
        <div className="flex items-start mb-6 mt-6">
            <label className="flex items-center">
                <input 
                  type="checkbox" 
                  id="agreeToTerms"
                  className="form-checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                />
                <span className="ml-2 text-sm text-gray-600">
                    By creating an account means you agree to the <a href="/terms" className="text-blue-500 hover:underline">Terms and Conditions</a>, and our <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>
                </span>
            </label>
        </div>
        <Button type="submit">Sign Up</Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-8">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Sign In</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup; 