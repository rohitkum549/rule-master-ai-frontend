import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, HelpCircle, LogOut } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface ProfileDropdownProps {
  userName: string;
  userEmail: string;
  avatarUrl: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  userName,
  userEmail,
  avatarUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const response = await logout();
      if (response.success) {
        navigate('/login', { replace: true });
      } else {
        console.error('Logout failed:', response.message);
        // Still navigate to login even if the API call fails
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/login', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 focus:outline-none ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
      >
        <img
          src={avatarUrl}
          alt={userName}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">{userName}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg py-2 z-50 ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* User Info */}
          <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{userName}</p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{userEmail}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left ${
                isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Edit profile</span>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left ${
                isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Account settings</span>
            </button>

            <button
              onClick={() => navigate('/support')}
              className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left ${
                isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support</span>
            </button>

            <div className={`border-t my-1 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}></div>

            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className={`flex items-center space-x-3 px-4 py-2 text-sm w-full text-left ${
                isDark
                  ? 'text-red-400 hover:bg-gray-700'
                  : 'text-red-600 hover:bg-red-50'
              } disabled:opacity-50`}
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 