import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import ViewRules from '../pages/Tables';
import Chat from '../pages/Chat';
import AuthGuard from '../guards/AuthGuard';

const AppRoutes: React.FC = () => {
  // Function to handle external Discord link
  const handleDiscordRedirect = () => {
    window.open('https://discord.gg/your-discord-link', '_blank');
    return null;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route element={
        <AuthGuard>
          <Outlet />
        </AuthGuard>
      }>
        <Route path="/getting-started" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/tables" element={<ViewRules />} />
        <Route path="/rules" element={<ViewRules />} />
        <Route path="/documentation" element={<Dashboard />} />
        <Route path="/discord" element={handleDiscordRedirect()} />
        <Route path="/" element={<Navigate to="/getting-started" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 