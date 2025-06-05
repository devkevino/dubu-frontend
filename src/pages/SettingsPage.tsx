import React from 'react';
import { Settings, Shield, Bell, Monitor } from 'lucide-react';
import { Card } from '../components/ui';

const SettingsPage: React.FC = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Settings</h2>
          <p className="text-sm md:text-base text-gray-600">Configure your mining preferences and account settings.</p>
        </div>

        {/* Coming Soon Card */}
        <Card className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Settings Panel Coming Soon</h3>
            <p className="text-gray-600 mb-8">
              Comprehensive settings to customize your mining experience, 
              security preferences, and notification settings.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <Monitor className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Mining Config</h4>
                  <p className="text-sm text-gray-600">Optimize performance</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-1">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Security</h4>
                  <p className="text-sm text-gray-600">Account protection</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                  <Bell className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Notifications</h4>
                  <p className="text-sm text-gray-600">Alert preferences</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;