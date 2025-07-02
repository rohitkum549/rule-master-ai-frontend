import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import RuleCard from '../components/RuleCard';
import { useTheme } from '../context/ThemeContext';
import { fetchRules, deleteRule } from '../services/api';
import { ChevronLeft, ChevronRight, Plus, Upload, Download } from 'react-feather';
import Modal from '../components/Modal';
import AlertPopup from '../components/AlertPopup';

interface Rule {
  id: string;
  title: string;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  department: string;
  is_active: boolean;
  logic: string;
  rule_conditions: {
    id: string;
    field: string;
    value: string;
    rule_id: string;
    operator: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string | null;
  }[];
  rule_actions: {
    id: string;
    type: string;
    value: string;
    rule_id: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string | null;
  }[];
}

const Rules: React.FC = () => {
  const { isDark } = useTheme();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRules, setTotalRules] = useState<number>(0);
  const [itemsPerPage] = useState<number>(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  useEffect(() => {
    const loadRules = async () => {
      try {
        setLoading(true);
        const response = await fetchRules({
          page: currentPage,
          limit: itemsPerPage,
          isActive: true
        });
        
        setRules(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalRules(response.pagination.total);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load rules');
        setRules([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadRules();
  }, [currentPage, itemsPerPage]);
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleEditRule = (rule: Rule) => {
    // Handle edit logic - can be implemented to navigate to edit page
    console.log('Edit rule:', rule.id);
    // For example: navigate to edit page
    // history.push(`/rules/edit/${rule.id}`);
  };

  const handleDeleteRule = (rule: Rule) => {
    setSelectedRule(rule);
    setDeleteModalOpen(true);
  };

  const confirmDeleteRule = async () => {
    if (!selectedRule) return;
    
    try {
      setDeleteLoading(true);
      const response = await deleteRule(selectedRule.id);
      
      if (response.success) {
        // Update local state
        setRules(rules.filter(rule => rule.id !== selectedRule.id));
        setAlertMessage({
          type: 'success',
          message: 'Rule deleted successfully'
        });
        
        // Update total count
        setTotalRules(prev => prev - 1);
        
        // If we deleted the last item on the page and it's not the first page,
        // go to the previous page
        if (rules.length === 1 && currentPage > 1) {
          handlePageChange(currentPage - 1);
        }
      } else {
        setAlertMessage({
          type: 'error',
          message: response.message || 'Failed to delete rule'
        });
      }
    } catch (err) {
      console.error('Failed to delete rule:', err);
      setAlertMessage({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete rule'
      });
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setSelectedRule(null);
    }
  };
  
  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);
  
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Show alert message */}
        {alertMessage && (
          <AlertPopup 
            type={alertMessage.type}
            message={alertMessage.message}
            onClose={() => setAlertMessage(null)}
            isOpen={!!alertMessage}
          />
        )}
        
        {/* Header section with title and actions */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              View Rules
            </h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Create, manage, and test your business logic.
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className={`px-3 py-2 rounded-md text-sm flex items-center ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
              <Upload size={16} className="mr-2" />
              Import
            </button>
            <button className={`px-3 py-2 rounded-md text-sm flex items-center ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button className="px-3 py-2 rounded-md text-sm font-medium bg-blue-600 text-white flex items-center">
              <Plus size={16} className="mr-2" />
              Add Rule
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        {loading ? (
          <div className={`w-full flex justify-center items-center py-20 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading rules...
          </div>
        ) : error ? (
          <div className="w-full py-10 text-center">
            <div className="bg-red-100 text-red-800 p-4 rounded-md inline-block">
              {error}
            </div>
          </div>
        ) : rules.length === 0 ? (
          <div className={`w-full py-16 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="text-lg">No rules found.</p>
            <p className="mt-2">Create your first rule using the "Add Rule" button.</p>
          </div>
        ) : (
          <>
            {/* Grid of rule cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {rules.map((rule) => (
                <RuleCard
                  key={rule.id}
                  title={rule.title}
                  department={rule.department}
                  conditions={rule.rule_conditions}
                  actions={rule.rule_actions}
                  updatedAt={rule.updated_at}
                  onEdit={() => handleEditRule(rule)}
                  onDelete={() => handleDeleteRule(rule)}
                />
              ))}
            </div>
            
            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-8">
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Showing {rules.length} of {totalRules} rules
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                </button>
                
                {/* Page number buttons */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calculate which page numbers to show
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : isDark
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed'
                      : isDark
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteModalOpen(false);
            setSelectedRule(null);
          }
        }}
        title="Delete Rule"
      >
        <div className="p-6">
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Are you sure you want to delete the rule "{selectedRule?.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedRule(null);
              }}
              disabled={deleteLoading}
              className={`px-4 py-2 rounded-md ${
                deleteLoading ? 'opacity-50 cursor-not-allowed' : 
                isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteRule}
              disabled={deleteLoading}
              className={`px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center ${
                deleteLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {deleteLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Rules; 