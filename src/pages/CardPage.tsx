import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  History, 
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button, Card } from '../components/ui';
import { CryptoCard } from '../components/card/CryptoCard';
import { CardIntroSection } from '../components/card/CardIntroSection';
import { CardStatsWidget } from '../components/card/CardStatsWidget';
import { CardTransactionItem, Transaction } from '../components/card/CardTransactionItem';
import { useWeb3Auth } from '../providers/Web3AuthProvider';

const CardPage: React.FC = () => {
  const { user } = useWeb3Auth();
  const [hasCard, setHasCard] = useState(false);
  const [isCardLocked, setIsCardLocked] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'settings'>('overview');

  // Mock data
  const cardData = {
    number: showCardDetails ? '4532 1234 5678 9012' : '•••• •••• •••• 9012',
    holder: user?.name?.toUpperCase() || 'JOHN DOE',
    expiry: '12/26',
    balance: '2,450.00',
    cvv: showCardDetails ? '123' : '•••'
  };

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'purchase',
      merchant: 'Amazon Web Services',
      category: 'shopping',
      amount: 89.99,
      date: 'Today',
      time: '14:32',
      status: 'completed'
    },
    {
      id: '2',
      type: 'topup',
      merchant: 'Crypto Top-up',
      category: 'other',
      amount: 500.00,
      date: 'Today',
      time: '10:15',
      status: 'completed'
    },
    {
      id: '3',
      type: 'purchase',
      merchant: 'Starbucks',
      category: 'food',
      amount: 12.50,
      date: 'Yesterday',
      time: '08:45',
      status: 'completed'
    },
    {
      id: '4',
      type: 'purchase',
      merchant: 'Uber',
      category: 'transport',
      amount: 24.80,
      date: 'Yesterday',
      time: '18:20',
      status: 'pending'
    },
    {
      id: '5',
      type: 'refund',
      merchant: 'Netflix Refund',
      category: 'entertainment',
      amount: 15.99,
      date: '2 days ago',
      time: '12:00',
      status: 'completed'
    }
  ];

  const handleApplyCard = () => {
    // Simulate card application
    setTimeout(() => {
      setHasCard(true);
    }, 1000);
  };

  const handleTopUp = () => {
    // Handle top-up logic
    console.log('Top up clicked');
  };

  const handleToggleCardLock = () => {
    setIsCardLocked(!isCardLocked);
  };

  const handleToggleCardDetails = () => {
    setShowCardDetails(!showCardDetails);
  };

  // If user hasn't applied for a card yet, show intro section
  if (!hasCard) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-4 md:p-6">
          <CardIntroSection onApply={handleApplyCard} />
        </div>
      </div>
    );
  }

  // Card management interface
  return (
    <div className="h-full overflow-auto">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Your MineCore Card
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Manage your crypto card and track spending
          </p>
        </div>

        {/* Card Display Section */}
        <div className="mb-8">
          <CryptoCard
            cardNumber={cardData.number}
            cardHolder={cardData.holder}
            expiryDate={cardData.expiry}
            balance={cardData.balance}
            variant={isCardLocked ? 'dark' : 'gradient'}
          />
          
          {/* Card Actions */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button
              variant="outline"
              size="sm"
              icon={showCardDetails ? EyeOff : Eye}
              onClick={handleToggleCardDetails}
            >
              {showCardDetails ? 'Hide' : 'Show'} Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={isCardLocked ? Unlock : Lock}
              onClick={handleToggleCardLock}
              className={isCardLocked ? 'text-red-600 border-red-300' : ''}
            >
              {isCardLocked ? 'Unlock' : 'Lock'} Card
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleTopUp}
            >
              Top Up
            </Button>
          </div>

          {/* Card Status */}
          {isCardLocked && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-sm text-red-700">
                Your card is currently locked. Unlock it to make transactions.
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CardStatsWidget
                title="Current Balance"
                value={`$${cardData.balance}`}
                change={12.5}
                icon="dollar"
              />
              <CardStatsWidget
                title="This Month Spent"
                value="$342.29"
                change={-8.2}
                icon="trend"
              />
              <CardStatsWidget
                title="Transactions"
                value="28"
                change={15}
                icon="activity"
              />
            </div>

            {/* Recent Transactions */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('transactions')}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-2">
                {transactions.slice(0, 3).map((transaction) => (
                  <CardTransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="flex flex-col items-center py-6">
                <Plus className="w-6 h-6 mb-2" />
                <span>Top Up</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-6">
                <RefreshCw className="w-6 h-6 mb-2" />
                <span>Replace Card</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-6">
                <Download className="w-6 h-6 mb-2" />
                <span>Statement</span>
              </Button>
              <Button variant="outline" className="flex flex-col items-center py-6">
                <History className="w-6 h-6 mb-2" />
                <span>History</span>
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction History</h3>
              <div className="flex space-x-4">
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2">
                  <option>All Transactions</option>
                  <option>Purchases</option>
                  <option>Top-ups</option>
                  <option>Refunds</option>
                </select>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <CardTransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline">Load More Transactions</Button>
            </div>
          </Card>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Card Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">Transaction Notifications</p>
                    <p className="text-sm text-gray-500">Get notified for every transaction</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">International Transactions</p>
                    <p className="text-sm text-gray-500">Allow transactions outside your country</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-gray-900">Online Transactions</p>
                    <p className="text-sm text-gray-500">Enable online and e-commerce purchases</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Contactless Payments</p>
                    <p className="text-sm text-gray-500">Tap to pay with your physical card</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Spending Limits</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Limit
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      defaultValue="1000"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <span className="text-gray-500">USD</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Limit
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      defaultValue="10000"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    />
                    <span className="text-gray-500">USD</span>
                  </div>
                </div>
                
                <Button variant="primary" className="w-full">
                  Update Limits
                </Button>
              </div>
            </Card>
            
            <Card className="border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you cancel your card, this action cannot be undone.
              </p>
              <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                Cancel Card
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPage;