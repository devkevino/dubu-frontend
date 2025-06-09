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
  PieChart,
  ArrowUp,
  ArrowDown
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

// 수익 데이터 인터페이스
interface EarningsData {
  date: string;
  amount: number;
  efficiency: number;
  hashRate: number;
}

// 수익 통계 인터페이스
interface EarningsStats {
  total: number;
  average: number;
  best: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

const EarnPage: React.FC = () => {
  const [isMining, setIsMining] = useState(false);
  const [miningTime, setMiningTime] = useState(0); // seconds
  const [earnings, setEarnings] = useState(0);
  const [hashRate, setHashRate] = useState(12.0);
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  
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

  // 24시간 = 86400초
  const TOTAL_MINING_TIME = 86400;

  // 수익 데이터 생성 함수 (데모용)
  const generateEarningsData = (days: number): EarningsData[] => {
    const data: EarningsData[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // 무작위 데이터 생성 (실제로는 DB에서 가져옴)
      const baseAmount = 0.020 + Math.random() * 0.008;
      const efficiencyVariation = 70 + Math.random() * 25;
      const hashRateVariation = 10 + Math.random() * 8;
      
      data.push({
        date: date.toISOString().split('T')[0],
        amount: baseAmount,
        efficiency: efficiencyVariation,
        hashRate: hashRateVariation
      });
    }
    
    return data;
  };

  // 수익 통계 계산 함수
  const calculateEarningsStats = (data: EarningsData[]): EarningsStats => {
    if (data.length === 0) {
      return { total: 0, average: 0, best: 0, trend: 'stable', trendPercentage: 0 };
    }
    
    const total = data.reduce((sum, d) => sum + d.amount, 0);
    const average = total / data.length;
    const best = Math.max(...data.map(d => d.amount));
    
    // 트렌드 계산 (최근 반과 이전 반 비교)
    const mid = Math.floor(data.length / 2);
    const recentAvg = data.slice(mid).reduce((sum, d) => sum + d.amount, 0) / (data.length - mid);
    const previousAvg = data.slice(0, mid).reduce((sum, d) => sum + d.amount, 0) / mid;
    
    const trendPercentage = ((recentAvg - previousAvg) / previousAvg) * 100;
    const trend = trendPercentage > 5 ? 'up' : trendPercentage < -5 ? 'down' : 'stable';
    
    return { total, average, best, trend, trendPercentage };
  };

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

  // 수익 데이터 및 통계
  const earningsData = generateEarningsData(
    selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90
  );
  const earningsStats = calculateEarningsStats(earningsData);

  // 차트 바의 최대 높이 계산
  const maxEarning = Math.max(...earningsData.map(d => d.amount));

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
                    {referralData.bonusMultiplier > 1 && (
                      <div className="text-xs text-purple-600 font-medium">
                        +{((referralData.bonusMultiplier - 1) * 100).toFixed(0)}% Referral Bonus
                      </div>
                    )}
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

        {/* Mining History and Earnings Analytics */}
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

          {/* Earnings Analytics - NEW */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Earnings Analytics
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedPeriod('7d')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedPeriod === '7d' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setSelectedPeriod('30d')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedPeriod === '30d' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  30D
                </button>
                <button
                  onClick={() => setSelectedPeriod('90d')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedPeriod === '90d' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  90D
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Total Earned</p>
                <p className="text-lg font-bold text-gray-900">₿{earningsStats.total.toFixed(4)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Daily Average</p>
                <p className="text-lg font-bold text-gray-900">₿{earningsStats.average.toFixed(6)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Best Day</p>
                <p className="text-lg font-bold text-green-600">₿{earningsStats.best.toFixed(6)}</p>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Trend Analysis</span>
                </div>
                <div className={`flex items-center space-x-1 ${
                  earningsStats.trend === 'up' ? 'text-green-600' : 
                  earningsStats.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {earningsStats.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : earningsStats.trend === 'down' ? (
                    <ArrowDown className="w-4 h-4" />
                  ) : null}
                  <span className="text-sm font-medium">
                    {Math.abs(earningsStats.trendPercentage).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-48 relative">
              <div className="absolute inset-0 flex items-end justify-around space-x-1">
                {earningsData.map((data, index) => {
                  const height = (data.amount / maxEarning) * 100;
                  const isToday = index === earningsData.length - 1;
                  
                  return (
                    <div key={index} className="relative flex-1 flex flex-col items-center">
                      {/* Tooltip on hover */}
                      <div className="group relative w-full flex flex-col items-center">
                        <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                          <div className="font-medium">₿{data.amount.toFixed(6)}</div>
                          <div className="text-gray-300">{data.efficiency.toFixed(1)}% efficiency</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                        
                        {/* Bar */}
                        <div 
                          className={`w-full rounded-t-md transition-all duration-300 cursor-pointer ${
                            isToday 
                              ? 'bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500' 
                              : 'bg-gradient-to-t from-gray-400 to-gray-300 hover:from-gray-500 hover:to-gray-400'
                          }`}
                          style={{ height: `${height}%`, minHeight: '20px' }}
                        />
                      </div>
                      
                      {/* Date label (show only every few bars for space) */}
                      {(index % Math.ceil(earningsData.length / 7) === 0 || isToday) && (
                        <div className="mt-2 text-xs text-gray-600 transform -rotate-45 origin-top-left">
                          {new Date(data.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-t from-blue-600 to-blue-400 rounded"></div>
                <span className="text-gray-600">Today</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gradient-to-t from-gray-400 to-gray-300 rounded"></div>
                <span className="text-gray-600">Previous Days</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EarnPage;