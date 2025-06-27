import React, { useState } from 'react';
import Modal from './Modal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
    };
  };
  onSave: (data: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userData,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    socialLinks: {
      facebook: userData.socialLinks?.facebook || '',
      twitter: userData.socialLinks?.twitter || '',
      linkedin: userData.socialLinks?.linkedin || '',
      instagram: userData.socialLinks?.instagram || '',
    },
    personalInfo: {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone || '',
    },
  });

  const handleInputChange = (
    section: 'socialLinks' | 'personalInfo',
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Personal Information"
      subtitle="Update your details to keep your profile up-to-date."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Social Links */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                placeholder="https://www.facebook.com/PimjoHQ"
                value={formData.socialLinks.facebook}
                onChange={(e) =>
                  handleInputChange('socialLinks', 'facebook', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                X.com
              </label>
              <input
                type="url"
                placeholder="https://x.com/PimjoHQ"
                value={formData.socialLinks.twitter}
                onChange={(e) =>
                  handleInputChange('socialLinks', 'twitter', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                placeholder="https://www.linkedin.com/company/pimjo"
                value={formData.socialLinks.linkedin}
                onChange={(e) =>
                  handleInputChange('socialLinks', 'linkedin', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                placeholder="https://instagram.com/PimjoHQ"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  handleInputChange('socialLinks', 'instagram', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                value={formData.personalInfo.firstName}
                onChange={(e) =>
                  handleInputChange('personalInfo', 'firstName', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                value={formData.personalInfo.lastName}
                onChange={(e) =>
                  handleInputChange('personalInfo', 'lastName', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.personalInfo.email}
                onChange={(e) =>
                  handleInputChange('personalInfo', 'email', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.personalInfo.phone}
                onChange={(e) =>
                  handleInputChange('personalInfo', 'phone', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg focus:outline-none"
          >
            Close
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal; 