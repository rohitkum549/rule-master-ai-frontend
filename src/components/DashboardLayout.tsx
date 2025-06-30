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
} from 'react-feather';
import ProfileDropdown from './ProfileDropdown';
import { getUserData } from '../services/api';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
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
    { icon: Grid, label: "Dashboard", path: "/dashboard" },
    { icon: MessageSquare, label: "Chat with AI", path: "/chat" },
    { icon: Book, label: "Rule Library", path: "/rules" },
    { icon: User, label: "User Profile", path: "/profile" },
  ];

  const otherItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Lock, label: "Access Control", path: "/access-control" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white w-64 min-h-screen shadow-lg transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
        <div className="flex items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-xl font-semibold">RuleMaster AI</span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">MENU</div>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 mt-4 py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">OTHERS</div>
            {otherItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 mt-4 py-2 px-4 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search or type command..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <span className="absolute right-3 top-2 text-xs text-gray-400">⌘K</span>
              </div>

              {/* Theme Toggle and Notifications */}
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                  <Bell className="w-5 h-5" />
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 