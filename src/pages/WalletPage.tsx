import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react';
import { Card } from '../components/ui';

const WalletPage: React.FC = () => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wallet</h2>
          <p className="text-gray-600">Manage your digital assets and transaction history.</p>
        </div>

        {/* Coming Soon Card */}
        <Card className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Wallet Features Coming Soon</h3>
            <p className="text-gray-600 mb-8">
              A comprehensive wallet system for managing your mining earnings, 
              deposits, withdrawals, and transaction history.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                  <ArrowDownLeft className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Deposits</h4>
                  <p className="text-sm text-gray-600">Add funds easily</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Withdrawals</h4>
                  <p className="text-sm text-gray-600">Cash out anytime</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">History</h4>
                  <p className="text-sm text-gray-600">Track all transactions</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;