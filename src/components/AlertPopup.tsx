import React, { useEffect } from 'react';
import { CheckCircle } from 'react-feather';

interface AlertPopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'info';
  autoCloseMs?: number;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ 
  isOpen, 
  onClose, 
  message, 
  type = 'success',
  autoCloseMs 
}) => {
  useEffect(() => {
    if (isOpen && autoCloseMs) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseMs);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, autoCloseMs]);

  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <CheckCircle className="w-5 h-5 text-red-500" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <CheckCircle className="w-5 h-5 text-blue-500" />
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
      <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-md p-4 flex items-center space-x-3 min-w-[300px]`}>
        {styles.icon}
        <span className={`${styles.text} font-medium`}>{message}</span>
      </div>
    </div>
  );
};

export default AlertPopup; 