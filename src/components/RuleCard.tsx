import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { MoreVertical, Edit, Trash2 } from 'react-feather';

interface RuleCondition {
  id: string;
  field: string;
  value: string;
  rule_id: string;
  operator: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
}

interface RuleAction {
  id: string;
  type: string;
  value: string;
  rule_id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string | null;
}

interface RuleCardProps {
  title: string;
  department?: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  updatedAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({
  title,
  department,
  conditions,
  actions,
  updatedAt,
  onEdit,
  onDelete,
}) => {
  const { isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to format the condition for display
  const formatCondition = (condition: RuleCondition) => {
    // Keep original operator symbols
    const operatorMap: Record<string, string> = {
      '>': '>',
      '<': '<',
      '>=': '>=',
      '<=': '<=',
      '=': '=',
      '!=': '!=',
      'contains': 'contains',
      'startsWith': 'startsWith',
      'endsWith': 'endsWith',
    };

    const operator = operatorMap[condition.operator] || condition.operator;
    
    return {
      field: condition.field,
      operator: operator,
      value: condition.value,
    };
  };

  // Format date to display in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Function to generate a description based on the first condition and action
  const generateDescription = () => {
    if (conditions.length === 0 || actions.length === 0) return '';
    
    const firstCondition = conditions[0];
    const firstAction = actions[0];
    
    // Example: "Offer a 10% discount to customers who have spent over $1000 in the last year."
    if (firstAction.type === 'calculation' && firstCondition.field.includes('spend')) {
      return `Offer a ${firstAction.value}% discount to customers who have spent over $${firstCondition.value} in the last year.`;
    }
    
    // Example: "Send a notification when stock for Product X drops below 50 units."
    if (firstAction.type === 'notification' && firstCondition.field.includes('stock')) {
      return `Send a notification to the supply chain manager when stock for Product ${firstCondition.value} drops below ${conditions[1]?.value || ''} units.`;
    }
    
    // Example: "Require manager approval for transactions over $1000."
    if (firstAction.type === 'require_approval' && firstCondition.field.includes('amount')) {
      return `Require ${firstAction.value} approval for transactions over $${firstCondition.value}.`;
    }
    
    return `Apply a rule based on ${firstCondition.field} with action ${firstAction.type}.`;
  };

  return (
    <div className={`rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white border border-gray-700' 
        : 'bg-white text-gray-900 border border-gray-100'
    }`}>
      <div className="p-5">
        {/* Header with title and menu */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold tracking-tight">{title}</h3>
          <div className="relative" ref={menuRef}>
            <button 
              className={`p-1.5 rounded-full transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical size={16} />
            </button>
            
            {/* Dropdown menu */}
            {menuOpen && (
              <div className={`absolute right-0 mt-1 w-36 rounded-md shadow-lg z-10 ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onEdit) onEdit();
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      isDark 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (onDelete) onDelete();
                    }}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      isDark 
                        ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' 
                        : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                    }`}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Badge for department if exists */}
        {department && (
          <div className="mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
            }`}>
              {department}
            </span>
          </div>
        )}
        
        {/* Description */}
        <p className={`text-sm mb-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {generateDescription()}
        </p>
        
        {/* Conditions Section */}
        <div className={`mb-5 p-3 rounded-lg ${isDark ? 'bg-gray-900/70' : 'bg-gray-50'}`}>
          <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Conditions
          </h4>
          <div className="space-y-2.5">
            {conditions.map((condition) => {
              const formattedCondition = formatCondition(condition);
              return (
                <div key={condition.id} className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1.5 rounded-md text-xs font-medium ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {formattedCondition.field}
                  </span>
                  <span className={`px-2.5 py-1.5 rounded-md text-xs font-medium ${
                    isDark ? 'bg-blue-800 text-blue-200' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {formattedCondition.operator}
                  </span>
                  <span className={`px-2.5 py-1.5 rounded-md text-xs font-medium ${
                    isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {formattedCondition.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Actions Section */}
        <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-gray-900/70' : 'bg-gray-50'}`}>
          <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Actions
          </h4>
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <div key={action.id} className="inline-block">
                <span className={`px-2.5 py-1.5 rounded-md text-xs font-medium ${
                  isDark ? 'bg-purple-800 text-purple-200' : 'bg-purple-100 text-purple-800'
                }`}>
                  {action.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer with last updated information */}
      <div className={`px-5 py-3 text-xs border-t ${
        isDark 
          ? 'bg-gray-900/70 text-gray-400 border-gray-700' 
          : 'bg-gray-50 text-gray-500 border-gray-100'
      }`}>
        <div className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full mr-2 bg-green-500"></span>
          Last updated: {formatDate(updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default RuleCard; 