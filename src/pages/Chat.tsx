import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { chatWithAI, isAuthenticated, getUserData } from '../services/api';

// Storage key for chat messages
const STORAGE_KEY = 'chat_messages';
const PAGINATION_KEY = 'chat_pagination';
// Key to store the last logged-in user
const LAST_USER_KEY = 'last_logged_in_user';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  ruleData?: RuleData;
  isStreaming?: boolean;
}

interface RuleData {
  rules: Rule[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface Rule {
  id: string;
  title: string;
  department: string;
  is_active: boolean;
  rule_conditions: RuleCondition[];
  rule_actions: RuleAction[];
  created_by: string;
  created_at: string;
}

interface RuleCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface RuleAction {
  id: string;
  type: string;
  value: string;
}

const exampleTemplates = [
  "If sales are greater than $50000 AND the profit margin is above 15%, give a bonus to 5% of the sales team.",
  "When a customer places more than 3 orders in a month, apply a 10% discount on their next purchase.",
  "If a product's inventory falls below 20 units AND it hasn't been restocked in the last 7 days, send an alert to the warehouse manager.",
  "For transactions over $1000, require secondary approval from a manager before processing.",
  "If a customer has a credit score below 600, deny their loan application.",
  "Show my Rules"
];

// Create a utility function for localStorage operations with error handling
const localStorageUtil = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.error(`Error retrieving ${key} from localStorage:`, err);
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error saving ${key} to localStorage:`, err);
      return false;
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.error(`Error removing ${key} from localStorage:`, err);
      return false;
    }
  }
};

const Chat: React.FC = () => {
  // Create a function to initialize messages from localStorage
  const initializeMessages = () => {
    const savedMessages = localStorageUtil.get(STORAGE_KEY);
    if (savedMessages) {
      try {
        // Parse stored messages and convert timestamp strings back to Date objects
        return savedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          // Ensure ruleData pagination is properly handled if it exists
          ruleData: msg.ruleData ? {
            ...msg.ruleData,
            pagination: msg.ruleData.pagination || {
              page: 1,
              limit: msg.ruleData.rules?.length || 0,
              total: msg.ruleData.rules?.length || 0,
              totalPages: 1
            }
          } : undefined
        }));
      } catch (err) {
        console.error('Error parsing saved messages:', err);
      }
    }
    
    // Default initial message if no saved messages exist
    return [{
      text: "Hello! I'm Rule Master AI. I can help you write, understand, and evaluate business rules. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    }];
  };

  const [messages, setMessages] = useState<Message[]>(initializeMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPage, setCurrentPage] = useState<{[messageIndex: number]: number}>(() => 
    localStorageUtil.get(PAGINATION_KEY) || {}
  );
  // Track the current user
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the handleStartNewConversation function to use in effects
  const handleStartNewConversation = useCallback((param?: React.MouseEvent | boolean) => {
    // If param is a MouseEvent, prevent default
    if (param && typeof param !== 'boolean' && 'preventDefault' in param) {
      param.preventDefault();
    }
    
    // Default clearLocalStorage to true unless explicitly set to false
    const clearLocalStorage = param !== false;
    
    const initialMessage = {
      text: "Hello! I'm Rule Master AI. I can help you write, understand, and evaluate business rules. How can I assist you today?",
      sender: 'ai' as const,
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
    setCurrentPage({});
    
    // Clear stored conversation from localStorage if requested
    if (clearLocalStorage) {
      localStorageUtil.remove(STORAGE_KEY);
      localStorageUtil.remove(PAGINATION_KEY);
    }
  }, []);

  // Check authentication status and current user
  useEffect(() => {
    const checkAuthAndUser = () => {
      // Get current authentication status
      const authenticated = isAuthenticated();
      
      if (!authenticated) {
        // User is not authenticated, clear chat history
        handleStartNewConversation();
        // Also clear the last user
        localStorageUtil.remove(LAST_USER_KEY);
        setCurrentUser(null);
        return;
      }
      
      // User is authenticated, get user data
      const userData = getUserData();
      if (!userData) return;
      
      const userIdentifier = userData.username || userData.email;
      setCurrentUser(userIdentifier);
      
      // Get the last logged in user
      const lastUser = localStorageUtil.get(LAST_USER_KEY);
      
      // If this is a different user than the last one who used the chat, clear chat history
      if (lastUser !== userIdentifier) {
        console.log('User changed, clearing chat history');
        handleStartNewConversation();
        // Update the last logged in user
        localStorageUtil.set(LAST_USER_KEY, userIdentifier);
      }
    };
    
    // Run the check on component mount
    checkAuthAndUser();
    
    // Set up an interval to periodically check authentication status
    const authCheckInterval = setInterval(checkAuthAndUser, 60000); // Check every minute
    
    return () => {
      clearInterval(authCheckInterval);
    };
  }, [handleStartNewConversation]);

  // Debounced function to save messages to localStorage
  const debouncedSaveMessages = useCallback((newMessages: Message[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      // Only save messages if the user is authenticated
      if (isAuthenticated()) {
        localStorageUtil.set(STORAGE_KEY, newMessages);
      }
    }, 500); // 500ms debounce time
  }, []);

  // Save messages to localStorage with debounce
  useEffect(() => {
    debouncedSaveMessages(messages);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [messages, debouncedSaveMessages]);
  
  // Save pagination state to localStorage
  useEffect(() => {
    // Only save pagination if the user is authenticated
    if (isAuthenticated()) {
      localStorageUtil.set(PAGINATION_KEY, currentPage);
    }
  }, [currentPage]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const handlePageChange = useCallback((messageIndex: number, page: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [messageIndex]: page
    }));
  }, []);

  // Simulate message streaming for a more responsive feel
  const simulateStreamingResponse = useCallback((response: string, messageIndex: number) => {
    let currentText = '';
    const words = response.split(' ');
    
    // Add a temporary streaming message
    setMessages(prev => [
      ...prev.slice(0, messageIndex),
      {
        ...prev[messageIndex],
        isStreaming: true,
        text: currentText
      }
    ]);
    
    // Update the message text word by word with random delays to simulate typing
    const streamInterval = setInterval(() => {
      if (words.length > 0) {
        currentText += (currentText ? ' ' : '') + words.shift();
        setMessages(prev => [
          ...prev.slice(0, messageIndex),
          {
            ...prev[messageIndex],
            text: currentText
          }
        ]);
      } else {
        clearInterval(streamInterval);
        // Mark streaming as complete
        setMessages(prev => [
          ...prev.slice(0, messageIndex),
          {
            ...prev[messageIndex],
            isStreaming: false
          }
        ]);
      }
    }, Math.random() * 50 + 20); // Random delay between 20ms and 70ms
    
    return () => clearInterval(streamInterval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent | string) => {
    if (e && typeof e !== 'string' && e.preventDefault) {
      e.preventDefault();
    }
    
    // If template string is passed directly
    const messageText = typeof e === 'string' ? e : inputMessage;
    
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    // Create a placeholder for AI response
    const aiPlaceholder: Message = {
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, userMessage, aiPlaceholder]);
    setInputMessage('');
    setError(null);
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Start simulating typing indicator
      
      // Call the AI API
      const response = await chatWithAI({ prompt: userMessage.text });
      
      if (response.success && response.data) {
        setIsTyping(false);
        
        let aiResponseText = response.data.response || response.data.message || '';
        
        // Check if response contains rule data
        if (Array.isArray(response.data.data)) {
          const ruleData: RuleData = {
            rules: response.data.data,
            pagination: response.data.pagination || {
              page: 1, 
              limit: response.data.data.length, 
              total: response.data.data.length, 
              totalPages: 1
            }
          };
          
          // Set initial page for this message
          const newMessageIndex = messages.length + 1;
          setCurrentPage(prev => ({
            ...prev,
            [newMessageIndex]: 1
          }));
          
          if (!aiResponseText) {
            aiResponseText = `I found ${ruleData.rules.length} rules matching your criteria.`;
          }
          
          // Update the placeholder with rule data
          setMessages(prev => [
            ...prev.slice(0, newMessageIndex),
            {
              ...prev[newMessageIndex],
              text: aiResponseText,
              ruleData: ruleData,
              isStreaming: false
            }
          ]);
        } else {
          // Simulate streaming text response for a more engaging experience
          simulateStreamingResponse(aiResponseText, messages.length + 1);
        }
      } else {
        // Handle error response
        let errorMessage = response.message || 'Failed to get response from AI';
        
        // Calculate aiMessageIndex in the catch block as well
        const aiMessageIndex = messages.length + 1;
        
        // Update the placeholder with the error message as AI response
        setMessages(prev => [
          ...prev.slice(0, aiMessageIndex),
          {
            ...prev[aiMessageIndex],
            text: errorMessage,
            isStreaming: false
          }
        ]);
        
        // Stop the typing indicator for errors too
        setIsTyping(false);
        
        console.error('API Error:', errorMessage);
      }
    } catch (err: any) {
      // Get error message from error object if available
      let errorMessage = 'An error occurred while communicating with the AI';
      
      // Extract error message - handle different error response formats
      if (err?.response?.data) {
        if (typeof err.response.data === 'string') {
          try {
            // Try to parse if it's a JSON string
            const parsedError = JSON.parse(err.response.data);
            errorMessage = parsedError.message || errorMessage;
          } catch {
            errorMessage = err.response.data;
          }
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Calculate aiMessageIndex in the catch block as well
      const aiMessageIndex = messages.length + 1;
      
      // Update the placeholder with the error message as AI response
      setMessages(prev => [
        ...prev.slice(0, aiMessageIndex),
        {
          ...prev[aiMessageIndex],
          text: errorMessage,
          isStreaming: false
        }
      ]);
      
      // Stop the typing indicator for errors too
      setIsTyping(false);
      
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the RuleTable component to prevent unnecessary re-renders
  const RuleTable = useMemo(() => {
    return ({ rules, messageIndex }: { rules: Rule[], messageIndex: number }) => {
      const page = currentPage[messageIndex] || 1;
      const itemsPerPage = 3;
      const startIndex = (page - 1) * itemsPerPage;
      const displayedRules = rules.slice(startIndex, startIndex + itemsPerPage);
      const totalPages = Math.ceil(rules.length / itemsPerPage);
      
      return (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Conditions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{rule.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {rule.department}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="space-y-2">
                      {rule.rule_conditions.map((condition, i) => (
                        <div key={i} className="flex items-center bg-gray-50 rounded-lg p-2 border-l-4 border-amber-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium text-gray-700">{condition.field}</span>
                          <span className="mx-1 font-bold text-amber-600">{condition.operator}</span>
                          <span className="font-medium text-gray-700">{condition.value}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="space-y-2">
                      {rule.rule_actions.map((action, i) => (
                        <div key={i} className="flex items-center bg-gray-50 rounded-lg p-2 border-l-4 border-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="font-medium text-gray-700">{action.type}:</span>
                          <span className="ml-1 font-semibold text-green-600">{action.value}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button 
                onClick={() => handlePageChange(messageIndex, Math.max(1, page - 1))}
                disabled={page === 1}
                className={`flex items-center px-4 py-2 rounded-md transition-all ${page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-md">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(messageIndex, Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`flex items-center px-4 py-2 rounded-md transition-all ${page === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      );
    };
  }, [currentPage, handlePageChange]);

  // Create a memoized message list component to improve rendering performance
  const MessageList = useMemo(() => {
    return (
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">Welcome to Rule Master AI!</p>
              <p>Start a conversation by typing a message below.</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-2 shadow-md p-0.5 border border-blue-200">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                      className="h-6 w-6 text-blue-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                      <line x1="8" y1="16" x2="8" y2="16"></line>
                      <line x1="16" y1="16" x2="16" y2="16"></line>
                    </svg>
                  </div>
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg p-4 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200 shadow-sm'
                }`}
              >
                {message.text && (
                  <p className="whitespace-pre-wrap break-words mb-3">{message.text}</p>
                )}
                
                {message.isStreaming && (
                  <div className="inline-flex items-center">
                    <span className="inline-block h-5 w-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
                    <span className="text-blue-500 font-medium text-sm animate-pulse">Thinking</span>
                    <span className="relative ml-1">
                      <span className="absolute -top-1 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}>.</span>
                      <span className="absolute -top-1 left-1 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }}>.</span>
                      <span className="absolute -top-1 left-2 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.6s' }}>.</span>
                      <span className="opacity-0">...</span>
                    </span>
                  </div>
                )}
                
                {message.ruleData && message.ruleData.rules.length > 0 && (
                  <>
                    {message.ruleData.rules.length > 0 && (
                      <div className="mb-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-blue-700">Found {message.ruleData.rules.length} matching rules</span>
                      </div>
                    )}
                    <RuleTable rules={message.ruleData.rules} messageIndex={index} />
                  </>
                )}
                
                <span className="text-xs opacity-75 mt-2 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {message.sender === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center ml-2 shadow-md p-0.5 border border-blue-300">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                      className="h-6 w-6 text-blue-600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        {isTyping && !messages[messages.length - 1]?.isStreaming && (
          <div className="flex justify-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-2 shadow-md p-0.5 border border-blue-200">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                  className="h-6 w-6 text-blue-500 animate-pulse" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                  <circle cx="12" cy="5" r="2"></circle>
                  <path d="M12 7v4"></path>
                  <line x1="8" y1="16" x2="8" y2="16"></line>
                  <line x1="16" y1="16" x2="16" y2="16"></line>
                </svg>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200 rounded-lg p-4 max-w-[80%] shadow-sm">
              <div className="typing-animation flex items-center">
                <span className="text-blue-600 text-sm font-medium mr-2">AI is thinking</span>
                <div className="flex space-x-2">
                  <div className="typing-dot bg-blue-600 w-2.5 h-2.5 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></div>
                  <div className="typing-dot bg-blue-500 w-2.5 h-2.5 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }}></div>
                  <div className="typing-dot bg-blue-400 w-2.5 h-2.5 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.6s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>
    );
  }, [messages, isTyping, error, RuleTable]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Chat with Rule Master AI</h1>
            <button 
              onClick={handleStartNewConversation}
              className="group px-4 py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white text-sm transition-all duration-150 flex items-center shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>New Conversation</span>
            </button>
          </div>
          
          {/* Messages Container */}
          {MessageList}

          {/* Example Templates */}
          {messages.length <= 3 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {exampleTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(template)}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 text-sm py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] border border-gray-200"
                    disabled={isLoading}
                  >
                    {template.length > 60 ? template.substring(0, 60) + '...' : template}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow transition-shadow bg-gray-50 hover:bg-white"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={`group px-6 py-3 rounded-lg transition-all flex items-center ${
                isLoading || !inputMessage.trim()
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  Send
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;