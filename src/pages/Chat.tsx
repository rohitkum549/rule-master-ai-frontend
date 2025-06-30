import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { chatWithAI } from '../services/api';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  ruleData?: RuleData;
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
  "For transactions over $1000, require secondary approval from a manager before processing."
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm Rule Master AI. I can help you write, understand, and evaluate business rules. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<{[messageIndex: number]: number}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePageChange = (messageIndex: number, page: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [messageIndex]: page
    }));
  };

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

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setError(null);
    setIsLoading(true);

    try {
      // Call the AI API
      const response = await chatWithAI({ prompt: userMessage.text });
      
      if (response.success && response.data) {
        let aiMessage: Message = {
          text: response.data.response || response.data.message || '',
          sender: 'ai',
          timestamp: new Date(),
        };

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
          
          aiMessage.ruleData = ruleData;
          
          // Set initial page for this message
          const newMessageIndex = messages.length;
          setCurrentPage(prev => ({
            ...prev,
            [newMessageIndex]: 1
          }));
          
          if (!aiMessage.text) {
            aiMessage.text = `I found ${ruleData.rules.length} rules matching your criteria.`;
          }
        }
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError('Failed to get response from AI');
        console.error('API Error:', response.message);
      }
    } catch (err) {
      setError('An error occurred while communicating with the AI');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const RuleTable: React.FC<{rules: Rule[], messageIndex: number}> = ({ rules, messageIndex }) => {
    const page = currentPage[messageIndex] || 1;
    const itemsPerPage = 3;
    const startIndex = (page - 1) * itemsPerPage;
    const displayedRules = rules.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(rules.length / itemsPerPage);
    
    return (
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conditions</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedRules.map((rule) => (
              <tr key={rule.id}>
                <td className="px-3 py-2 text-sm text-gray-900">{rule.title}</td>
                <td className="px-3 py-2 text-sm text-gray-900">{rule.department}</td>
                <td className="px-3 py-2 text-sm text-gray-900">
                  <ul className="list-disc list-inside">
                    {rule.rule_conditions.map((condition, i) => (
                      <li key={i}>
                        {condition.field} {condition.operator} {condition.value}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-2 text-sm text-gray-900">
                  <ul className="list-disc list-inside">
                    {rule.rule_actions.map((action, i) => (
                      <li key={i}>
                        {action.type}: {action.value}
                      </li>
                    ))}
                  </ul>
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
              className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-gray-100">
              Page {page} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(messageIndex, Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Chat with Rule Master AI</h1>
            <button 
              onClick={() => setMessages([{
                text: "Hello! I'm Rule Master AI. I can help you write, understand, and evaluate business rules. How can I assist you today?",
                sender: 'ai',
                timestamp: new Date(),
              }])}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Start New Conversation
            </button>
          </div>
          
          {/* Messages Container */}
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
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text && (
                      <p className="whitespace-pre-wrap break-words mb-2">{message.text}</p>
                    )}
                    
                    {message.ruleData && message.ruleData.rules.length > 0 && (
                      <RuleTable rules={message.ruleData.rules} messageIndex={index} />
                    )}
                    
                    <span className="text-xs opacity-75 mt-1 block">
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="font-bold text-blue-500">AI</span>
                </div>
                <div className="bg-gray-100 text-gray-800 rounded-lg p-4 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

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
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={`px-6 py-3 rounded-lg transition-colors ${
                isLoading || !inputMessage.trim()
                  ? 'bg-blue-300 text-white cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat; 