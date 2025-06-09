import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Zap, 
  Clock, 
  DollarSign, 
  Activity,
  Settings,
  CheckCircle,
  Timer,
  TrendingUp,
  Wrench,
  Calendar,
  Target,
  Flame,
  Award
} from 'lucide-react';
import { Button, StatsCard, Card } from '../components/ui';

// 효율성 관련 인터페이스
interface EfficiencyData {
  current: number;
  target: number;
  consecutiveDays: number;
  lastMaintenance: number; // 시간 (hours ago)
  dailyActivityCompleted: boolean;
  interruptionCount: number;
  efficiencyBoosts: EfficiencyBoost[];
}

interface EfficiencyBoost {
  id: string;
  name: string;
  value: number;
  expiresAt?: Date;
  source: 'maintenance' | 'daily_activity' | 'streak' | 'mission';
}

const EarnPage: React.FC = () => {
  const [isMining, setIsMining] = useState(false);
  const [miningTime, setMiningTime] = useState(0); // seconds
  const [earnings, setEarnings] = useState(0);
  const [hashRate, setHashRate] = useState(12.5);
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null);
  
  // 효율성 상태
  const [efficiency, setEfficiency] = useState<EfficiencyData>({
    current: 78.5,
    target: 85.0,
    consecutiveDays: 3,
    lastMaintenance: 2.5,
    dailyActivityCompleted: true,
    interruptionCount: 1,
    efficiencyBoosts: [
      {
        id: '1',
        name: 'Daily Activity',
        value: 5,
        source: 'daily_activity'
      },
      {
        id: '2', 
        name: '3-Day Streak',
        value: 2.4,
        source: 'streak'
      }
    ]
  });

  // 24시간 = 86400초
  const TOTAL_MINING_TIME = 86400;

  // 페이지 로드시 저장된 상태 복원
  useEffect(() => {
    const savedMiningState = localStorage.getItem('miningState');
    if (savedMiningState) {
      const { isMining: savedIsMining, startTime, earnings: savedEarnings } = JSON.parse(savedMiningState);
      
      if (savedIsMining && startTime) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        
        if (elapsed < TOTAL_MINING_TIME) {
          setIsMining(true);
          setMiningTime(elapsed);
          setMiningStartTime(startTime);
          setEarnings(savedEarnings + (elapsed * 0.001 / 3600));
        } else {
          // 24시간 완료
          setMiningTime(TOTAL_MINING_TIME);
          setEarnings(savedEarnings + 0.024); // 24시간 채굴 완료 보상
          localStorage.removeItem('miningState');
        }
      }
    }
  }, []);

  // 채굴 상태 저장
  useEffect(() => {
    if (isMining && miningStartTime) {
      const miningState = {
        isMining,
        startTime: miningStartTime,
        earnings
      };
      localStorage.setItem('miningState', JSON.stringify(miningState));
    }
  }, [isMining, miningStartTime, earnings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMining && miningTime < TOTAL_MINING_TIME) {
      interval = setInterval(() => {
        setMiningTime(prev => {
          const newTime = prev + 1;
          // 효율성을 반영한 채굴 수익 계산
          const efficiencyMultiplier = efficiency.current / 70; // 70%를 기준으로
          setEarnings(prev => prev + (0.001 / 3600) * efficiencyMultiplier);
          
          // 해시레이트 변동 시뮬레이션
          setHashRate(prev => prev + (Math.random() - 0.5) * 0.1);
          
          if (newTime >= TOTAL_MINING_TIME) {
            setIsMining(false);
            // 마이닝 완료시 연속일 증가
            setEfficiency(prev => ({
              ...prev,
              consecutiveDays: prev.consecutiveDays + 1
            }));
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isMining, miningTime, efficiency.current]);

  const handleMiningToggle = () => {
    if (miningTime >= TOTAL_MINING_TIME) {
      // 24시간 완료 후 리셋
      setMiningTime(0);
      setEarnings(0);
      setMiningStartTime(null);
      localStorage.removeItem('miningState');
      return;
    }
    
    if (!isMining) {
      // 채굴 시작
      const startTime = Date.now() - (miningTime * 1000);
      setMiningStartTime(startTime);
      setIsMining(true);
    } else {
      // 채굴 정지 (중단 횟수 증가)
      setIsMining(false);
      setMiningStartTime(null);
      localStorage.removeItem('miningState');
      setEfficiency(prev => ({
        ...prev,
        interruptionCount: prev.interruptionCount + 1
      }));
    }
  };

  // 유지보수 수행
  const handleMaintenance = () => {
    setEfficiency(prev => ({
      ...prev,
      lastMaintenance: 0,
      efficiencyBoosts: [
        ...prev.efficiencyBoosts.filter(boost => boost.source !== 'maintenance'),
        {
          id: `maintenance_${Date.now()}`,
          name: 'Fresh Maintenance',
          value: 3,
          source: 'maintenance',
          expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4시간 후
        }
      ]
    }));
  };

  // 일일 활동 완료
  const handleDailyActivity = () => {
    setEfficiency(prev => ({
      ...prev,
      dailyActivityCompleted: true,
      efficiencyBoosts: [
        ...prev.efficiencyBoosts.filter(boost => boost.source !== 'daily_activity'),
        {
          id: `daily_${Date.now()}`,
          name: 'Daily Activity',
          value: 5,
          source: 'daily_activity'
        }
      ]
    }));
  };

  // 효율성 계산
  const calculateCurrentEfficiency = () => {
    let baseEfficiency = 70;
    
    // 연속일 보너스
    baseEfficiency += Math.min(efficiency.consecutiveDays * 0.8, 15);
    
    // 일일 활동 보너스
    if (efficiency.dailyActivityCompleted) baseEfficiency += 5;
    
    // 유지보수 상태
    if (efficiency.lastMaintenance <= 4) baseEfficiency += 3;
    
    // 중단 패널티
    baseEfficiency -= efficiency.interruptionCount * 2;
    
    // 부스터 적용
    const boostValue = efficiency.efficiencyBoosts.reduce((sum, boost) => sum + boost.value, 0);
    baseEfficiency += boostValue;
    
    return Math.max(50, Math.min(100, baseEfficiency));
  };

  const currentEfficiency = calculateCurrentEfficiency();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeRemaining = (seconds: number) => {
    const remaining = TOTAL_MINING_TIME - seconds;
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    return `${hours}h ${minutes}m remaining`;
  };

  const progressPercentage = (miningTime / TOTAL_MINING_TIME) * 100;

  const getEfficiencyColor = (eff: number) => {
    if (eff >= 90) return 'text-green-600';
    if (eff >= 80) return 'text-blue-600';
    if (eff >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEfficiencyGrade = (eff: number) => {
    if (eff >= 95) return 'Diamond';
    if (eff >= 90) return 'Platinum';
    if (eff >= 80) return 'Gold';
    if (eff >= 70) return 'Silver';
    return 'Bronze';
  };

  const statsData = [
    {
      title: 'Current Earnings',
      value: `₿${earnings.toFixed(6)}`,
      change: isMining ? '+Mining Active' : 'Mining Stopped',
      changeType: isMining ? 'positive' as const : 'neutral' as const,
      icon: <DollarSign className="w-6 h-6" />,
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      title: 'Hash Rate',
      value: `${hashRate.toFixed(2)} TH/s`,
      change: isMining ? 'Fluctuating' : 'Stable',
      changeType: 'neutral' as const,
      icon: <Zap className="w-6 h-6" />,
      iconColor: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Mining Time',
      value: formatTime(miningTime),
      change: miningTime < TOTAL_MINING_TIME ? formatTimeRemaining(miningTime) : 'Completed',
      changeType: 'neutral' as const,
      icon: <Clock className="w-6 h-6" />,
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Efficiency',
      value: `${currentEfficiency.toFixed(1)}%`,
      change: `${getEfficiencyGrade(currentEfficiency)} Grade`,
      changeType: currentEfficiency >= efficiency.target ? 'positive' as const : 'neutral' as const,
      icon: <Activity className="w-6 h-6" />,
      iconColor: 'bg-purple-100 text-purple-600'
    }
  ];

  const miningHistory = [
    { date: '2024-01-05', duration: '24:00:00', earnings: 0.024, efficiency: 87.3, status: 'completed' },
    { date: '2024-01-04', duration: '24:00:00', earnings: 0.023, efficiency: 85.1, status: 'completed' },
    { date: '2024-01-03', duration: '18:30:00', earnings: 0.018, efficiency: 72.8, status: 'interrupted' },
    { date: '2024-01-02', duration: '24:00:00', earnings: 0.025, efficiency: 89.2, status: 'completed' },
    { date: '2024-01-01', duration: '24:00:00', earnings: 0.022, efficiency: 83.5, status: 'completed' },
  ];

  return (
    <div className="h-full overflow-auto">
      {/* Main Content */}
      <div className="p-4 md:p-6">
        {/* Mining Control Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Mining Operations</h2>
          <p className="text-sm md:text-base text-gray-600">
            Start your 24-hour mining session and optimize your efficiency for maximum rewards.
          </p>
        </div>

        {/* Mining Control Panel */}
        <div className="mb-8">
          <Card className="text-center">
            <div className="max-w-md mx-auto">
              {/* Mining Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  isMining ? 'bg-green-100 text-green-800' : 
                  miningTime >= TOTAL_MINING_TIME ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    isMining ? 'bg-green-500 animate-pulse' : 
                    miningTime >= TOTAL_MINING_TIME ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}></div>
                  {isMining ? 'Mining Active' : 
                   miningTime >= TOTAL_MINING_TIME ? 'Session Complete' : 'Mining Stopped'}
                </div>
              </div>

              {/* Progress Circle */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className={isMining ? 'text-green-500' : 'text-blue-500'}
                    strokeDasharray={`${progressPercentage * 2.827} 282.7`}
                    style={{
                      transition: 'stroke-dasharray 1s ease-in-out'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {progressPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Complete</div>
                    <div className={`text-xs font-medium mt-1 ${getEfficiencyColor(currentEfficiency)}`}>
                      {currentEfficiency.toFixed(1)}% Efficiency
                    </div>
                  </div>
                </div>
              </div>

              {/* Mining Button */}
              <Button
                onClick={handleMiningToggle}
                variant={isMining ? "secondary" : "primary"}
                size="lg"
                icon={isMining ? Pause : Play}
                className="w-full max-w-xs"
                disabled={miningTime >= TOTAL_MINING_TIME && !isMining}
              >
                {miningTime >= TOTAL_MINING_TIME ? 'Start New Session' :
                 isMining ? 'Pause Mining' : 'Start Mining'}
              </Button>

              {miningTime >= TOTAL_MINING_TIME && (
                <p className="mt-4 text-sm text-gray-600">
                  Congratulations! You've completed a 24-hour mining session.
                </p>
              )}
            </div>
          </Card>
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

        {/* Efficiency Management Section */}
        <div className="mb-8">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Efficiency Management
              </h3>
              <div className={`text-sm font-medium ${getEfficiencyColor(currentEfficiency)}`}>
                {getEfficiencyGrade(currentEfficiency)} Grade
              </div>
            </div>

            {/* Efficiency Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Efficiency Gauge */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Current Efficiency</span>
                  <span className={`text-lg font-bold ${getEfficiencyColor(currentEfficiency)}`}>
                    {currentEfficiency.toFixed(1)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(currentEfficiency, 100)}%`,
                      background: currentEfficiency >= 90 ? 
                        'linear-gradient(90deg, #10B981, #059669)' :
                        currentEfficiency >= 80 ?
                        'linear-gradient(90deg, #3B82F6, #2563EB)' :
                        currentEfficiency >= 70 ?
                        'linear-gradient(90deg, #F59E0B, #D97706)' :
                        'linear-gradient(90deg, #EF4444, #DC2626)'
                    }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>50%</span>
                  <span>Target: {efficiency.target}%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Flame className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-xs text-blue-600 font-medium">Streak</span>
                  </div>
                  <div className="text-lg font-bold text-blue-900">{efficiency.consecutiveDays}</div>
                  <div className="text-xs text-blue-600">days</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xs text-green-600 font-medium">Bonus</span>
                  </div>
                  <div className="text-lg font-bold text-green-900">
                    +{efficiency.efficiencyBoosts.reduce((sum, boost) => sum + boost.value, 0).toFixed(1)}%
                  </div>
                  <div className="text-xs text-green-600">active</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Maintenance Button */}
              <button
                onClick={handleMaintenance}
                disabled={efficiency.lastMaintenance < 4}
                className={`p-4 rounded-lg border text-left transition-all ${
                  efficiency.lastMaintenance >= 4 
                    ? 'border-orange-200 hover:border-orange-300 bg-orange-50 hover:bg-orange-100' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Wrench className={`w-5 h-5 mr-2 ${
                      efficiency.lastMaintenance >= 4 ? 'text-orange-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      efficiency.lastMaintenance >= 4 ? 'text-orange-900' : 'text-gray-500'
                    }`}>
                      Maintenance
                    </span>
                  </div>
                  {efficiency.lastMaintenance < 4 && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className={`text-sm ${
                  efficiency.lastMaintenance >= 4 ? 'text-orange-700' : 'text-gray-500'
                }`}>
                  {efficiency.lastMaintenance >= 4 
                    ? `${efficiency.lastMaintenance.toFixed(1)}h ago - Click to maintain` 
                    : `${(4 - efficiency.lastMaintenance).toFixed(1)}h until next maintenance`
                  }
                </div>
                {efficiency.lastMaintenance >= 4 && (
                  <div className="text-xs text-orange-600 mt-1">+3% efficiency boost</div>
                )}
              </button>

              {/* Daily Activity */}
              <button
                onClick={handleDailyActivity}
                disabled={efficiency.dailyActivityCompleted}
                className={`p-4 rounded-lg border text-left transition-all ${
                  !efficiency.dailyActivityCompleted 
                    ? 'border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100' 
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Calendar className={`w-5 h-5 mr-2 ${
                      !efficiency.dailyActivityCompleted ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-medium ${
                      !efficiency.dailyActivityCompleted ? 'text-blue-900' : 'text-gray-500'
                    }`}>
                      Daily Activity
                    </span>
                  </div>
                  {efficiency.dailyActivityCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className={`text-sm ${
                  !efficiency.dailyActivityCompleted ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {efficiency.dailyActivityCompleted 
                    ? 'Completed for today' 
                    : 'Complete daily check-in'
                  }
                </div>
                {!efficiency.dailyActivityCompleted && (
                  <div className="text-xs text-blue-600 mt-1">+5% efficiency boost</div>
                )}
              </button>

              {/* Streak Info */}
              <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 text-left">
                <div className="flex items-center mb-2">
                  <Award className="w-5 h-5 mr-2 text-purple-600" />
                  <span className="font-medium text-purple-900">Mining Streak</span>
                </div>
                <div className="text-sm text-purple-700 mb-1">
                  {efficiency.consecutiveDays} consecutive days
                </div>
                <div className="text-xs text-purple-600">
                  +{Math.min(efficiency.consecutiveDays * 0.8, 15).toFixed(1)}% efficiency bonus
                </div>
                <div className="text-xs text-purple-500 mt-1">
                  Next milestone: {Math.ceil(efficiency.consecutiveDays / 5) * 5} days
                </div>
              </div>
            </div>

            {/* Active Boosts */}
            {efficiency.efficiencyBoosts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Active Efficiency Boosts</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {efficiency.efficiencyBoosts.map((boost) => (
                    <div key={boost.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-green-800">{boost.name}</span>
                        <span className="text-xs font-bold text-green-900">+{boost.value}%</span>
                      </div>
                      {boost.expiresAt && (
                        <div className="text-xs text-green-600">
                          Expires: {boost.expiresAt.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Mining History and Real-time Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mining History */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Mining History</h3>
            <div className="space-y-4">
              {miningHistory.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{session.date}</p>
                    <p className="text-sm text-gray-600">Duration: {session.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₿{session.earnings}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getEfficiencyColor(session.efficiency)}`}>
                        {session.efficiency}% eff.
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Real-time Mining Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Real-time Stats</h3>
            
            {/* Hash Rate Chart Placeholder */}
            <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200 mb-6">
              <div className="text-center">
                <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Performance Chart</p>
                <p className="text-xs text-gray-400">Hash Rate × Efficiency</p>
              </div>
            </div>

            {/* Current Session Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Session Start:</span>
                <span className="text-sm font-medium text-gray-900">
                  {miningTime > 0 ? new Date(Date.now() - miningTime * 1000).toLocaleTimeString() : '--:--:--'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Completion:</span>
                <span className="text-sm font-medium text-gray-900">
                  {miningTime > 0 && miningTime < TOTAL_MINING_TIME ? 
                   new Date(Date.now() + (TOTAL_MINING_TIME - miningTime) * 1000).toLocaleTimeString() : 
                   '--:--:--'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Efficiency Multiplier:</span>
                <span className={`text-sm font-medium ${getEfficiencyColor(currentEfficiency)}`}>
                  {(currentEfficiency / 70).toFixed(2)}x
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projected 24h Earnings:</span>
                <span className="text-sm font-medium text-gray-900">
                  ₿{(0.024 * (currentEfficiency / 70)).toFixed(6)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Interruptions:</span>
                <span className={`text-sm font-medium ${
                  efficiency.interruptionCount === 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {efficiency.interruptionCount} times
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EarnPage;