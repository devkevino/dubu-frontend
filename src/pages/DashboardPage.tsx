import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity, 
  Zap,
  ArrowUpRight,
  Settings,
  Wallet,
  CreditCard,
  Crown,
  Clock,
  Play,
  Pause,
  Gift,
  RefreshCw,
  UserPlus,
  Target,
  Star,
  CheckCircle
} from 'lucide-react';
import { StatsCard, Button, Card } from '../components/ui';
import { NetworkSwitch } from '../components/ui/NetworkSwitch';
import { useWeb3Auth } from '../providers/Web3AuthProvider';
import { SupabaseMiningService } from '../lib/supabase/services';
import { MiningSession, UserProfile } from '../lib/supabase/types';
import { CURRENT_NETWORK } from '../config/networks';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    address, 
    balance, 
    chainId, 
    networkName, 
    isConnected,
    supabaseUser,
    isSupabaseConnected,
    refreshSupabaseUser
  } = useWeb3Auth();
  
  // Supabase에서 가져온 데이터 상태
  const [miningHistory, setMiningHistory] = useState<MiningSession[]>([]);
  const [activeMiningSession, setActiveMiningSession] = useState<MiningSession | null>(null);
  const [isLoadingSupabaseData, setIsLoadingSupabaseData] = useState(false);
  
  // 로컬 마이닝 상태 (UI용)
  const [miningStats, setMiningStats] = useState({
    isActive: false,
    currentSession: 0,
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
    totalValue: 1250.45,
    bnbBalance: parseFloat(balance || '0'),
    dubuBalance: 1234.5678,
    dubuPrice: 0.85,
    cardBalance: 750.30
  });

  // Supabase 데이터 로드
  const loadSupabaseData = async () => {
    if (!supabaseUser || !isSupabaseConnected) return;
    
    setIsLoadingSupabaseData(true);
    try {
      console.log('📊 [Dashboard] Supabase 데이터 로딩 중...');
      
      // 마이닝 히스토리 가져오기
      const history = await SupabaseMiningService.getMiningHistory(supabaseUser.id, 10);
      setMiningHistory(history);
      
      // 활성 마이닝 세션 확인
      const activeSession = await SupabaseMiningService.getActiveMiningSession(supabaseUser.id);
      setActiveMiningSession(activeSession);
      
      // 활성 세션이 있으면 마이닝 상태 업데이트
      if (activeSession) {
        const startTime = new Date(activeSession.start_time).getTime();
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        
        setMiningStats(prev => ({
          ...prev,
          isActive: true,
          currentSession: elapsed,
          efficiency: activeSession.efficiency || prev.efficiency,
          hashRate: activeSession.hash_rate || prev.hashRate
        }));
      }
      
      console.log('✅ [Dashboard] Supabase 데이터 로딩 완료:', {
        historyCount: history.length,
        hasActiveSession: !!activeSession
      });
    } catch (error) {
      console.error('❌ [Dashboard] Supabase 데이터 로딩 실패:', error);
    } finally {
      setIsLoadingSupabaseData(false);
    }
  };



  // 컴포넌트 마운트시 Supabase 데이터 로드
  useEffect(() => {
    if (isSupabaseConnected && supabaseUser) {
      loadSupabaseData();
    }
  }, [isSupabaseConnected, supabaseUser]);

  // 1초마다 활성 마이닝 세션 시간 업데이트
  useEffect(() => {
    if (!activeMiningSession || !miningStats.isActive) return;
    
    const interval = setInterval(() => {
      const startTime = new Date(activeMiningSession.start_time).getTime();
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      
      setMiningStats(prev => ({
        ...prev,
        currentSession: elapsed
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeMiningSession, miningStats.isActive]);

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
                {isSupabaseConnected && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    DB Connected
                  </span>
                )}
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Here's your mining empire overview
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={loadSupabaseData}
                variant="outline"
                size="sm"
                loading={isLoadingSupabaseData}
                icon={RefreshCw}
              >
                Sync
              </Button>
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
        </div>

        {/* Supabase 연결 상태 표시 */}
        {!isSupabaseConnected && isConnected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ⚠️ Supabase 데이터베이스에 연결되지 않았습니다. 
              일부 기능이 제한될 수 있습니다.
            </p>
          </div>
        )}

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
                {isSupabaseConnected && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Live
                  </span>
                )}
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
                  {activeMiningSession && (
                    <p className="text-xs text-blue-600">
                      Session ID: {activeMiningSession.id.slice(0, 8)}...
                    </p>
                  )}
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

              {/* Mining Action - EarnPage로 이동 */}
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

          {/* Mining History - Supabase 데이터 */}
          <Card className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Mining History
              </h3>
              <Button
                onClick={loadSupabaseData}
                variant="outline"
                size="sm"
                loading={isLoadingSupabaseData}
                icon={RefreshCw}
              >
                Refresh
              </Button>
            </div>

            <div className="space-y-3">
              {miningHistory.length > 0 ? (
                miningHistory.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session.status === 'completed' ? 'Completed' : 'Active'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.start_time).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        +{session.earnings_bnb?.toFixed(4) || '0.0000'} BNB
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.duration_seconds ? 
                          formatTime(session.duration_seconds) : 
                          'In Progress'
                        }
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {isSupabaseConnected ? (
                    <div>
                      <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No mining history yet</p>
                      <p className="text-sm">Start your first mining session!</p>
                    </div>
                  ) : (
                    <div>
                      <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Database not connected</p>
                      <p className="text-sm">Connect to view history</p>
                    </div>
                  )}
                </div>
              )}
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
        </div>

        {/* Supabase 연결 상태 정보 패널 */}
        {isSupabaseConnected && supabaseUser && (
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Database Connected & Synced
                </h3>
                <p className="text-gray-600 mb-4">
                  Your mining data is being securely stored and synchronized with our database. 
                  All your mining sessions, earnings, and team activities are tracked in real-time.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Real-time Sync</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Secure Storage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">Session Tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-700">History Backup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;