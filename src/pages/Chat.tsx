import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { chatWithAI } from '../services/api';

// Storage key for chat messages
const STORAGE_KEY = 'chat_messages';
const PAGINATION_KEY = 'chat_pagination';

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced function to save messages to localStorage
  const debouncedSaveMessages = useCallback((newMessages: Message[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      localStorageUtil.set(STORAGE_KEY, newMessages);
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
    localStorageUtil.set(PAGINATION_KEY, currentPage);
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
      const aiMessageIndex = messages.length + 1; // User message + AI placeholder
      
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
            ...prev.slice(0, aiMessageIndex),
            {
              ...prev[aiMessageIndex],
              text: aiResponseText,
              ruleData: ruleData,
              isStreaming: false
            }
          ]);
        } else {
          // Simulate streaming text response for a more engaging experience
          simulateStreamingResponse(aiResponseText, aiMessageIndex);
        }
      } else {
        setError('Failed to get response from AI');
        // Remove the placeholder message
        setMessages(prev => prev.slice(0, -1));
        console.error('API Error:', response.message);
      }
    } catch (err) {
      setError('An error occurred while communicating with the AI');
      // Remove the placeholder message
      setMessages(prev => prev.slice(0, -1));
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewConversation = () => {
    const initialMessage = {
      text: "Hello! I'm Rule Master AI. I can help you write, understand, and evaluate business rules. How can I assist you today?",
      sender: 'ai' as const,
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
    setCurrentPage({});
    
    // Clear stored conversation from localStorage
    localStorageUtil.remove(STORAGE_KEY);
    localStorageUtil.remove(PAGINATION_KEY);
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
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="font-bold text-blue-500">AI</span>
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
                  <div className="inline-block h-4 w-2 ml-1 bg-blue-500 animate-pulse rounded-full"></div>
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
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-2">
                  <span className="font-bold text-white">You</span>
                </div>
              )}
            </div>
          ))
        )}
        {isTyping && !messages[messages.length - 1]?.isStreaming && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <span className="font-bold text-blue-500">AI</span>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border border-gray-200 rounded-lg p-4 max-w-[80%] shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
              className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 text-sm transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Start New Conversation
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
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 px-4 rounded-full transition-colors"
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
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={`px-6 py-3 rounded-lg transition-all flex items-center ${
                isLoading || !inputMessage.trim()
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
              }`}
            >
              {isLoading ? 'Sending...' : (
                <>
                  Send
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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