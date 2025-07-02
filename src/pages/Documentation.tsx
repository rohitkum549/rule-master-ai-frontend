import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, ChevronUp, Users, Lock, MessageSquare, Book, Settings, Code, Database } from 'react-feather';

const Documentation: React.FC = () => {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState<string | null>('getting-started');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          RuleMaster AI Documentation
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className={`sticky top-8 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Contents
              </h2>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#getting-started" 
                    onClick={() => setActiveSection('getting-started')}
                    className={`block px-3 py-2 rounded-md ${
                      activeSection === 'getting-started'
                        ? isDark 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-indigo-50 text-indigo-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Getting Started
                  </a>
                </li>
                <li>
                  <a 
                    href="#account-management" 
                    onClick={() => setActiveSection('account-management')}
                    className={`block px-3 py-2 rounded-md ${
                      activeSection === 'account-management'
                        ? isDark 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-indigo-50 text-indigo-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Account Management
                  </a>
                </li>
                <li>
                  <a 
                    href="#creating-rules" 
                    onClick={() => setActiveSection('creating-rules')}
                    className={`block px-3 py-2 rounded-md ${
                      activeSection === 'creating-rules'
                        ? isDark 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-indigo-50 text-indigo-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Creating Rules
                  </a>
                </li>
                <li>
                  <a 
                    href="#managing-rules" 
                    onClick={() => setActiveSection('managing-rules')}
                    className={`block px-3 py-2 rounded-md ${
                      activeSection === 'managing-rules'
                        ? isDark 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-indigo-50 text-indigo-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Managing Rules
                  </a>
                </li>
                <li>
                  <a 
                    href="#ai-chat-interface" 
                    onClick={() => setActiveSection('ai-chat-interface')}
                    className={`block px-3 py-2 rounded-md ${
                      activeSection === 'ai-chat-interface'
                        ? isDark 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-indigo-50 text-indigo-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    AI Chat Interface
                  </a>
                </li>
                <li>
                  <a 
                    href="#advanced-features" 
                    onClick={() => setActiveSection('advanced-features')}
                    className={`block px-3 py-2 rounded-md ${
                      activeSection === 'advanced-features'
                        ? isDark 
                          ? 'bg-gray-700 text-white' 
                          : 'bg-indigo-50 text-indigo-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Advanced Features
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Documentation Content */}
          <div className="flex-1">
            <div className="space-y-8">
              {/* Getting Started Section */}
              <section id="getting-started">
                <div 
                  className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                  onClick={() => toggleSection('getting-started')}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <h2 className={`text-2xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Users className="w-6 h-6" />
                      Getting Started
                    </h2>
                    {activeSection === 'getting-started' ? (
                      <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  
                  {activeSection === 'getting-started' && (
                    <div className="mt-4 space-y-4">
                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          What is RuleMaster AI?
                        </h3>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          RuleMaster AI is a powerful B2B solution designed to help businesses define, manage, and apply custom business rules through a natural language interface. Our platform allows you to create complex "if-then" logic without any coding knowledge, making it easy to automate decisions and calculations across your organization.
                        </p>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Key Features
                        </h3>
                        <ul className={`list-disc pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>Natural language rule creation through our AI chat interface</li>
                          <li>Centralized rule management and organization</li>
                          <li>Dynamic rule application to various data inputs</li>
                          <li>Rule categorization and versioning</li>
                          <li>Secure access control and user management</li>
                        </ul>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Platform Overview
                        </h3>
                        <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          The RuleMaster AI platform consists of several key components:
                        </p>
                        <ul className={`list-disc pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li><strong>Dashboard:</strong> Your central hub for accessing all platform features and viewing rule statistics</li>
                          <li><strong>Chat Interface:</strong> Where you interact with our AI to create and test business rules</li>
                          <li><strong>Rules Management:</strong> A comprehensive view of all your business rules with filtering and search capabilities</li>
                          <li><strong>Profile Settings:</strong> Manage your account details and preferences</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Account Management Section */}
              <section id="account-management">
                <div 
                  className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                  onClick={() => toggleSection('account-management')}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <h2 className={`text-2xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Lock className="w-6 h-6" />
                      Account Management
                    </h2>
                    {activeSection === 'account-management' ? (
                      <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  
                  {activeSection === 'account-management' && (
                    <div className="mt-4 space-y-4">
                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Creating an Account
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          To get started with RuleMaster AI, you'll need to create an account:
                        </p>
                        <ol className={`list-decimal pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>Visit the RuleMaster AI sign-up page by clicking "Sign Up" from the login screen</li>
                          <li>Enter your email address, create a secure password, and provide your name</li>
                          <li>Agree to the terms of service and privacy policy</li>
                          <li>Click "Create Account" to complete registration</li>
                          <li>Verify your email address by clicking the link sent to your inbox</li>
                        </ol>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Signing In
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Once your account is created, you can sign in using these steps:
                        </p>
                        <ol className={`list-decimal pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>Visit the RuleMaster AI login page</li>
                          <li>Enter your registered email address and password</li>
                          <li>Click "Sign In" to access your dashboard</li>
                          <li>Optional: Enable "Remember me" to stay logged in on trusted devices</li>
                        </ol>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Managing Your Profile
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          You can update your profile information at any time:
                        </p>
                        <ol className={`list-decimal pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>Click your profile icon in the top-right corner of the dashboard</li>
                          <li>Select "Profile" from the dropdown menu</li>
                          <li>Update your name, email, or password as needed</li>
                          <li>Click "Save Changes" to apply your updates</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Creating Rules Section */}
              <section id="creating-rules">
                <div 
                  className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                  onClick={() => toggleSection('creating-rules')}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <h2 className={`text-2xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Code className="w-6 h-6" />
                      Creating Rules
                    </h2>
                    {activeSection === 'creating-rules' ? (
                      <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  
                  {activeSection === 'creating-rules' && (
                    <div className="mt-4 space-y-4">
                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Using the AI Chat Interface
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          The RuleMaster AI chat interface is where you'll create your business rules:
                        </p>
                        <ol className={`list-decimal pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>From your dashboard, click on "Open Chat Interface" or navigate to the Chat section</li>
                          <li>Start by greeting the AI and explaining the rule you want to create</li>
                          <li>The AI will guide you through the rule creation process with follow-up questions</li>
                          <li>Be as specific as possible when defining conditions and outcomes</li>
                          <li>Review the final rule before saving it to your library</li>
                        </ol>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Rule Structure
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Rules in RuleMaster AI follow an "if-then" structure:
                        </p>
                        <ul className={`list-disc pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li><strong>Conditions (IF):</strong> The criteria that must be met for the rule to apply</li>
                          <li><strong>Actions (THEN):</strong> What happens when the conditions are met</li>
                          <li><strong>Variables:</strong> Dynamic values that can be referenced in your rules</li>
                          <li><strong>Exceptions:</strong> Special cases where the rule behaves differently</li>
                        </ul>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Rule Examples
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Here are some examples of rules you might create:
                        </p>
                        <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div>
                            <p className="font-medium mb-1">Sales Commission Rule:</p>
                            <p className="pl-4 border-l-2 border-green-500">
                              "If a sales representative closes a deal worth more than $10,000, then they receive a 5% commission. If the deal is worth between $5,000 and $10,000, they receive a 3% commission. Otherwise, they receive a 2% commission."
                            </p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">Content Moderation Rule:</p>
                            <p className="pl-4 border-l-2 border-blue-500">
                              "If user content contains any words from the prohibited list, then flag the content for review and notify the user that their content is under review."
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Managing Rules Section */}
              <section id="managing-rules">
                <div 
                  className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                  onClick={() => toggleSection('managing-rules')}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <h2 className={`text-2xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Book className="w-6 h-6" />
                      Managing Rules
                    </h2>
                    {activeSection === 'managing-rules' ? (
                      <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  
                  {activeSection === 'managing-rules' && (
                    <div className="mt-4 space-y-4">
                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Viewing Rules
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          To access and manage your rules:
                        </p>
                        <ol className={`list-decimal pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>From your dashboard, click on "View Rules" or navigate to the Rules section</li>
                          <li>You'll see a table of all your existing rules</li>
                          <li>Use the search function to find specific rules by name or content</li>
                          <li>Filter rules by category, status, or creation date</li>
                          <li>Click on a rule to view its full details</li>
                        </ol>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Editing and Updating Rules
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          You can update your rules at any time:
                        </p>
                        <ol className={`list-decimal pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>Find the rule you want to edit in the Rules table</li>
                          <li>Click the "Edit" button (pencil icon) next to the rule</li>
                          <li>Make your changes in the edit interface</li>
                          <li>Click "Save Changes" to update the rule</li>
                          <li>The system will maintain a version history of your rule</li>
                        </ol>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Organizing Rules with Categories
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Categories help you organize your rules effectively:
                        </p>
                        <ol className={`list-decimal pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>When creating a rule, assign it to a relevant category</li>
                          <li>Create new categories as needed for different business processes</li>
                          <li>Filter your rules by category in the Rules table</li>
                          <li>Update a rule's category at any time by editing the rule</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* AI Chat Interface Section */}
              <section id="ai-chat-interface">
                <div 
                  className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                  onClick={() => toggleSection('ai-chat-interface')}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <h2 className={`text-2xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <MessageSquare className="w-6 h-6" />
                      AI Chat Interface
                    </h2>
                    {activeSection === 'ai-chat-interface' ? (
                      <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  
                  {activeSection === 'ai-chat-interface' && (
                    <div className="mt-4 space-y-4">
                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Starting a Conversation
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          To begin using the AI chat interface:
                        </p>
                        <ol className={`list-decimal pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>Navigate to the Chat section from your dashboard</li>
                          <li>Start with a greeting like "Hello" or "Hi"</li>
                          <li>Clearly state what you'd like to accomplish (e.g., "I want to create a rule for calculating sales tax")</li>
                          <li>The AI will respond and guide you through the process</li>
                        </ol>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Effective Communication with the AI
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Tips for getting the most out of the AI chat interface:
                        </p>
                        <ul className={`list-disc pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li><strong>Be specific:</strong> Provide detailed information about your rule requirements</li>
                          <li><strong>Use natural language:</strong> Speak conversationally as you would to a colleague</li>
                          <li><strong>Ask questions:</strong> If you're unsure about something, just ask</li>
                          <li><strong>Provide examples:</strong> Real-world examples help the AI understand your needs</li>
                          <li><strong>Review and refine:</strong> Iteratively improve your rule with the AI's help</li>
                        </ul>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Common AI Commands
                        </h3>
                        <p className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Here are some useful phrases to use with the AI:
                        </p>
                        <ul className={`list-disc pl-6 space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <li>"Create a new rule for [your purpose]"</li>
                          <li>"Help me define a rule for [specific business process]"</li>
                          <li>"Show me my existing rules"</li>
                          <li>"I want to test my rule with [example scenario]"</li>
                          <li>"Explain how this rule works"</li>
                          <li>"How can I improve this rule?"</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Advanced Features Section */}
              <section id="advanced-features">
                <div 
                  className={`rounded-lg p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                  onClick={() => toggleSection('advanced-features')}
                >
                  <div className="flex items-center justify-between cursor-pointer">
                    <h2 className={`text-2xl font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Settings className="w-6 h-6" />
                      Advanced Features
                    </h2>
                    {activeSection === 'advanced-features' ? (
                      <ChevronUp className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>
                  
                  {activeSection === 'advanced-features' && (
                    <div className="mt-4 space-y-4">
                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Rule Dependencies
                        </h3>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          You can create complex rule systems by establishing dependencies between rules. This allows one rule to reference or trigger another, creating sophisticated decision trees and workflows.
                        </p>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Data Integration
                        </h3>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          RuleMaster AI can connect to your existing data sources to apply rules to real-time data streams. Speak with your administrator about setting up integrations with your enterprise systems.
                        </p>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Rule Analytics
                        </h3>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Track how your rules are performing with built-in analytics. See which rules are used most frequently, their success rates, and how they impact your business metrics.
                        </p>
                      </div>

                      <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h3 className={`text-xl font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Rule Export and Import
                        </h3>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Share rules across teams or environments by exporting them in standard formats. You can also import pre-defined rule sets to quickly establish best practices.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documentation; 