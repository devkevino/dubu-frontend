import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Zap, 
  Clock, 
  DollarSign, 
  Activity
} from 'lucide-react';
import { Button, StatsCard, Card } from '../components/ui';

const EarnPage: React.FC = () => {
  const [isMining, setIsMining] = useState(false);
  const [miningTime, setMiningTime] = useState(0); // seconds
  const [earnings, setEarnings] = useState(0);
  const [hashRate, setHashRate] = useState(12.5);
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null);

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
          // 채굴 수익 계산 (시간당 약 0.001 BTC)
          setEarnings(prev => prev + 0.001 / 3600);
          // 해시레이트 변동 시뮬레이션
          setHashRate(prev => prev + (Math.random() - 0.5) * 0.1);
          
          if (newTime >= TOTAL_MINING_TIME) {
            setIsMining(false);
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isMining, miningTime]);

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
      // 채굴 정지
      setIsMining(false);
      setMiningStartTime(null);
      localStorage.removeItem('miningState');
    }
  };

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
      value: `${(progressPercentage * 0.95 + 5).toFixed(1)}%`,
      change: isMining ? 'Optimizing' : 'Idle',
      changeType: isMining ? 'positive' as const : 'neutral' as const,
      icon: <Activity className="w-6 h-6" />,
      iconColor: 'bg-purple-100 text-purple-600'
    }
  ];

  const miningHistory = [
    { date: '2024-01-05', duration: '24:00:00', earnings: 0.024, status: 'completed' },
    { date: '2024-01-04', duration: '24:00:00', earnings: 0.023, status: 'completed' },
    { date: '2024-01-03', duration: '18:30:00', earnings: 0.018, status: 'interrupted' },
    { date: '2024-01-02', duration: '24:00:00', earnings: 0.025, status: 'completed' },
    { date: '2024-01-01', duration: '24:00:00', earnings: 0.022, status: 'completed' },
  ];

  return (
    <div className="h-full overflow-auto">
      {/* Main Content */}
      <div className="p-4 md:p-6">
        {/* Mining Control Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Mining Operations</h2>
          <p className="text-sm md:text-base text-gray-600">Start your 24-hour mining session and track your progress.</p>
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
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.status}
                    </span>
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
                <p className="text-sm text-gray-500">Hash Rate Chart</p>
                <p className="text-xs text-gray-400">Real-time visualization</p>
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
                <span className="text-sm text-gray-600">Power Consumption:</span>
                <span className="text-sm font-medium text-gray-900">
                  {isMining ? '2.4 kW' : '0.1 kW'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Temperature:</span>
                <span className="text-sm font-medium text-gray-900">
                  {isMining ? '68°C' : '32°C'}
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