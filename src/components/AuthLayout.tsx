import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-7xl w-full mx-auto flex rounded-lg shadow-lg overflow-hidden">
        <div className="w-1/2 bg-white p-12">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-2">{subtitle}</p>
          </div>
          {children}
        </div>
        <div className="w-1/2 bg-indigo-900 flex flex-col items-center justify-center p-12 text-white">
          <div className="flex items-center mb-4">
            <svg className="w-16 h-16 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <h1 className="text-4xl font-bold">RuleMaster AI</h1>
          </div>
          <p className="text-center text-indigo-200">
            AI-Powered Rules Engine for Intelligent Business Automation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 