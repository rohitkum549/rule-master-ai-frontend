import React from 'react';
import { TableData } from '../types/table';

interface BasicTableProps {
  data: TableData;
}

const BasicTable: React.FC<BasicTableProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">User</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Project Name</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Team</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Budget</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <img
                      src={row.user.avatar}
                      alt={row.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{row.user.name}</div>
                      <div className="text-sm text-gray-500">{row.user.role}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-900">{row.projectName}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex -space-x-2">
                    {row.team.map((member) => (
                      <img
                        key={member.id}
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        title={member.name}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : row.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-gray-900">${row.budget}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BasicTable; 