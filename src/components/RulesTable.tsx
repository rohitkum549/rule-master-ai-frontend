import React from 'react';
import { RulesData } from '../types/table';
import { Edit2, Trash2 } from 'react-feather';
import { useTheme } from '../context/ThemeContext';

interface RulesTableProps {
  data: RulesData;
}

const RulesTable: React.FC<RulesTableProps> = ({ data }) => {
  const { isDark } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                Name
              </th>
              <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                Description
              </th>
              <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                Category
              </th>
              <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                Created At
              </th>
              <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                Status
              </th>
              <th className={`text-left py-4 px-6 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <td colSpan={6} className={`py-8 px-6 text-center ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  No rules found. Create your first rule using the chat interface.
                </td>
              </tr>
            ) : (
              data.map((rule) => (
                <tr 
                  key={rule.id} 
                  className={`${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} border-b last:border-b-0`}
                >
                  <td className={`py-4 px-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <div className="font-medium">{rule.name}</div>
                  </td>
                  <td className={`py-4 px-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="max-w-xs truncate">{rule.description}</div>
                  </td>
                  <td className={`py-4 px-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {rule.category}
                  </td>
                  <td className={`py-4 px-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {rule.createdAt}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}
                    >
                      {rule.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-3">
                      <button 
                        className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        title="Edit Rule"
                      >
                        <Edit2 className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                      <button 
                        className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                        title="Delete Rule"
                      >
                        <Trash2 className={`w-4 h-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RulesTable; 