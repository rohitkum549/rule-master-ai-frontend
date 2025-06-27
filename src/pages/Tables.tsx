import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import BasicTable from '../components/BasicTable';
import { TableData } from '../types/table';

const Tables: React.FC = () => {
  // HARDCODED DATA: Replace this with actual data from your API/backend
  const tableData: TableData = [
    {
      id: '1',
      user: {
        name: 'Lindsey Curtis',
        role: 'Web Designer',
        // TODO: Replace with actual user avatar from your user management system
        avatar: 'https://ui-avatars.com/api/?name=Lindsey+Curtis&background=random',
      },
      projectName: 'Agency Website',
      // TODO: Replace with actual team members data from your team management system
      team: [
        { id: 't1', name: 'Member 1', avatar: 'https://ui-avatars.com/api/?name=M1&background=random' },
        { id: 't2', name: 'Member 2', avatar: 'https://ui-avatars.com/api/?name=M2&background=random' },
        { id: 't3', name: 'Member 3', avatar: 'https://ui-avatars.com/api/?name=M3&background=random' },
      ],
      status: 'Active',
      budget: '3.9K'
    },
    {
      id: '2',
      user: {
        name: 'Kaiya George',
        role: 'Project Manager',
        avatar: 'https://ui-avatars.com/api/?name=Kaiya+George&background=random',
      },
      projectName: 'Technology',
      team: [
        { id: 't4', name: 'Member 4', avatar: 'https://ui-avatars.com/api/?name=M4&background=random' },
        { id: 't5', name: 'Member 5', avatar: 'https://ui-avatars.com/api/?name=M5&background=random' },
      ],
      status: 'Pending',
      budget: '24.9K'
    },
    {
      id: '3',
      user: {
        name: 'Zain Geldt',
        role: 'Content Writing',
        avatar: 'https://ui-avatars.com/api/?name=Zain+Geldt&background=random',
      },
      projectName: 'Blog Writing',
      team: [
        { id: 't6', name: 'Member 6', avatar: 'https://ui-avatars.com/api/?name=M6&background=random' },
      ],
      status: 'Active',
      budget: '12.7K'
    },
    {
      id: '4',
      user: {
        name: 'Abram Schleifer',
        role: 'Digital Marketer',
        avatar: 'https://ui-avatars.com/api/?name=Abram+Schleifer&background=random',
      },
      projectName: 'Social Media',
      team: [
        { id: 't7', name: 'Member 7', avatar: 'https://ui-avatars.com/api/?name=M7&background=random' },
        { id: 't8', name: 'Member 8', avatar: 'https://ui-avatars.com/api/?name=M8&background=random' },
        { id: 't9', name: 'Member 9', avatar: 'https://ui-avatars.com/api/?name=M9&background=random' },
      ],
      status: 'Cancel',
      budget: '2.8K'
    },
    {
      id: '5',
      user: {
        name: 'Carla George',
        role: 'Front-end Developer',
        avatar: 'https://ui-avatars.com/api/?name=Carla+George&background=random',
      },
      projectName: 'Website',
      team: [
        { id: 't10', name: 'Member 10', avatar: 'https://ui-avatars.com/api/?name=M10&background=random' },
        { id: 't11', name: 'Member 11', avatar: 'https://ui-avatars.com/api/?name=M11&background=random' },
        { id: 't12', name: 'Member 12', avatar: 'https://ui-avatars.com/api/?name=M12&background=random' },
      ],
      status: 'Active',
      budget: '4.5K'
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Basic Tables</h1>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
                </li>
                <li>
                  <span className="text-gray-400 mx-2">›</span>
                  <span className="text-gray-900">Basic Tables</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Table 1</h2>
          <BasicTable data={tableData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tables; 