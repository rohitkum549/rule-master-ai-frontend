import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Book, ArrowRight, ExternalLink, Settings, MessageSquare } from 'react-feather';
import { useTheme } from '../context/ThemeContext';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>RuleMaster AI Platform</h1>

        {/* Get Started Section */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-[#F9F5FF]'} rounded-lg p-8`}>
          <div className="max-w-4xl">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome to RuleMaster AI</h2>
            <p className={`text-lg leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              RuleMaster AI is a B2B solution designed to empower users to define, manage, and apply custom business
              rules through an intuitive chatbot interface. These rules, once defined, will be persistently
              stored and can be applied dynamically to various data inputs to automate decisions or calculations,
              such as commission structures or content moderation guidelines.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#22C55E] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#1EA750] transition-colors">
                Create Your First Rule <ArrowRight className="w-5 h-5" />
              </button>
              <button className={`border border-[#22C55E] text-[#22C55E] px-6 py-3 rounded-lg flex items-center gap-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-[#F0FDF4]'} transition-colors`}>
                Watch Tutorial <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              <Book className="w-5 h-5" />
              <span>Active Rules</span>
            </div>
            <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>0</div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Start creating business rules</p>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              <MessageSquare className="w-5 h-5" />
              <span>Rule Executions</span>
            </div>
            <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>0</div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Total rules executed</p>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
            <div className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              <Settings className="w-5 h-5" />
              <span>Rule Categories</span>
            </div>
            <div className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>0</div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Organize your rules</p>
          </div>
        </div>

        {/* Resources Section */}
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Get started with RuleMaster AI's key features</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documentation Card */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Business Rules</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Define custom "if-then" logic in natural language through our chatbot interface</p>
              <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <MessageSquare className="w-5 h-5 mr-2" />
                <p>Start a conversation with our AI to create your first rule</p>
              </div>
              <button className={`mt-4 w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}>
                Open Chat Interface
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Rule Library Card */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Rule Library</h3>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>Access and manage your existing business rules</p>
              <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Book className="w-5 h-5 mr-2" />
                <p>View, edit, and organize your business rules in one place</p>
              </div>
              <button className={`mt-4 w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}>
                View Rule Library
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard; 