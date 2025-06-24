import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  LineChart,
  Star,
  Sparkles,
  Crown,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Plus,
  Dice6,
  ExternalLink,
  UserPlus,
  Database,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { Button, StatsCard, Card, Input } from '../components/ui';
import { useWeb3Auth } from '../providers/Web3AuthProvider';
import { SupabaseMiningService } from '../lib/supabase/services';
import { MiningSession } from '../lib/supabase/types';

// Hash Rate 관련 인터페이스 - 수정됨
interface HashRateData {
  base: number; // 기본 Hash Rate (12.0 TH/s)
  maximum: number; // 최대 Hash Rate (24.0 TH/s)
  dailyCheckInBonus: number; // 일일 체크인 보너스 (+1.0 TH/s)
  loginStreakBonus: number; // 로그인 연속일 보너스 (5일까지 +0.2씩)
  referralPowerBonus: number; // 레퍼럴 파워 보너스 (1명당 +2%, 최대 100%)
  luckyBoosterBonus: number; // 럭키 부스터 보너스 (+3%~+15%)
  current: number; // 현재 Hash Rate
}

// 효율성 관련 인터페이스 - 수정됨
interface EfficiencyData {
  current: number;
  baseGrade: EfficiencyGrade; // 등급에 따른 기본 보상
  teamBonus: number; // 팀 구간별 보상
  snsBonus: number; // SNS 연동 보상
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
  source: 'maintenance' | 'daily_activity' | 'grade' | 'team' | 'sns' | 'lucky';
}

// 등급 시스템
type EfficiencyGrade = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

interface GradeInfo {
  name: EfficiencyGrade;
  minEfficiency: number;
  baseReward: number; // 기본 보상 %
  color: string;
  bgColor: string;
}

// SNS 연동 상태
interface SnsConnections {
  facebook: boolean;
  twitter: boolean;
  instagram: boolean;
  youtube: boolean;
}

// 럭키 부스터 정보
interface LuckyBooster {
  id: string;
  name: string;
  hashRateBoost: number; // %
  duration: number; // hours
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  expiresAt?: Date;
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
  const { 
    supabaseUser, 
    isSupabaseConnected,
    startMiningSession: createMiningSession,
    endMiningSession: completeMiningSession
  } = useWeb3Auth();

  // Supabase 연동 상태
  const [isMining, setIsMining] = useState(false);
  const [miningTime, setMiningTime] = useState(0); // seconds
  const [earnings, setEarnings] = useState(0);
  const [hashRate, setHashRate] = useState(12.0);
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null);
  const [activeMiningSession, setActiveMiningSession] = useState<MiningSession | null>(null);
  const [miningHistory, setMiningHistory] = useState<MiningSession[]>([]);
  const [isLoadingMiningData, setIsLoadingMiningData] = useState(false);
  
  // 등급 정보 - useMemo로 메모이제이션
  const gradeInfo: GradeInfo[] = useMemo(() => [
    { name: 'Bronze', minEfficiency: 0, baseReward: 0, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { name: 'Silver', minEfficiency: 60, baseReward: 5, color: 'text-gray-600', bgColor: 'bg-gray-100' },
    { name: 'Gold', minEfficiency: 75, baseReward: 10, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { name: 'Platinum', minEfficiency: 85, baseReward: 15, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Diamond', minEfficiency: 95, baseReward: 25, color: 'text-purple-600', bgColor: 'bg-purple-100' }
  ], []);

  // Hash Rate 관련 상태 - 수정됨
  const [hashRateData, setHashRateData] = useState<HashRateData>({
    base: 12.0,
    maximum: 24.0,
    dailyCheckInBonus: 0,
    loginStreakBonus: 0,
    referralPowerBonus: 0,
    luckyBoosterBonus: 0,
    current: 12.0
  });

  // 팀 관련 상태
  const [teamData, setTeamData] = useState({
    memberCount: 25, // 임시 데이터 - 11~50명 구간
    maxMembers: 100
  });

  // SNS 연동 상태
  const [snsConnections, setSnsConnections] = useState<SnsConnections>({
    facebook: true,
    twitter: false,
    instagram: true,
    youtube: false
  });

  // 럭키 부스터 상태
  const [activeLuckyBooster, setActiveLuckyBooster] = useState<LuckyBooster | null>({
    id: 'lucky_001',
    name: 'Golden Rush',
    hashRateBoost: 12,
    duration: 24,
    rarity: 'rare',
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000) // 20시간 후
  });

  // 가챠 관련 상태
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [gachaResult, setGachaResult] = useState<LuckyBooster | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // 효율성 상태 - 수정됨
  const [efficiency, setEfficiency] = useState<EfficiencyData>({
    current: 78.5,
    baseGrade: 'Gold',
    teamBonus: 2, // 11~50명 구간
    snsBonus: 3, // 2개 SNS 연동
    lastMaintenance: 2.5,
    dailyActivityCompleted: false,
    interruptionCount: 1,
    efficiencyBoosts: [
      {
        id: '1',
        name: 'Gold Grade',
        value: 10,
        source: 'grade'
      },
      {
        id: '2', 
        name: 'Team Bonus (25 members)',
        value: 2,
        source: 'team'
      },
      {
        id: '3',
        name: 'SNS Connections (2)',
        value: 3,
        source: 'sns'
      }
    ]
  });

  // 로그인 연속일 상태
  const [loginStreak, setLoginStreak] = useState(3); // 임시 데이터

  // 레퍼럴 파워 상태
  const [referralCount, setReferralCount] = useState(8); // 임시 데이터

  // 수익 분석 데이터 (Supabase에서 계산됨)
  const [earningsAnalysis, setEarningsAnalysis] = useState<EarningsAnalysis>({
    totalEarnings: 0,
    lastDayProfit: 0,
    thirtyDayProfit: 0,
    avgDailyEarnings: 0,
    bestDailyRecord: 0,
    projectedMonthly: 0
  });

  // 24시간 = 86400초
  const TOTAL_MINING_TIME = 86400;

  // Supabase 마이닝 데이터 로드
  const loadMiningData = useCallback(async () => {
    if (!supabaseUser || !isSupabaseConnected) return;
    
    setIsLoadingMiningData(true);
    try {
      console.log('📊 [EarnPage] Supabase 마이닝 데이터 로딩 중...');
      
      // 활성 마이닝 세션 확인
      const activeSession = await SupabaseMiningService.getActiveMiningSession(supabaseUser.id);
      setActiveMiningSession(activeSession);
      
      // 마이닝 히스토리 가져오기
      const history = await SupabaseMiningService.getMiningHistory(supabaseUser.id, 20);
      setMiningHistory(history);
      
      // 활성 세션이 있으면 마이닝 상태 복원
      if (activeSession) {
        const startTime = new Date(activeSession.start_time).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        
        // 24시간 초과 체크
        if (elapsed >= TOTAL_MINING_TIME) {
          // 자동으로 세션 종료
          const earnings = calculateFinalEarnings(elapsed, activeSession.hash_rate || 12.0, activeSession.efficiency || 78.5);
          await completeMiningSession(activeSession.id, earnings);
          
          // 상태 리셋
          setIsMining(false);
          setMiningTime(TOTAL_MINING_TIME);
          setActiveMiningSession(null);
          
          // 히스토리 다시 로드
          const updatedHistory = await SupabaseMiningService.getMiningHistory(supabaseUser.id, 20);
          setMiningHistory(updatedHistory);
        } else {
          // 마이닝 상태 복원
          setIsMining(true);
          setMiningTime(elapsed);
          setMiningStartTime(startTime);
          setHashRate(activeSession.hash_rate || 12.0);
          setEarnings(calculateCurrentEarnings(elapsed, activeSession.hash_rate || 12.0, activeSession.efficiency || 78.5));
          
          // 효율성 복원
          setEfficiency(prev => ({
            ...prev,
            current: activeSession.efficiency || 78.5
          }));
        }
      } else {
        // 활성 세션이 없으면 상태 초기화
        setIsMining(false);
        setMiningTime(0);
        setMiningStartTime(null);
        setEarnings(0);
      }
      
      // 수익 분석 계산
      calculateEarningsAnalysis(history);
      
      console.log('✅ [EarnPage] 마이닝 데이터 로딩 완료:', {
        hasActiveSession: !!activeSession,
        historyCount: history.length
      });
    } catch (error) {
      console.error('❌ [EarnPage] 마이닝 데이터 로딩 실패:', error);
    } finally {
      setIsLoadingMiningData(false);
    }
  }, [supabaseUser, isSupabaseConnected, completeMiningSession]);

  // 수익 계산 함수들
  const calculateCurrentEarnings = (seconds: number, hashRateValue: number, efficiencyValue: number): number => {
    const baseEarningsPerSecond = 0.001 / 3600; // 시간당 0.001 BNB
    const hashRateMultiplier = hashRateValue / 12.0; // 기본 12.0 TH/s 대비
    const efficiencyMultiplier = efficiencyValue / 70; // 기본 70% 대비
    
    return seconds * baseEarningsPerSecond * hashRateMultiplier * efficiencyMultiplier;
  };

  const calculateFinalEarnings = (seconds: number, hashRateValue: number, efficiencyValue: number): number => {
    return calculateCurrentEarnings(Math.min(seconds, TOTAL_MINING_TIME), hashRateValue, efficiencyValue);
  };

  // 수익 분석 계산
  const calculateEarningsAnalysis = (history: MiningSession[]) => {
    if (history.length === 0) {
      setEarningsAnalysis({
        totalEarnings: 0,
        lastDayProfit: 0,
        thirtyDayProfit: 0,
        avgDailyEarnings: 0,
        bestDailyRecord: 0,
        projectedMonthly: 0
      });
      return;
    }

    const completedSessions = history.filter(session => session.status === 'completed' && session.earnings_bnb);
    const totalEarnings = completedSessions.reduce((sum, session) => sum + (session.earnings_bnb || 0), 0);
    
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const lastDayProfit = completedSessions
      .filter(session => new Date(session.created_at) >= yesterday)
      .reduce((sum, session) => sum + (session.earnings_bnb || 0), 0);
    
    const thirtyDayProfit = completedSessions
      .filter(session => new Date(session.created_at) >= thirtyDaysAgo)
      .reduce((sum, session) => sum + (session.earnings_bnb || 0), 0);
    
    const avgDailyEarnings = completedSessions.length > 0 ? totalEarnings / completedSessions.length : 0;
    const bestDailyRecord = Math.max(...completedSessions.map(session => session.earnings_bnb || 0), 0);
    const projectedMonthly = avgDailyEarnings * 30;

    setEarningsAnalysis({
      totalEarnings,
      lastDayProfit,
      thirtyDayProfit,
      avgDailyEarnings,
      bestDailyRecord,
      projectedMonthly
    });
  };

  // 컴포넌트 마운트시 데이터 로드
  useEffect(() => {
    if (isSupabaseConnected && supabaseUser) {
      loadMiningData();
    }
  }, [isSupabaseConnected, supabaseUser, loadMiningData]);

  // 팀 보너스 계산 함수 - useCallback으로 메모이제이션
  const calculateTeamBonus = useCallback((memberCount: number): number => {
    if (memberCount >= 101) return 10;
    if (memberCount >= 51) return 5;
    if (memberCount >= 11) return 2;
    if (memberCount >= 1) return 0.5;
    return 0;
  }, []);

  // SNS 보너스 계산 함수 - useCallback으로 메모이제이션
  const calculateSnsBonus = useCallback((connections: SnsConnections): number => {
    const connectedCount = Object.values(connections).filter(Boolean).length;
    return connectedCount * 1.5; // 연동된 SNS 1개당 +1.5%
  }, []);

  // 등급 결정 함수 - useCallback으로 메모이제이션
  const determineGrade = useCallback((efficiencyValue: number): EfficiencyGrade => {
    for (let i = gradeInfo.length - 1; i >= 0; i--) {
      if (efficiencyValue >= gradeInfo[i].minEfficiency) {
        return gradeInfo[i].name;
      }
    }
    return 'Bronze';
  }, [gradeInfo]);

  // Hash Rate 계산 함수 - useCallback으로 메모이제이션하고 상태 업데이트 분리
  const calculateCurrentHashRate = useCallback(() => {
    let currentHashRate = hashRateData.base; // 12.0 TH/s
    
    // 1. Daily Check-in 보너스 (+1.0 TH/s)
    const checkInBonus = efficiency.dailyActivityCompleted ? 1.0 : 0;
    
    // 2. Login Streak 보너스 (5일까지 +0.2씩)
    const streakBonus = Math.min(loginStreak * 0.2, 1.0); // 최대 1.0 TH/s
    
    // 3. Referral Power 보너스 (1명당 +2%, 최대 100%)
    const referralBoostPercent = Math.min(referralCount * 2, 100); // 최대 100%
    const referralBonus = (currentHashRate * referralBoostPercent) / 100;
    
    // 4. Lucky Booster 보너스
    const luckyBonus = activeLuckyBooster 
      ? (currentHashRate * activeLuckyBooster.hashRateBoost) / 100 
      : 0;
    
    // 총 Hash Rate 계산 (최대 24.0 TH/s)
    const totalHashRate = Math.min(
      currentHashRate + checkInBonus + streakBonus + referralBonus + luckyBonus,
      hashRateData.maximum
    );
    
    return {
      dailyCheckInBonus: checkInBonus,
      loginStreakBonus: streakBonus,
      referralPowerBonus: referralBonus,
      luckyBoosterBonus: luckyBonus,
      current: totalHashRate
    };
  }, [
    hashRateData.base,
    hashRateData.maximum,
    efficiency.dailyActivityCompleted,
    loginStreak,
    referralCount,
    activeLuckyBooster
  ]);

  // Efficiency 계산 함수 - useCallback으로 메모이제이션하고 상태 업데이트 분리
  const calculateCurrentEfficiency = useCallback(() => {
    let baseEfficiency = 50; // 기본 효율성
    
    // 1. 등급에 따른 기본 보상
    const currentGrade = determineGrade(efficiency.current);
    const gradeBonus = gradeInfo.find(g => g.name === currentGrade)?.baseReward || 0;
    
    // 2. 팀 보너스
    const teamBonus = calculateTeamBonus(teamData.memberCount);
    
    // 3. SNS 연동 보너스
    const snsBonus = calculateSnsBonus(snsConnections);
    
    // 4. 기타 보너스들
    if (efficiency.dailyActivityCompleted) baseEfficiency += 5;
    if (efficiency.lastMaintenance <= 4) baseEfficiency += 3;
    baseEfficiency -= efficiency.interruptionCount * 2;
    
    // 총 효율성 계산
    const totalEfficiency = Math.max(30, Math.min(100, 
      baseEfficiency + gradeBonus + teamBonus + snsBonus
    ));
    
    return {
      current: totalEfficiency,
      baseGrade: currentGrade,
      teamBonus,
      snsBonus,
      efficiencyBoosts: [
        {
          id: 'grade',
          name: `${currentGrade} Grade`,
          value: gradeBonus,
          source: 'grade' as const
        },
        {
          id: 'team',
          name: `Team Bonus (${teamData.memberCount} members)`,
          value: teamBonus,
          source: 'team' as const
        },
        {
          id: 'sns',
          name: `SNS Connections (${Object.values(snsConnections).filter(Boolean).length})`,
          value: snsBonus,
          source: 'sns' as const
        },
        ...(activeLuckyBooster ? [{
          id: 'lucky',
          name: activeLuckyBooster.name,
          value: activeLuckyBooster.hashRateBoost,
          source: 'lucky' as const
        }] : [])
      ]
    };
  }, [
    efficiency.current,
    efficiency.dailyActivityCompleted,
    efficiency.lastMaintenance,
    efficiency.interruptionCount,
    teamData.memberCount,
    snsConnections,
    activeLuckyBooster,
    determineGrade,
    gradeInfo,
    calculateTeamBonus,
    calculateSnsBonus
  ]);

  // Hash Rate와 Efficiency 업데이트 - 분리된 useEffect
  useEffect(() => {
    const newHashRateData = calculateCurrentHashRate();
    setHashRateData(prev => ({
      ...prev,
      ...newHashRateData
    }));
    setHashRate(newHashRateData.current);
  }, [calculateCurrentHashRate]);

  useEffect(() => {
    const newEfficiencyData = calculateCurrentEfficiency();
    setEfficiency(prev => ({
      ...prev,
      ...newEfficiencyData
    }));
  }, [calculateCurrentEfficiency]);

  // 럭키 가챠 함수
  const performLuckyGacha = async () => {
    setIsSpinning(true);
    setIsGachaOpen(true);
    
    // 스피닝 애니메이션
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 랜덤 보상 생성
    const rarities = ['common', 'rare', 'epic', 'legendary'] as const;
    const weights = [60, 30, 8, 2]; // 확률 가중치
    
    let random = Math.random() * 100;
    let selectedRarity: typeof rarities[number] = 'common';
    let cumulativeWeight = 0;
    
    for (let i = 0; i < rarities.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        selectedRarity = rarities[i];
        break;
      }
    }
    
    // 등급별 보상 생성
    const boostRange = {
      common: [3, 5],
      rare: [6, 9],
      epic: [10, 12],
      legendary: [13, 15]
    };
    
    const [min, max] = boostRange[selectedRarity];
    const boostValue = Math.floor(Math.random() * (max - min + 1)) + min;
    
    const newBooster: LuckyBooster = {
      id: `lucky_${Date.now()}`,
      name: `${selectedRarity.charAt(0).toUpperCase() + selectedRarity.slice(1)} Booster`,
      hashRateBoost: boostValue,
      duration: 24,
      rarity: selectedRarity,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
    
    setGachaResult(newBooster);
    setIsSpinning(false);
  };

  // 가챠 결과 적용
  const applyGachaResult = () => {
    if (gachaResult) {
      setActiveLuckyBooster(gachaResult);
      setGachaResult(null);
      setIsGachaOpen(false);
    }
  };

  // SNS 연동 토글
  const toggleSnsConnection = (platform: keyof SnsConnections) => {
    setSnsConnections(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  // 마이닝 타이머 - Supabase 연동
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMining && miningTime < TOTAL_MINING_TIME && activeMiningSession) {
      interval = setInterval(() => {
        setMiningTime(prev => {
          const newTime = prev + 1;
          
          // 효율성과 Hash Rate를 반영한 채굴 수익 계산
          const currentEarnings = calculateCurrentEarnings(newTime, hashRateData.current, efficiency.current);
          setEarnings(currentEarnings);
          
          // 해시레이트 변동 시뮬레이션
          const baseHashRate = hashRateData.current;
          setHashRate(baseHashRate + (Math.random() - 0.5) * 0.2);
          
          // 24시간 완료 체크
          if (newTime >= TOTAL_MINING_TIME) {
            handleMiningComplete();
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isMining, miningTime, activeMiningSession, hashRateData.current, efficiency.current]);

  // 마이닝 완료 처리
  const handleMiningComplete = async () => {
    if (!activeMiningSession) return;
    
    try {
      const finalEarnings = calculateFinalEarnings(TOTAL_MINING_TIME, hashRateData.current, efficiency.current);
      const success = await completeMiningSession(activeMiningSession.id, finalEarnings);
      
      if (success) {
        setIsMining(false);
        setActiveMiningSession(null);
        setLoginStreak(prev => prev + 1);
        
        // 마이닝 데이터 다시 로드
        await loadMiningData();
        
        console.log('✅ [Mining] 24시간 마이닝 세션 완료');
      }
    } catch (error) {
      console.error('❌ [Mining] 마이닝 완료 처리 실패:', error);
    }
  };

  // 마이닝 시작/종료 토글
  const handleMiningToggle = async () => {
    if (!isSupabaseConnected || !supabaseUser) {
      alert('Supabase 연결이 필요합니다.');
      return;
    }

    try {
      if (miningTime >= TOTAL_MINING_TIME) {
        // 24시간 완료 후 새 세션 시작
        setMiningTime(0);
        setEarnings(0);
        setMiningStartTime(null);
        setActiveMiningSession(null);
        return;
      }
      
      if (!isMining) {
        // 마이닝 시작
        console.log('🚀 [Mining] 마이닝 세션 시작...');
        
        const session = await SupabaseMiningService.startMiningSession(supabaseUser.id);
        if (session) {
          const startTime = Date.now();
          setMiningStartTime(startTime);
          setIsMining(true);
          setActiveMiningSession(session);
          setMiningTime(0);
          setEarnings(0);
          
          console.log('✅ [Mining] 마이닝 세션 시작 성공:', session.id);
        } else {
          alert('마이닝 세션 시작에 실패했습니다.');
        }
      } else {
        // 마이닝 정지
        console.log('⏸️ [Mining] 마이닝 세션 중단...');
        
        if (activeMiningSession) {
          const finalEarnings = calculateCurrentEarnings(miningTime, hashRateData.current, efficiency.current);
          const success = await completeMiningSession(activeMiningSession.id, finalEarnings);
          
          if (success) {
            setIsMining(false);
            setMiningStartTime(null);
            setActiveMiningSession(null);
            
            // 중단 카운트 증가
            setEfficiency(prev => ({
              ...prev,
              interruptionCount: prev.interruptionCount + 1
            }));
            
            // 마이닝 데이터 다시 로드
            await loadMiningData();
            
            console.log('✅ [Mining] 마이닝 세션 중단 완료');
          } else {
            alert('마이닝 세션 중단에 실패했습니다.');
          }
        }
      }
    } catch (error) {
      console.error('❌ [Mining] 마이닝 토글 오류:', error);
      alert('마이닝 작업 중 오류가 발생했습니다.');
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
          expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
        }
      ]
    }));
  };

  // 일일 활동 완료
  const handleDailyActivity = () => {
    setEfficiency(prev => ({
      ...prev,
      dailyActivityCompleted: true
    }));
  };

  // 현재 효율성 계산 - useMemo로 메모이제이션
  const currentEfficiency = useMemo(() => {
    return efficiency.current;
  }, [efficiency.current]);

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
    return determineGrade(eff);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const statsData = useMemo(() => [
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
      change: `${((hashRateData.current / hashRateData.base) * 100).toFixed(0)}% of base capacity`,
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
      changeType: currentEfficiency >= 85 ? 'positive' as const : 'neutral' as const,
      icon: <Activity className="w-6 h-6" />,
      iconColor: 'bg-purple-100 text-purple-600'
    }
  ], [earnings, hashRateData.current, hashRateData.base, miningTime, currentEfficiency, isMining, getEfficiencyGrade]);

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
          
          {/* Supabase 연결 상태 표시 */}
          <div className="flex items-center space-x-4 mt-2">
            <div className={`flex items-center space-x-2 text-sm ${
              isSupabaseConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isSupabaseConnected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              <span>
                {isSupabaseConnected ? 'Database Connected' : 'Database Disconnected'}
              </span>
            </div>
            
            {activeMiningSession && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <Database className="w-4 h-4" />
                <span>Session: {activeMiningSession.id.slice(0, 8)}...</span>
              </div>
            )}
            
            {isLoadingMiningData && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Supabase 연결 경고 */}
        {!isSupabaseConnected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Database Connection Required</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Mining sessions require database connection to save progress and earnings. 
                  Please ensure you're logged in and connected.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Lucky Booster Card */}
        {activeLuckyBooster && (
          <Card className={`mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-yellow-900 flex items-center">
                    {activeLuckyBooster.name}
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getRarityColor(activeLuckyBooster.rarity)}`}>
                      {activeLuckyBooster.rarity.toUpperCase()}
                    </span>
                  </h3>
                  <p className="text-sm text-yellow-700">
                    +{activeLuckyBooster.hashRateBoost}% Hash Rate Boost Active
                  </p>
                  {activeLuckyBooster.expiresAt && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Expires in: {Math.ceil((activeLuckyBooster.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))}h
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-900">
                  +{activeLuckyBooster.hashRateBoost}%
                </div>
                <div className="text-xs text-yellow-600">Hash Rate</div>
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
                
                {activeMiningSession && (
                  <p className="text-xs text-gray-500 mt-2">
                    Session ID: {activeMiningSession.id.slice(0, 8)}...
                  </p>
                )}
              </div>

              {/* Progress Circle */}
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
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
                disabled={!isSupabaseConnected || (miningTime >= TOTAL_MINING_TIME && !isMining)}
                loading={isLoadingMiningData}
              >
                {miningTime >= TOTAL_MINING_TIME ? 'Start New Session' :
                 isMining ? 'Stop Mining' : 'Start Mining'}
              </Button>

              {miningTime >= TOTAL_MINING_TIME && (
                <p className="mt-4 text-sm text-gray-600">
                  Congratulations! You've completed a 24-hour mining session.
                </p>
              )}
              
              {!isSupabaseConnected && (
                <p className="mt-4 text-sm text-red-600">
                  Database connection required for mining operations.
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

        {/* Combined Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hash Rate Boost Section - 완전히 새로운 보너스 시스템 */}
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

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-orange-400 to-red-500"
                  style={{ width: `${(hashRateData.current / hashRateData.maximum) * 100}%` }}
                />
              </div>
            </div>

            {/* 새로운 보너스 시스템 */}
            <div className="space-y-3 text-sm">
              {/* 1. Daily Check-in */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <CheckCircle className={`w-3 h-3 mr-1.5 ${efficiency.dailyActivityCompleted ? 'text-green-500' : 'text-gray-400'}`} />
                  Daily Check-in
                </span>
                <span className={`font-medium ${efficiency.dailyActivityCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  +{hashRateData.dailyCheckInBonus.toFixed(1)} TH/s
                </span>
              </div>
              
              {/* 2. Login Streak */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Flame className="w-3 h-3 mr-1.5 text-orange-500" />
                  Login Streak ({loginStreak}d)
                </span>
                <span className="font-medium text-orange-600">
                  +{hashRateData.loginStreakBonus.toFixed(1)} TH/s
                </span>
              </div>
              
              {/* 3. Referral Power */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <UserPlus className="w-3 h-3 mr-1.5 text-purple-500" />
                  Referral Power ({referralCount})
                </span>
                <span className="font-medium text-purple-600">
                  +{((referralCount * 2)).toFixed(0)}% ({hashRateData.referralPowerBonus.toFixed(2)} TH/s)
                </span>
              </div>
              
              {/* 4. Lucky Booster */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1.5 text-yellow-500" />
                  Lucky Booster
                </span>
                <span className={`font-medium ${activeLuckyBooster ? 'text-yellow-600' : 'text-gray-400'}`}>
                  +{activeLuckyBooster ? activeLuckyBooster.hashRateBoost : 0}% ({hashRateData.luckyBoosterBonus.toFixed(2)} TH/s)
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              {!efficiency.dailyActivityCompleted && (
                <Button
                  onClick={handleDailyActivity}
                  variant="primary"
                  size="sm"
                  className="w-full"
                  icon={CheckCircle}
                >
                  Complete Daily Check-in (+1.0 TH/s)
                </Button>
              )}
              
              <Button
                onClick={() => setIsGachaOpen(true)}
                variant="outline"
                size="sm"
                className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                icon={Dice6}
              >
                Lucky Gacha (Get Random Booster)
              </Button>
            </div>
            
            {hashRateData.current >= hashRateData.maximum && (
              <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-center text-xs">
                  <Award className="w-3 h-3 mr-1 text-yellow-600" />
                  <span className="text-yellow-700 font-medium">Maximum Hash Rate Achieved!</span>
                </div>
              </div>
            )}
          </Card>

          {/* Efficiency Status Section - 완전히 새로운 보너스 시스템 */}
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

            {/* Progress Bar */}
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

            {/* 새로운 효율성 보너스 시스템 */}
            <div className="space-y-3 text-sm">
              {/* 1. 등급에 따른 기본 보상 */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Crown className={`w-3 h-3 mr-1.5 ${efficiency.baseGrade === 'Diamond' ? 'text-purple-500' : 
                    efficiency.baseGrade === 'Platinum' ? 'text-blue-500' :
                    efficiency.baseGrade === 'Gold' ? 'text-yellow-500' :
                    efficiency.baseGrade === 'Silver' ? 'text-gray-500' : 'text-orange-500'}`} />
                  {efficiency.baseGrade} Grade
                </span>
                <span className="font-medium text-blue-600">
                  +{gradeInfo.find(g => g.name === efficiency.baseGrade)?.baseReward || 0}%
                </span>
              </div>
              
              {/* 2. Team 보너스 */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Users className="w-3 h-3 mr-1.5 text-green-500" />
                  Team ({teamData.memberCount})
                </span>
                <span className="font-medium text-green-600">
                  +{efficiency.teamBonus.toFixed(1)}%
                </span>
              </div>
              
              {/* 3. SNS 연동 보너스 */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <ExternalLink className="w-3 h-3 mr-1.5 text-purple-500" />
                  SNS Connected ({Object.values(snsConnections).filter(Boolean).length})
                </span>
                <span className="font-medium text-purple-600">
                  +{efficiency.snsBonus.toFixed(1)}%
                </span>
              </div>
              
              {/* 4. 유지보수 상태 */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Wrench className={`w-3 h-3 mr-1.5 ${efficiency.lastMaintenance >= 4 ? 'text-orange-500' : 'text-green-500'}`} />
                  Maintenance
                </span>
                <span className={`font-medium ${efficiency.lastMaintenance >= 4 ? 'text-orange-600' : 'text-green-600'}`}>
                  {efficiency.lastMaintenance >= 4 ? `${efficiency.lastMaintenance.toFixed(1)}h ago` : 'Good (+3%)'}
                </span>
              </div>
            </div>

            {/* SNS 연동 섹션 */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-700 mb-2">SNS Connections (+1.5% each)</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'facebook' as keyof SnsConnections, icon: Facebook, color: 'text-blue-600' },
                  { key: 'twitter' as keyof SnsConnections, icon: Twitter, color: 'text-blue-400' },
                  { key: 'instagram' as keyof SnsConnections, icon: Instagram, color: 'text-pink-600' },
                  { key: 'youtube' as keyof SnsConnections, icon: Youtube, color: 'text-red-600' }
                ].map(({ key, icon: Icon, color }) => (
                  <button
                    key={key}
                    onClick={() => toggleSnsConnection(key)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      snsConnections[key] 
                        ? `border-green-300 bg-green-50 ${color}` 
                        : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto" />
                  </button>
                ))}
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
          </Card>
        </div>

        {/* Earnings Analysis and Mining History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mining History - Supabase 데이터 */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Mining History
                {isSupabaseConnected && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Live
                  </span>
                )}
              </h3>
              <Button
                onClick={loadMiningData}
                variant="outline"
                size="sm"
                loading={isLoadingMiningData}
                icon={Database}
                disabled={!isSupabaseConnected}
              >
                Refresh
              </Button>
            </div>
            
            <div className="space-y-4">
              {miningHistory.length > 0 ? (
                miningHistory.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {session.status === 'completed' ? 'Completed' : 'Active'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.start_time).toLocaleDateString()} {new Date(session.start_time).toLocaleTimeString()}
                      </p>
                      {session.duration_seconds && (
                        <p className="text-xs text-blue-600">
                          Duration: {Math.floor(session.duration_seconds / 3600)}h {Math.floor((session.duration_seconds % 3600) / 60)}m
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        +{session.earnings_bnb?.toFixed(6) || '0.000000'} BNB
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.efficiency?.toFixed(1) || '0.0'}% efficiency
                      </p>
                      <p className="text-xs text-orange-600">
                        {session.hash_rate?.toFixed(1) || '0.0'} TH/s
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
                      <WifiOff className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Database not connected</p>
                      <p className="text-sm">Connect to view history</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Earn Analysis - Supabase 데이터 기반 */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Earn Analysis
              {isSupabaseConnected && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Real-time
                </span>
              )}
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

            {/* Chart Placeholder */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <LineChart className="w-4 h-4 mr-2" />
                Daily Rewards
              </h4>
              
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
              
              {activeMiningSession && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Current Session</span>
                  <span className="font-medium text-purple-600">
                    {activeMiningSession.id.slice(0, 8)}...
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
                    {isSupabaseConnected 
                      ? `Connect more SNS accounts and maintain ${currentEfficiency >= 85 ? 'your excellent' : 'high'} efficiency 
                         ${currentEfficiency < 85 && ' (target: 85%+)'} for maximum daily rewards.`
                      : 'Connect to database to track your mining performance and earnings history.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Lucky Gacha Modal */}
      {isGachaOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lucky Gacha</h3>
              
              {!gachaResult ? (
                <>
                  <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Dice6 className={`w-16 h-16 text-white ${isSpinning ? 'animate-spin' : ''}`} />
                  </div>
                  
                  {!isSpinning ? (
                    <Button
                      onClick={performLuckyGacha}
                      variant="primary"
                      size="lg"
                      className="w-full"
                      icon={Sparkles}
                    >
                      Spin for Lucky Booster!
                    </Button>
                  ) : (
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700 mb-2">Spinning...</div>
                      <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getRarityColor(gachaResult.rarity)}`}>
                      <Sparkles className="w-12 h-12" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{gachaResult.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">+{gachaResult.hashRateBoost}% Hash Rate Boost</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRarityColor(gachaResult.rarity)}`}>
                      {gachaResult.rarity.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => {
                        setGachaResult(null);
                        setIsGachaOpen(false);
                      }}
                      variant="outline"
                    >
                      Discard
                    </Button>
                    <Button
                      onClick={applyGachaResult}
                      variant="primary"
                    >
                      Apply Boost
                    </Button>
                  </div>
                </>
              )}
              
              <button
                onClick={() => {
                  setIsGachaOpen(false);
                  setGachaResult(null);
                  setIsSpinning(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarnPage;