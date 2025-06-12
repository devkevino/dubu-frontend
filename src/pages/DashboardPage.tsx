import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Wallet,
  CreditCard,
  Target,
  Crown,
  Star,
  Clock,
  Play,
  Pause,
  Gift,
  Award,
  Flame,
  RefreshCw,
  ExternalLink,
  UserPlus,
  Sparkles,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Bell,
  Calendar,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { StatsCard, Button, Card } from '../components/ui';
import { NetworkSwitch } from '../components/ui/NetworkSwitch';
import { useWeb3Auth } from '../providers/Web3AuthProvider';
import { CURRENT_NETWORK } from '../config/networks';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, address, balance, chainId, networkName, isConnected } = useWeb3Auth();
  
  // 마이닝 상태 (로컬스토리지에서 복원)
  const [miningStats, setMiningStats] = useState({
    isActive: false,
    currentSession: 0, // seconds
    todayEarnings: 0.0245,
    totalEarnings: 1.2345,
    efficiency: 87.3,
    hashRate: 15.2
  });

  // 팀 및 레퍼럴 데이터
  const [teamStats] = useState({
    teamName: 'Diamond Miners',
    teamRank: 3,
    teamMembers: 12,
    myReferrals: 5,
    referralEarnings: 0.125,
    monthlyCommission: 0.045
  });

  // 지갑 데이터
  const [walletStats] = useState({
    totalValue: 1250.45, // USD
    bnbBalance: parseFloat(balance || '0'),
    dubuBalance: 1234.5678,
    dubuPrice: 0.85, // USD per DUBU
    cardBalance: 750.30 // USDT
  });

  // 최근 활동
  const [recentActivities] = useState([
    {
      id: 1,
      type: 'mining',
      title: 'Mining session completed',
      description: '24-hour session • +0.0245 BNB earned',
      time: '2 minutes ago',
      amount: '+₿0.0245',
      icon: Zap,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      type: 'referral',
      title: 'Referral bonus received',
      description: 'Alice completed first mining session',
      time: '1 hour ago',
      amount: '+125 DUBU',
      icon: Gift,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 3,
      type: 'card',
      title: 'Card top-up completed',
      description: 'Charged 500 DUBU → 425 USDT',
      time: '3 hours ago',
      amount: '+$425.00',
      icon: CreditCard,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 4,
      type: 'team',
      title: 'Team rank improved',
      description: 'Diamond Miners moved to rank #3',
      time: '1 day ago',
      amount: null,
      icon: Crown,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ]);

  // 마이닝 상태 복원
  useEffect(() => {
    const savedMiningState = localStorage.getItem('miningState');
    if (savedMiningState) {
      const { isMining, startTime } = JSON.parse(savedMiningState);
      if (isMining && startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const TOTAL_MINING_TIME = 86400; // 24시간
        if (elapsed < TOTAL_MINING_TIME) {
          setMiningStats(prev => ({
            ...prev,
            isActive: true,
            currentSession: elapsed
          }));
        }
      }
    }
  }, []);

  // 통계 데이터 계산
  const statsData = useMemo(() => [
    {
      title: 'Total Portfolio',
      value: `$${walletStats.totalValue.toFixed(2)}`,
      change: '+12.5% this month',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-6 h-6" />,
      iconColor: 'bg-green-100 text-green-600',
      onClick: () => navigate('/wallet')
    },
    {
      title: 'Mining Efficiency',
      value: `${miningStats.efficiency.toFixed(1)}%`,
      change: miningStats.isActive ? 'Mining Active' : 'Mining Stopped',
      changeType: miningStats.isActive ? 'positive' as const : 'neutral' as const,
      icon: <Activity className="w-6 h-6" />,
      iconColor: 'bg-blue-100 text-blue-600',
      onClick: () => navigate('/earn')
    },
    {
      title: 'Team Rank',
      value: `#${teamStats.teamRank}`,
      change: `${teamStats.teamMembers} members`,
      changeType: 'positive' as const,
      icon: <Crown className="w-6 h-6" />,
      iconColor: 'bg-yellow-100 text-yellow-600',
      onClick: () => navigate('/team')
    },
    {
      title: 'Card Balance',
      value: `$${walletStats.cardBalance.toFixed(2)}`,
      change: 'USDT available',
      changeType: 'neutral' as const,
      icon: <CreditCard className="w-6 h-6" />,
      iconColor: 'bg-purple-100 text-purple-600',
      onClick: () => navigate('/card')
    }
  ], [miningStats, teamStats, walletStats, navigate]);

  // 시간 포맷팅
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 md:p-6">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <span className="mr-3">👋</span>
                Welcome back, {user?.name || user?.email?.split('@')[0] || 'Miner'}!
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Here's your mining empire overview
              </p>
            </div>
            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              icon={Settings}
              className="hidden md:flex"
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Network Switch */}
        <NetworkSwitch />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {statsData.map((stat, index) => (
            <div key={index} onClick={stat.onClick} className="cursor-pointer">
              <StatsCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                icon={stat.icon}
                iconColor={stat.iconColor}
              />
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Mining Status */}
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Mining Status
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                miningStats.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {miningStats.isActive ? 'ACTIVE' : 'STOPPED'}
              </div>
            </div>

            <div className="space-y-4">
              {/* Current Session */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Current Session</p>
                  <p className="font-bold text-gray-900">
                    {miningStats.isActive ? formatTime(miningStats.currentSession) : '--:--:--'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="font-medium text-blue-600">
                    {miningStats.isActive ? `${((miningStats.currentSession / 86400) * 100).toFixed(1)}%` : '0%'}
                  </p>
                </div>
              </div>

              {/* Hash Rate & Efficiency */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{miningStats.hashRate} TH/s</p>
                  <p className="text-xs text-gray-600">Hash Rate</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-600">{miningStats.efficiency}%</p>
                  <p className="text-xs text-gray-600">Efficiency</p>
                </div>
              </div>

              {/* Mining Action */}
              <Button
                onClick={() => navigate('/earn')}
                variant={miningStats.isActive ? "secondary" : "primary"}
                className="w-full"
                icon={miningStats.isActive ? Pause : Play}
              >
                {miningStats.isActive ? 'Manage Mining' : 'Start Mining'}
              </Button>
            </div>
          </Card>

          {/* Portfolio Overview */}
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Portfolio
              </h3>
              <Button
                onClick={() => navigate('/wallet')}
                variant="outline"
                size="sm"
                icon={ArrowUpRight}
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {/* Total Value */}
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  ${walletStats.totalValue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Portfolio Value</p>
                <div className="flex items-center justify-center mt-2 text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">+12.5%</span>
                </div>
              </div>

              {/* Asset Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">₿</span>
                    </div>
                    <span className="text-sm font-medium">BNB</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{walletStats.bnbBalance.toFixed(4)}</p>
                    <p className="text-xs text-gray-500">
                      ${(walletStats.bnbBalance * 350).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs">🪙</span>
                    </div>
                    <span className="text-sm font-medium">DUBU</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{walletStats.dubuBalance.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      ${(walletStats.dubuBalance * walletStats.dubuPrice).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Card</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${walletStats.cardBalance.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">USDT</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Team Overview */}
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Status
              </h3>
              <Button
                onClick={() => navigate('/team')}
                variant="outline"
                size="sm"
                icon={ArrowUpRight}
              >
                Manage
              </Button>
            </div>

            <div className="space-y-4">
              {/* Team Info */}
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-yellow-900">{teamStats.teamName}</h4>
                  <Crown className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-yellow-700">Rank</p>
                    <p className="font-bold text-yellow-900">#{teamStats.teamRank}</p>
                  </div>
                  <div>
                    <p className="text-yellow-700">Members</p>
                    <p className="font-bold text-yellow-900">{teamStats.teamMembers}</p>
                  </div>
                </div>
              </div>

              {/* Referral Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-600">{teamStats.myReferrals}</p>
                  <p className="text-xs text-gray-600">My Referrals</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">₿{teamStats.referralEarnings.toFixed(3)}</p>
                  <p className="text-xs text-gray-600">Commission</p>
                </div>
              </div>

              {/* Quick Action */}
              <Button
                onClick={() => navigate('/team')}
                variant="outline"
                className="w-full"
                icon={UserPlus}
              >
                Invite Friends
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activities
              </h3>
              <Button
                variant="outline"
                size="sm"
                icon={RefreshCw}
              >
                Refresh
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  
                  {activity.amount && (
                    <div className="text-right">
                      <p className={`font-semibold ${
                        activity.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.amount}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Quick Actions
            </h3>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/earn')}
                variant="primary"
                className="w-full justify-start"
                icon={Play}
              >
                <div className="text-left">
                  <p className="font-medium">Start Mining</p>
                  <p className="text-xs opacity-80">Begin 24h session</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/card')}
                variant="outline"
                className="w-full justify-start"
                icon={CreditCard}
              >
                <div className="text-left">
                  <p className="font-medium">Top Up Card</p>
                  <p className="text-xs text-gray-500">Add DUBU to card</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/team')}
                variant="outline"
                className="w-full justify-start"
                icon={Gift}
              >
                <div className="text-left">
                  <p className="font-medium">Share Referral</p>
                  <p className="text-xs text-gray-500">Earn commission</p>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/wallet')}
                variant="outline"
                className="w-full justify-start"
                icon={ArrowDownRight}
              >
                <div className="text-left">
                  <p className="font-medium">Send/Receive</p>
                  <p className="text-xs text-gray-500">Manage tokens</p>
                </div>
              </Button>
            </div>

            {/* Daily Goals */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Daily Goals
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Complete mining session</span>
                  <div className="flex items-center space-x-2">
                    {miningStats.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 rounded-full" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Check team activity</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Share referral link</span>
                  <div className="w-4 h-4 border border-gray-300 rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Network Information Panel */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Mining on {CURRENT_NETWORK.displayName}
              </h3>
              <p className="text-gray-600 mb-4">
                Your mining operations are running on Binance Smart Chain {CURRENT_NETWORK.name === 'BSC Testnet' ? 'Testnet' : 'Mainnet'}. 
                {CURRENT_NETWORK.faucetUrl ? ' Test your operations with free test tokens.' : ' Secure and efficient mining.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Low Gas Fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Fast Transactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">EVM Compatible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;