import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import RulesTable from '../components/RulesTable';
import { RulesData } from '../types/table';
import { useTheme } from '../context/ThemeContext';

// Rename the component from Tables to ViewRules for clarity
const ViewRules: React.FC = () => {
  const { isDark } = useTheme();

  // Sample rules data - in real application, this would come from an API
  const rulesData: RulesData = [
    {
      id: '1',
      name: 'Discount Rule',
      description: 'Apply 10% discount if order value is greater than $100',
      condition: 'if order.value > 100',
      action: 'apply discount 10%',
      category: 'Sales',
      createdAt: '2023-08-15',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Shipping Fee Waiver',
      description: 'Waive shipping fee for premium customers',
      condition: 'if customer.type === "premium"',
      action: 'waive shipping fee',
      category: 'Shipping',
      createdAt: '2023-09-05',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Fraud Detection',
      description: 'Flag transaction if amount exceeds typical customer spending',
      condition: 'if transaction.amount > customer.averageSpending * 2',
      action: 'flag transaction for review',
      category: 'Security',
      createdAt: '2023-10-10',
      status: 'Inactive'
    },
    {
      id: '4',
      name: 'Customer Tier Assignment',
      description: 'Assign customer tier based on annual spending',
      condition: 'if customer.annualSpending > 5000',
      action: 'set customer.tier = "gold"',
      category: 'Customer Management',
      createdAt: '2023-11-20',
      status: 'Draft'
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>View Rules</h1>
        </div>

        {/* Rules Table Section */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
          <h2 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Business Rules</h2>
          <RulesTable data={rulesData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

// Export with the original name to maintain compatibility with existing routes
export default ViewRules; 