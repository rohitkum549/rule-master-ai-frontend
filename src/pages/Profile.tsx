import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Edit, Facebook, Twitter, Linkedin, Instagram } from 'react-feather';
import EditProfileModal from '../components/EditProfileModal';

const Profile: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSection, setEditSection] = useState<'personal' | 'address' | null>(null);

  // Mock user data - replace with actual user data from your auth system
  const [userData, setUserData] = useState({
    firstName: "Musharof",
    lastName: "Chowdhury",
    email: "randomuser@pimjo.com",
    phone: "+09 363 398 46",
    position: "Team Manager",
    location: "Arizona, United States",
    bio: "Team Manager",
    address: {
      country: "United States",
      cityState: "Phoenix, Arizona, United States",
      postalCode: "ERT 2489",
      taxId: "AS4568384"
    },
    socialLinks: {
      facebook: "https://www.facebook.com/PimjoHQ",
      twitter: "https://x.com/PimjoHQ",
      linkedin: "https://www.linkedin.com/company/pimjo",
      instagram: "https://instagram.com/PimjoHQ"
    },
    avatar: "https://ui-avatars.com/api/?name=Musharof+Chowdhury&background=random&size=200"
  });

  const handleEditClick = (section: 'personal' | 'address') => {
    setEditSection(section);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = (newData: any) => {
    setUserData(prev => ({
      ...prev,
      ...newData.personalInfo,
      socialLinks: newData.socialLinks
    }));
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Profile</h1>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <img
                  src={userData.avatar}
                  alt={`${userData.firstName} ${userData.lastName}`}
                  className="w-24 h-24 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <div className="text-gray-600 mt-1">
                    {userData.position} • {userData.location}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <a href={userData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100">
                  <Facebook className="w-5 h-5 text-gray-600" />
                </a>
                <a href={userData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100">
                  <Twitter className="w-5 h-5 text-gray-600" />
                </a>
                <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100">
                  <Linkedin className="w-5 h-5 text-gray-600" />
                </a>
                <a href={userData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100">
                  <Instagram className="w-5 h-5 text-gray-600" />
                </a>
                <button 
                  onClick={() => handleEditClick('personal')}
                  className="ml-2 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <button 
                onClick={() => handleEditClick('personal')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500">First Name</label>
                <div className="mt-1 text-gray-900">{userData.firstName}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500">Last Name</label>
                <div className="mt-1 text-gray-900">{userData.lastName}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500">Email address</label>
                <div className="mt-1 text-gray-900">{userData.email}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500">Phone</label>
                <div className="mt-1 text-gray-900">{userData.phone}</div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm text-gray-500">Bio</label>
                <div className="mt-1 text-gray-900">{userData.bio}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Address</h2>
              <button 
                onClick={() => handleEditClick('address')}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500">Country</label>
                <div className="mt-1 text-gray-900">{userData.address.country}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500">City/State</label>
                <div className="mt-1 text-gray-900">{userData.address.cityState}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500">Postal Code</label>
                <div className="mt-1 text-gray-900">{userData.address.postalCode}</div>
              </div>

              <div>
                <label className="block text-sm text-gray-500">TAX ID</label>
                <div className="mt-1 text-gray-900">{userData.address.taxId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        onSave={handleSaveChanges}
      />
    </DashboardLayout>
  );
};

export default Profile; 