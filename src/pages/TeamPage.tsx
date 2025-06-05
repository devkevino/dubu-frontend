import React from 'react';
import { Users, UserPlus, Gift } from 'lucide-react';
import { Card } from '../components/ui';

const TeamPage: React.FC = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Team & Referrals</h2>
          <p className="text-gray-600">Invite friends and earn bonus rewards together.</p>
        </div>

        {/* Coming Soon Card */}
        <Card className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Features Coming Soon</h3>
            <p className="text-gray-600 mb-8">
              We're working on an amazing referral system that will let you invite friends 
              and earn bonus mining rewards together.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                  <UserPlus className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Invite System</h4>
                  <p className="text-sm text-gray-600">Send referral codes to friends</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                  <Gift className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Bonus Rewards</h4>
                  <p className="text-sm text-gray-600">Extra mining bonuses</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeamPage;