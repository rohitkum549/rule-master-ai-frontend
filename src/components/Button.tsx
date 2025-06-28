import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-semibold rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";
  
  const sizeStyles = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-2.5",
    large: "px-6 py-3 text-lg"
  };

  const variantStyles = {
    primary: "bg-[#3B82F6] hover:bg-[#2563EB] text-white focus:ring-blue-500 disabled:bg-[#3B82F6]/50 disabled:cursor-not-allowed",
    secondary: "bg-white border-2 border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 