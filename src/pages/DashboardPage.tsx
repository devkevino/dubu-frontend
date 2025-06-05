import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Settings
} from 'lucide-react';
import { StatsCard } from '../components/ui';
import { useWeb3Auth } from '../providers/Web3AuthProvider';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, address, balance } = useWeb3Auth();

  const statsData = [
    {
      title: 'Total Earnings',
      value: '$45,231',
      change: '+20.1% from last month',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-6 h-6" />,
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Active Miners',
      value: '2,341',
      change: '+180 from last month',
      changeType: 'positive' as const,
      icon: <Users className="w-6 h-6" />,
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      title: 'Mining Efficiency',
      value: '3.24%',
      change: '-4.1% from last month',
      changeType: 'negative' as const,
      icon: <Activity className="w-6 h-6" />,
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Hash Rate',
      value: '12.5TH/s',
      change: '+2.3% from last month',
      changeType: 'positive' as const,
      icon: <Zap className="w-6 h-6" />,
      iconColor: 'bg-orange-100 text-orange-600'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'mining',
      title: 'Mining session completed',
      time: '2 minutes ago',
      amount: '+0.0023 BTC'
    },
    {
      id: 2,
      type: 'referral',
      title: 'New referral bonus received',
      time: '1 hour ago',
      amount: '+$50.00'
    },
    {
      id: 3,
      type: 'withdrawal',
      title: 'Withdrawal processed',
      time: '3 hours ago',
      amount: '-$1,200.00'
    },
    {
      id: 4,
      type: 'mining',
      title: 'Mining session started',
      time: '5 hours ago',
      amount: null
    }
  ];

  return (
    <div className="h-full overflow-auto">
      {/* Main Content */}
      <div className="p-4 md:p-6">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || user?.email?.split('@')[0] || 'Miner'}! 👋
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Here's what's happening with your mining operations today.
              </p>
              {user?.typeOfLogin && (
                <p className="text-xs text-blue-600 mt-1">
                  Logged in via {user.typeOfLogin}
                </p>
              )}
            </div>
            {user?.profileImage && (
              <div className="hidden md:block">
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                />
              </div>
            )}
          </div>
          
          {/* User Stats Bar */}
          {address && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-blue-700 font-medium">Wallet:</span>
                    <span className="text-blue-800 font-mono ml-2">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                  </div>
                  {balance && (
                    <div>
                      <span className="text-blue-700 font-medium">Balance:</span>
                      <span className="text-blue-800 ml-2">{parseFloat(balance).toFixed(4)} ETH</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Connected</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
              iconColor={stat.iconColor}
            />
          ))}
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              
              {/* Chart Placeholder */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-1">Chart visualization would go here</p>
                  <p className="text-sm text-gray-400">Real chart library integration needed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'mining' ? 'bg-blue-100' :
                    activity.type === 'referral' ? 'bg-green-100' :
                    'bg-orange-100'
                  }`}>
                    {activity.type === 'mining' ? (
                      <Zap className={`w-4 h-4 ${
                        activity.type === 'mining' ? 'text-blue-600' :
                        activity.type === 'referral' ? 'text-green-600' :
                        'text-orange-600'
                      }`} />
                    ) : activity.type === 'referral' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  
                  {activity.amount && (
                    <div className={`text-sm font-medium ${
                      activity.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activity.amount}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all activities
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 md:mt-8">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <button 
              onClick={() => navigate('/earn')}
              className="p-3 md:p-4 bg-white rounded-xl shadow-card border border-gray-100 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Zap className="w-4 md:w-5 h-4 md:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-900">Start Mining</p>
                  <p className="text-xs md:text-sm text-gray-600">Begin 24h session</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/team')}
              className="p-3 md:p-4 bg-white rounded-xl shadow-card border border-gray-100 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-900">Invite Friends</p>
                  <p className="text-xs md:text-sm text-gray-600">Earn referral bonus</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/wallet')}
              className="p-3 md:p-4 bg-white rounded-xl shadow-card border border-gray-100 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <ArrowDownRight className="w-4 md:w-5 h-4 md:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-900">Withdraw</p>
                  <p className="text-xs md:text-sm text-gray-600">Cash out earnings</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => navigate('/settings')}
              className="p-3 md:p-4 bg-white rounded-xl shadow-card border border-gray-100 hover:shadow-lg transition-all duration-200 text-left group"
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="p-1.5 md:p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Settings className="w-4 md:w-5 h-4 md:h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-900">Settings</p>
                  <p className="text-xs md:text-sm text-gray-600">Configure mining</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;