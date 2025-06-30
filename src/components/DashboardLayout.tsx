import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Grid,
  Book,
  Code,
  User,
  FileText,
  Table,
  Settings,
  BarChart2,
  Box,
  Lock,
  Menu,
  Search,
  Bell,
  Sliders,
  GitBranch,
  MessageSquare,
  Sun,
  Moon,
} from 'react-feather';
import ProfileDropdown from './ProfileDropdown';
import { getUserData } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [userData, setUserData] = useState({
    userName: '',
    userEmail: '',
    avatarUrl: ''
  });

  useEffect(() => {
    const user = getUserData();
    if (user) {
      setUserData({
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        avatarUrl: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}+${encodeURIComponent(user.lastName)}&background=random`
      });
    }
  }, []);

  const menuItems = [
    { icon: Grid, label: "Getting Started", path: "/getting-started" },
    { icon: BarChart2, label: "Dashboard", path: "/dashboard" },
  ];

  const currentProjectItems = [
    { icon: MessageSquare, label: "Chat with AI", path: "/chat" },
    { icon: Book, label: "Rule Library", path: "/rules" },
  ];

  const resourceItems = [
    { icon: Book, label: "Documentation", path: "/documentation" },
    { icon: MessageSquare, label: "Discord Community", path: "/discord" },
  ];

  const otherItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Lock, label: "Access Control", path: "/access-control" },
  ];

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full ${isDark ? 'bg-gray-800' : 'bg-white'} w-64 shadow-lg transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} z-20`}>
        <div className={`flex items-center p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>RuleMaster AI</span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-8">
            <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Platform</div>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 mt-4 py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? isDark 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-indigo-50 text-indigo-600'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mb-8">
            <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Rules</div>
            {currentProjectItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 mt-4 py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? isDark 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-indigo-50 text-indigo-600'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div>
            <div className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Resources</div>
            {resourceItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 mt-4 py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? isDark 
                      ? 'bg-gray-700 text-white' 
                      : 'bg-indigo-50 text-indigo-600'
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.label === "Discord Community" && (
                  <svg className={`w-4 h-4 ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Navbar */}
        <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b sticky top-0 z-10`}>
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-md ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <Menu className={`w-6 h-6 ${isDark ? 'text-gray-200' : 'text-gray-600'}`} />
            </button>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search or type command..."
                  className={`w-64 pl-10 pr-4 py-2 rounded-lg border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                />
                <Search className={`absolute left-3 top-2.5 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                <span className={`absolute right-3 top-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>⌘K</span>
              </div>

              {/* Theme Toggle and Notifications */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-gray-200" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} relative`}>
                  <Bell className={`w-5 h-5 ${isDark ? 'text-gray-200' : 'text-gray-600'}`} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* Profile Dropdown */}
              <ProfileDropdown
                userName={userData.userName}
                userEmail={userData.userEmail}
                avatarUrl={userData.avatarUrl}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-x-hidden overflow-y-auto ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-6`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 