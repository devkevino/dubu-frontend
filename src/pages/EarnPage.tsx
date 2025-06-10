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
  Award,
  Users,
  Gift,
  Lock,
  Unlock,
  Key,
  Info,
  BarChart3,
  LineChart
} from 'lucide-react';
import { Button, StatsCard, Card, Input } from '../components/ui';

// Hash Rate 관련 인터페이스
interface HashRateData {
  base: number; // 기본 Hash Rate (12.0 TH/s)
  maximum: number; // 최대 Hash Rate (24.0 TH/s)
  consecutiveDaysBonus: number; // 연속 로그인일 보너스 (1일당 +0.2, 최대 +2.0)
  dailyCheckInBonus: number; // 일일 체크인 보너스 (+1.0)
  teamBonus: number; // 팀 보너스 (1명당 +0.1, 최대 +10.0)
  current: number; // 현재 Hash Rate
}

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
  source: 'maintenance' | 'daily_activity' | 'streak' | 'mission' | 'referral';
}

// 레퍼럴 관련 인터페이스
interface ReferralData {
  hasEnteredCode: boolean;
  referralCode: string;
  referrerInfo?: {
    name: string;
    email: string;
    joinDate: string;
    totalEarnings: string;
  };
  bonusMultiplier: number;
}

// 수익 분석 데이터 인터페이스
interface EarningsAnalysis {
  totalEarnings: number;
  lastDayProfit: number;
  thirtyDayProfit: number;
  avgDailyEarnings: number;
  bestDailyRecord: number;
  projectedMonthly: number;
}

const EarnPage: React.FC = () => {
  const [isMining, setIsMining] = useState(false);
  const [miningTime, setMiningTime] = useState(0); // seconds
  const [earnings, setEarnings] = useState(0);
  const [hashRate, setHashRate] = useState(12.0);
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null);
  
  // Hash Rate 관련 상태
  const [hashRateData, setHashRateData] = useState<HashRateData>({
    base: 12.0,
    maximum: 24.0,
    consecutiveDaysBonus: 0,
    dailyCheckInBonus: 0,
    teamBonus: 0,
    current: 12.0
  });

  // 팀 관련 상태 (임시 데이터)
  const [teamData, setTeamData] = useState({
    memberCount: 3, // 임시 데이터
    maxMembers: 100
  });
  
  // 레퍼럴 관련 상태
  const [referralInput, setReferralInput] = useState('');
  const [referralData, setReferralData] = useState<ReferralData>({
    hasEnteredCode: true, // view 확인을 위해 true로 설정
    referralCode: 'MINER123456',
    referrerInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      joinDate: '2023-12-15',
      totalEarnings: '2.45678'
    },
    bonusMultiplier: 1.15
  });
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);
  const [referralError, setReferralError] = useState('');

  // 효율성 상태
  const [efficiency, setEfficiency] = useState<EfficiencyData>({
    current: 78.5,
    target: 85.0,
    consecutiveDays: 5, // 임시로 5일로 설정
    lastMaintenance: 2.5,
    dailyActivityCompleted: false, // 테스트를 위해 false
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
        name: '5-Day Streak',
        value: 4.0,
        source: 'streak'
      },
      {
        id: '3',
        name: 'Referral Bonus',
        value: 15,
        source: 'referral'
      }
    ]
  });

  // 수익 분석 데이터 (임시)
  const [earningsAnalysis, setEarningsAnalysis] = useState<EarningsAnalysis>({
    totalEarnings: 1.234567,
    lastDayProfit: 0.024567,
    thirtyDayProfit: 0.689432,
    avgDailyEarnings: 0.022980,
    bestDailyRecord: 0.035674,
    projectedMonthly: 0.689400
  });

  // 24시간 = 86400초
  const TOTAL_MINING_TIME = 86400;

  // Hash Rate 계산 함수
  const calculateHashRate = () => {
    let currentHashRate = hashRateData.base; // 12.0 TH/s
    
    // 연속 로그인일 보너스 (1일당 +0.2 TH/s, 최대 +2.0 TH/s)
    const consecutiveBonus = Math.min(efficiency.consecutiveDays * 0.2, 2.0);
    
    // 일일 체크인 보너스 (+1.0 TH/s)
    const checkInBonus = efficiency.dailyActivityCompleted ? 1.0 : 0;
    
    // 팀 보너스 (1명당 +0.1 TH/s, 최대 +10.0 TH/s)
    const teamBonus = Math.min(teamData.memberCount * 0.1, 10.0);
    
    // 총 Hash Rate 계산 (최대 24.0 TH/s)
    const totalHashRate = Math.min(
      currentHashRate + consecutiveBonus + checkInBonus + teamBonus,
      hashRateData.maximum
    );
    
    // Hash Rate 데이터 업데이트
    setHashRateData(prev => ({
      ...prev,
      consecutiveDaysBonus: consecutiveBonus,
      dailyCheckInBonus: checkInBonus,
      teamBonus: teamBonus,
      current: totalHashRate
    }));
    
    return totalHashRate;
  };

  // Hash Rate 업데이트
  useEffect(() => {
    const newHashRate = calculateHashRate();
    setHashRate(newHashRate);
  }, [efficiency.consecutiveDays, efficiency.dailyActivityCompleted, teamData.memberCount]);

  // 페이지 로드시 저장된 상태 복원
  useEffect(() => {
    // 레퍼럴 코드 상태 복원
    const savedReferralData = localStorage.getItem('referralData');
    if (savedReferralData) {
      setReferralData(JSON.parse(savedReferralData));
    }

    // 마이닝 상태 복원
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

  // 레퍼럴 코드 검증 (임시 구현)
  const validateReferralCode = async (code: string): Promise<boolean> => {
    setIsValidatingReferral(true);
    setReferralError('');

    try {
      // 임시 검증 로직 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 1500)); // 로딩 시뮬레이션

      // 임시 검증 룰
      if (code.length < 6) {
        setReferralError('레퍼럴 코드는 최소 6자 이상이어야 합니다.');
        return false;
      }

      if (!code.match(/^[A-Z0-9]+$/)) {
        setReferralError('레퍼럴 코드는 영문 대문자와 숫자만 포함해야 합니다.');
        return false;
      }

      // 임시 더미 데이터
      const dummyReferrerData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        joinDate: '2023-12-15',
        totalEarnings: '2.45678'
      };

      // 성공시 레퍼럴 데이터 설정
      const newReferralData: ReferralData = {
        hasEnteredCode: true,
        referralCode: code,
        referrerInfo: dummyReferrerData,
        bonusMultiplier: 1.15 // 15% 보너스
      };

      setReferralData(newReferralData);
      localStorage.setItem('referralData', JSON.stringify(newReferralData));

      // 레퍼럴 보너스 효율성 부스터 추가
      setEfficiency(prev => ({
        ...prev,
        efficiencyBoosts: [
          ...prev.efficiencyBoosts.filter(boost => boost.source !== 'referral'),
          {
            id: `referral_${Date.now()}`,
            name: 'Referral Bonus',
            value: 15,
            source: 'referral'
          }
        ]
      }));

      return true;
    } catch (error) {
      setReferralError('레퍼럴 코드 검증 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsValidatingReferral(false);
    }
  };

  const handleReferralSubmit = async () => {
    if (!referralInput.trim()) {
      setReferralError('레퍼럴 코드는 필수입니다.');
      return;
    }

    const isValid = await validateReferralCode(referralInput.toUpperCase());
    if (isValid) {
      setReferralInput('');
    }
  };

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
          // 효율성과 레퍼럴 보너스를 반영한 채굴 수익 계산
          const efficiencyMultiplier = efficiency.current / 70; // 70%를 기준으로
          const referralMultiplier = referralData.bonusMultiplier;
          const hashRateMultiplier = hashRateData.current / hashRateData.base;
          setEarnings(prev => prev + (0.001 / 3600) * efficiencyMultiplier * referralMultiplier * hashRateMultiplier);
          
          // 해시레이트 변동 시뮬레이션 (기본값 기준으로 작은 변동)
          const baseHashRate = hashRateData.current;
          setHashRate(prev => baseHashRate + (Math.random() - 0.5) * 0.2);
          
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
  }, [isMining, miningTime, efficiency.current, referralData.bonusMultiplier, hashRateData.current, hashRateData.base]);

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
      value: `${hashRateData.current.toFixed(1)} TH/s`,
      change: `${((hashRateData.current / hashRateData.base) * 100).toFixed(0)}% of max capacity`,
      changeType: 'positive' as const,
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
            Start your 24-hour mining session and optimize your Hash Rate & efficiency for maximum rewards.
          </p>
        </div>

        {/* Referral Status Card */}
        {referralData.referralCode && (
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">Referral Bonus Active</h3>
                  <p className="text-sm text-purple-700">
                    +{((referralData.bonusMultiplier - 1) * 100).toFixed(0)}% mining bonus from code: 
                    <span className="font-mono font-bold ml-1">{referralData.referralCode}</span>
                  </p>
                  {referralData.referrerInfo && (
                    <p className="text-xs text-purple-600 mt-1">
                      Referred by: {referralData.referrerInfo.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-900">
                  +{((referralData.bonusMultiplier - 1) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-purple-600">Bonus Rate</div>
              </div>
            </div>
          </Card>
        )}

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

        {/* Combined Management Section - Simplified */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hash Rate Section */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Hash Rate Boost
              </h3>
              <div className="text-sm font-bold text-orange-600">
                {hashRateData.current.toFixed(1)} / {hashRateData.maximum} TH/s
              </div>
            </div>

            {/* Compact Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-orange-400 to-red-500"
                  style={{ width: `${(hashRateData.current / hashRateData.maximum) * 100}%` }}
                />
              </div>
            </div>

            {/* Boosts Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Flame className="w-3 h-3 mr-1.5" />
                  Streak Bonus ({efficiency.consecutiveDays}d)
                </span>
                <span className="font-medium text-blue-600">+{hashRateData.consecutiveDaysBonus.toFixed(1)} TH/s</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <CheckCircle className={`w-3 h-3 mr-1.5 ${efficiency.dailyActivityCompleted ? 'text-green-500' : ''}`} />
                  Daily Check-in
                </span>
                <span className={`font-medium ${efficiency.dailyActivityCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  +{hashRateData.dailyCheckInBonus.toFixed(1)} TH/s
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Users className="w-3 h-3 mr-1.5" />
                  Team ({teamData.memberCount})
                </span>
                <span className="font-medium text-purple-600">+{hashRateData.teamBonus.toFixed(1)} TH/s</span>
              </div>
            </div>

            {/* Quick Actions */}
            {!efficiency.dailyActivityCompleted && (
              <Button
                onClick={handleDailyActivity}
                variant="primary"
                size="sm"
                className="w-full mt-4"
                icon={CheckCircle}
              >
                Complete Daily Check-in (+1.0 TH/s)
              </Button>
            )}
            
            {hashRateData.current >= hashRateData.maximum && (
              <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-center text-xs">
                  <Award className="w-3 h-3 mr-1 text-yellow-600" />
                  <span className="text-yellow-700 font-medium">Maximum Hash Rate Achieved!</span>
                </div>
              </div>
            )}
          </Card>

          {/* Efficiency Section */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Efficiency Status
              </h3>
              <div className={`text-sm font-bold ${getEfficiencyColor(currentEfficiency)}`}>
                {currentEfficiency.toFixed(1)}% • {getEfficiencyGrade(currentEfficiency)}
              </div>
            </div>

            {/* Compact Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
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
            </div>

            {/* Efficiency Factors */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Wrench className={`w-3 h-3 mr-1.5 ${efficiency.lastMaintenance >= 4 ? 'text-orange-500' : ''}`} />
                  Maintenance
                </span>
                <span className={`font-medium ${efficiency.lastMaintenance >= 4 ? 'text-orange-600' : 'text-green-600'}`}>
                  {efficiency.lastMaintenance >= 4 ? `${efficiency.lastMaintenance.toFixed(1)}h ago` : 'Good'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Flame className="w-3 h-3 mr-1.5" />
                  Login Streak
                </span>
                <span className="font-medium text-blue-600">
                  {efficiency.consecutiveDays} days (+{Math.min(efficiency.consecutiveDays * 0.8, 15).toFixed(1)}%)
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Target className="w-3 h-3 mr-1.5" />
                  Active Boosts
                </span>
                <span className="font-medium text-green-600">
                  +{efficiency.efficiencyBoosts.reduce((sum, boost) => sum + boost.value, 0).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            {efficiency.lastMaintenance >= 4 && (
              <Button
                onClick={handleMaintenance}
                variant="outline"
                size="sm"
                className="w-full mt-4 border-orange-300 text-orange-700 hover:bg-orange-50"
                icon={Wrench}
              >
                Perform Maintenance (+3% efficiency)
              </Button>
            )}
            
            {/* Active Boosts Indicator */}
            {efficiency.efficiencyBoosts.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1">
                {efficiency.efficiencyBoosts.map((boost) => (
                  <span
                    key={boost.id}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      boost.source === 'referral' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    +{boost.value}%
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Earnings Analysis and Mining History */}
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

          {/* Earn Analysis - New Improved Section */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Earn Analysis
            </h3>
            
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-xs text-blue-600 mb-1">Total Earnings</div>
                <div className="text-lg font-bold text-blue-900">₿{earningsAnalysis.totalEarnings.toFixed(6)}</div>
                <div className="text-xs text-blue-600">All Time</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-xs text-green-600 mb-1">Last Day Profit</div>
                <div className="text-lg font-bold text-green-900">₿{earningsAnalysis.lastDayProfit.toFixed(6)}</div>
                <div className="text-xs text-green-600">24h</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-xs text-purple-600 mb-1">30-Day Profit</div>
                <div className="text-lg font-bold text-purple-900">₿{earningsAnalysis.thirtyDayProfit.toFixed(6)}</div>
                <div className="text-xs text-purple-600">Monthly</div>
              </div>
            </div>

            {/* Daily Rewards Chart Section */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <LineChart className="w-4 h-4 mr-2" />
                Daily Rewards
              </h4>
              
              {/* Chart Placeholder - Same as Dashboard */}
              <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-1">Daily rewards chart</p>
                  <p className="text-xs text-gray-400">Real chart integration needed</p>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Average Daily</span>
                <span className="font-medium text-gray-900">₿{earningsAnalysis.avgDailyEarnings.toFixed(6)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Best Daily Record</span>
                <span className="font-medium text-green-600">₿{earningsAnalysis.bestDailyRecord.toFixed(6)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Projected Monthly</span>
                <span className="font-medium text-blue-600">₿{earningsAnalysis.projectedMonthly.toFixed(6)}</span>
              </div>
              
              {miningTime > 0 && miningTime < TOTAL_MINING_TIME && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Session Progress</span>
                  <span className="font-medium text-gray-900">
                    {progressPercentage.toFixed(1)}% ({formatTime(miningTime)} / 24h)
                  </span>
                </div>
              )}
            </div>

            {/* Performance Indicator */}
            <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-orange-700 font-medium">Performance Tip</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Maintain {currentEfficiency >= 85 ? 'your excellent' : 'high'} efficiency 
                    {currentEfficiency < 85 && ' (target: 85%+)'} for maximum daily rewards.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EarnPage;