import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { signup } from '../services/api';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const departmentOptions = [
    { value: 'IT', label: 'IT' },
    { value: 'HR', label: 'HR' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
  ];

  const getRoleOptions = (selectedDepartment: string) => [
    { value: `${selectedDepartment.toLowerCase()}_admin_role`, label: 'Admin' },
    { value: `${selectedDepartment.toLowerCase()}_user_role`, label: 'User' },
  ];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    verifyPassword: '',
    groupName: 'IT',
    roleName: 'it_admin_role',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    verifyPassword: '',
    agreeToTerms: ''
  });

  // Password validation rules
  const validatePassword = (password: string): { isValid: boolean; error: string } => {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one number' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one special character' };
    }
    return { isValid: true, error: '' };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
      if (id === 'agreeToTerms' && checked) {
        setErrors(prev => ({ ...prev, agreeToTerms: '' }));
      }
    } else {
      if (id === 'groupName') {
        // When department changes, update the role to match the new department
        const newRoleName = `${value.toLowerCase()}_admin_role`;
        setFormData(prev => ({ 
          ...prev, 
          [id]: value,
          roleName: newRoleName
        }));
      } else {
        setFormData(prev => ({ ...prev, [id]: value }));
      }
      setErrors(prev => ({ ...prev, [id]: '' }));

      // Real-time password validation
      if (id === 'password') {
        const passwordValidation = validatePassword(value);
        if (!passwordValidation.isValid) {
          setErrors(prev => ({ ...prev, password: passwordValidation.error }));
        }
        // Check verify password match if it's already entered
        if (formData.verifyPassword && value !== formData.verifyPassword) {
          setErrors(prev => ({ ...prev, verifyPassword: 'Passwords do not match' }));
        } else if (formData.verifyPassword) {
          setErrors(prev => ({ ...prev, verifyPassword: '' }));
        }
      }

      // Real-time verify password validation
      if (id === 'verifyPassword') {
        if (value !== formData.password) {
          setErrors(prev => ({ ...prev, verifyPassword: 'Passwords do not match' }));
        }
      }

      // Real-time email validation
      if (id === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
        }
      }

      // Real-time username validation
      if (id === 'username' && value) {
        if (value.length < 3) {
          setErrors(prev => ({ ...prev, username: 'Username must be at least 3 characters long' }));
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          setErrors(prev => ({ ...prev, username: 'Username can only contain letters, numbers, and underscores' }));
        }
      }
    }
    setApiError('');
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };

    // Name validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters long';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters long';
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters';
      isValid = false;
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    // Password validation
    const passwordValidation = validatePassword(formData.password);
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.error;
      isValid = false;
    }

    // Verify password validation
    if (!formData.verifyPassword) {
      newErrors.verifyPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.verifyPassword) {
      newErrors.verifyPassword = 'Passwords do not match';
      isValid = false;
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms and Conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const { verifyPassword, agreeToTerms, ...signupData } = formData;
      const response = await signup(signupData);

      if (response.success) {
        setSuccessMessage('🎉 Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMessage = response.details?.errorMessage || response.message;
        
        if (errorMessage.toLowerCase().includes('email')) {
          setErrors(prev => ({ 
            ...prev, 
            email: '❌ This email is already registered'
          }));
          setApiError('Email already registered. Please try with a different email address.');
        } else if (errorMessage.toLowerCase().includes('username')) {
          setErrors(prev => ({ 
            ...prev, 
            username: '❌ This username is already taken'
          }));
          setApiError('Username already taken. Please choose a different username.');
        } else {
          setApiError('❌ ' + (errorMessage || 'Registration failed. Please try again.'));
        }
      }
    } catch (error) {
      setApiError('❌ An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign Up" subtitle="Enter your details to create an account">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          {successMessage}
        </div>
      )}
      
      {apiError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="First Name*" 
            type="text" 
            id="firstName" 
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleInputChange}
            error={errors.firstName}
          />
          <Input 
            label="Last Name*" 
            type="text" 
            id="lastName" 
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleInputChange}
            error={errors.lastName}
          />
        </div>
        <Input 
          label="Username*" 
          type="text" 
          id="username" 
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleInputChange}
          error={errors.username}
        />
        <Input 
          label="Email*" 
          type="email" 
          id="email" 
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
        />
        <div className="space-y-1">
          <Input 
            label="Password*" 
            type="password" 
            id="password" 
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
          />
          {!errors.password && formData.password && (
            <p className="text-xs text-green-600">Password meets all requirements</p>
          )}
          {!formData.password && (
            <ul className="text-xs text-gray-500 list-disc list-inside">
              <li>At least 8 characters long</li>
              <li>Contains at least one uppercase letter</li>
              <li>Contains at least one lowercase letter</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          )}
        </div>
        <Input 
          label="Verify Password*" 
          type="password" 
          id="verifyPassword" 
          placeholder="Verify your password"
          value={formData.verifyPassword}
          onChange={handleInputChange}
          error={errors.verifyPassword}
        />
        <Select 
          label="Department" 
          id="groupName" 
          options={departmentOptions}
          value={formData.groupName}
          onChange={handleInputChange}
        />
        <Select 
          label="Role" 
          id="roleName" 
          options={getRoleOptions(formData.groupName)}
          value={formData.roleName}
          onChange={handleInputChange}
        />
        <div className="flex items-start mb-6">
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
        {errors.agreeToTerms && (
          <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
        )}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-8">
        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Sign In</Link>
      </p>
    </AuthLayout>
  );
};

export default Signup; 