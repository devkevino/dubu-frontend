import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Gift, 
  Crown, 
  Copy, 
  Share2, 
  Star,
  Trophy,
  TrendingUp,
  Zap,
  DollarSign,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  Clock,
  Target,
  MessageSquare,
  Facebook,
  Twitter,
  Mail,
  Link,
  Activity,
  Award,
  Flame,
  Settings,
  MoreVertical,
  UserCheck,
  Calendar
} from 'lucide-react';
import { Card, StatsCard, Button } from '../components/ui';
import { useWeb3Auth } from '../providers/Web3AuthProvider';

// 팀 멤버 인터페이스
interface TeamMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  joinDate: string;
  totalEarnings: number;
  currentStreak: number;
  rankInTeam: number;
  status: 'active' | 'inactive';
  lastActive: string;
  achievements: string[];
  referralCount: number;
}

// 팀 정보 인터페이스
interface TeamInfo {
  id: string;
  name: string;
  leaderId: string;
  leaderName: string;
  description: string;
  totalMembers: number;
  maxMembers: number;
  totalEarnings: number;
  teamRank: number;
  createdDate: string;
  isJoined: boolean;
  joinCode?: string;
}

// 레퍼럴 통계 인터페이스
interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCommission: number;
  monthlyCommission: number;
  conversionRate: number;
  topReferralSource: string;
}

const TeamPage: React.FC = () => {
  const { user } = useWeb3Auth();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'referral' | 'leaderboard'>('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 임시 데이터 - 실제로는 API에서 가져올 데이터
  const currentTeam: TeamInfo = {
    id: 'team-001',
    name: 'Diamond Miners',
    leaderId: 'leader-001',
    leaderName: 'John Doe',
    description: 'Elite mining team focused on maximum efficiency and collaboration',
    totalMembers: 12,
    maxMembers: 20,
    totalEarnings: 15.2456,
    teamRank: 3,
    createdDate: '2024-01-15',
    isJoined: true,
    joinCode: 'DM2024'
  };

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '',
      joinDate: '2024-01-15',
      totalEarnings: 3.2456,
      currentStreak: 15,
      rankInTeam: 1,
      status: 'active',
      lastActive: '2 minutes ago',
      achievements: ['Team Leader', 'Top Earner', '30-Day Streak'],
      referralCount: 8
    },
    {
      id: '2',
      name: 'Alice Smith',
      email: 'alice@example.com',
      avatar: '',
      joinDate: '2024-01-18',
      totalEarnings: 2.8934,
      currentStreak: 12,
      rankInTeam: 2,
      status: 'active',
      lastActive: '1 hour ago',
      achievements: ['Consistent Miner', '10-Day Streak'],
      referralCount: 5
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      avatar: '',
      joinDate: '2024-01-20',
      totalEarnings: 2.1567,
      currentStreak: 8,
      rankInTeam: 3,
      status: 'active',
      lastActive: '3 hours ago',
      achievements: ['Rising Star'],
      referralCount: 3
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: '',
      joinDate: '2024-01-25',
      totalEarnings: 1.7890,
      currentStreak: 5,
      rankInTeam: 4,
      status: 'inactive',
      lastActive: '2 days ago',
      achievements: [],
      referralCount: 2
    }
  ];

  const referralStats: ReferralStats = {
    totalReferrals: 5,
    activeReferrals: 4,
    totalCommission: 0.125,
    monthlyCommission: 0.045,
    conversionRate: 80,
    topReferralSource: 'Twitter'
  };

  const availableTeams: TeamInfo[] = [
    {
      id: 'team-002',
      name: 'Gold Rush Squad',
      leaderId: 'leader-002',
      leaderName: 'Mike Chen',
      description: 'Fast-growing team with focus on daily mining consistency',
      totalMembers: 8,
      maxMembers: 15,
      totalEarnings: 8.7543,
      teamRank: 7,
      createdDate: '2024-02-01',
      isJoined: false
    },
    {
      id: 'team-003',
      name: 'Crypto Pioneers',
      leaderId: 'leader-003',
      leaderName: 'Emma Davis',
      description: 'Beginner-friendly team with mentorship program',
      totalMembers: 15,
      maxMembers: 25,
      totalEarnings: 12.3456,
      teamRank: 5,
      createdDate: '2024-01-10',
      isJoined: false
    }
  ];

  const referralLink = `https://minecore.app/join?ref=${user?.email?.split('@')[0] || 'USER123'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'email') => {
    const message = `Join me on MineCore and start earning crypto! Use my referral link: ${referralLink}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=Join MineCore&body=${encodeURIComponent(message)}`, '_blank');
        break;
    }
    setShowShareModal(false);
  };

  const statsData = [
    {
      title: 'Team Rank',
      value: `#${currentTeam.teamRank}`,
      change: '+2 from last week',
      changeType: 'positive' as const,
      icon: <Trophy className="w-6 h-6" />,
      iconColor: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Team Members',
      value: `${currentTeam.totalMembers}/${currentTeam.maxMembers}`,
      change: `${((currentTeam.totalMembers / currentTeam.maxMembers) * 100).toFixed(0)}% capacity`,
      changeType: 'neutral' as const,
      icon: <Users className="w-6 h-6" />,
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Total Earnings',
      value: `₿${currentTeam.totalEarnings.toFixed(4)}`,
      change: '+12.5% this month',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-6 h-6" />,
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      title: 'My Referrals',
      value: referralStats.totalReferrals.toString(),
      change: `${referralStats.activeReferrals} active`,
      changeType: 'positive' as const,
      icon: <UserPlus className="w-6 h-6" />,
      iconColor: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Team & Referrals</h2>
              <p className="text-sm md:text-base text-gray-600">
                Build your mining team and earn referral rewards together.
              </p>
            </div>
            <Button
              onClick={() => setShowShareModal(true)}
              variant="primary"
              icon={Share2}
              className="hidden md:flex"
            >
              Share Referral
            </Button>
          </div>

          {/* Mobile Share Button */}
          <div className="md:hidden mb-4">
            <Button
              onClick={() => setShowShareModal(true)}
              variant="primary"
              icon={Share2}
              className="w-full"
            >
              Share Referral Link
            </Button>
          </div>

          {/* Current Team Status */}
          {currentTeam.isJoined && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900">{currentTeam.name}</h3>
                    <p className="text-sm text-blue-700">Led by {currentTeam.leaderName}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-blue-600">
                      <span>Rank #{currentTeam.teamRank}</span>
                      <span>•</span>
                      <span>{currentTeam.totalMembers} members</span>
                      <span>•</span>
                      <span>₿{currentTeam.totalEarnings.toFixed(4)} earned</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-900">Team Code</div>
                  <div className="text-lg font-bold text-blue-600">{currentTeam.joinCode}</div>
                </div>
              </div>
            </Card>
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

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'members', label: 'Members', icon: Users },
                { id: 'referral', label: 'Referral', icon: Gift },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Performance */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Team Performance
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Daily Average</p>
                    <p className="text-sm text-gray-600">Per team member</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₿0.0127</p>
                    <p className="text-xs text-green-600">+8.2% vs last week</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Team Efficiency</p>
                    <p className="text-sm text-gray-600">Average mining rate</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">87.3%</p>
                    <p className="text-xs text-blue-600">Above team target</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Active Miners</p>
                    <p className="text-sm text-gray-600">Last 24 hours</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">11/12</p>
                    <p className="text-xs text-green-600">91.7% participation</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Team Activities */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Activities
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <UserPlus className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New member joined</p>
                    <p className="text-xs text-gray-600">Sarah Wilson joined the team • 2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mt-1">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Team rank improved</p>
                    <p className="text-xs text-gray-600">Moved up to rank #3 • 1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Monthly goal achieved</p>
                    <p className="text-xs text-gray-600">Team reached 15 BTC milestone • 3 days ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                    <Gift className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Referral bonus earned</p>
                    <p className="text-xs text-gray-600">John earned ₿0.005 commission • 5 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Team Leader Section */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-600" />
                Team Leader
              </h3>
              
              {teamMembers.filter(member => member.rankInTeam === 1).map((leader) => (
                <div key={leader.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Crown className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">1</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{leader.name}</h4>
                      <p className="text-sm text-gray-600">{leader.email}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Leader</span>
                        <span className="text-xs text-gray-500">{leader.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₿{leader.totalEarnings.toFixed(4)}</p>
                    <p className="text-sm text-gray-600">{leader.currentStreak} day streak</p>
                    <p className="text-xs text-purple-600">{leader.referralCount} referrals</p>
                  </div>
                </div>
              ))}
            </Card>

            {/* Team Members */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Members ({currentTeam.totalMembers - 1})
              </h3>
              
              <div className="space-y-3">
                {teamMembers.filter(member => member.rankInTeam > 1).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{member.rankInTeam}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            member.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {member.status}
                          </span>
                          <span className="text-xs text-gray-500">{member.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₿{member.totalEarnings.toFixed(4)}</p>
                      <p className="text-sm text-gray-600">{member.currentStreak} day streak</p>
                      <p className="text-xs text-purple-600">{member.referralCount} referrals</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'referral' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referral Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Gift className="w-5 h-5 mr-2" />
                Referral Statistics
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{referralStats.totalReferrals}</p>
                  <p className="text-sm text-gray-600">Total Referrals</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{referralStats.activeReferrals}</p>
                  <p className="text-sm text-gray-600">Active Miners</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">₿{referralStats.totalCommission.toFixed(4)}</p>
                  <p className="text-sm text-gray-600">Total Commission</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{referralStats.conversionRate}%</p>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
              </div>

              {/* Referral Link */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
                <div className="flex">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant={copiedLink ? "secondary" : "primary"}
                    className="rounded-l-none"
                    icon={copiedLink ? CheckCircle : Copy}
                  >
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              {/* Quick Share Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Quick Share</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleShare('twitter')}
                    variant="outline"
                    size="sm"
                    icon={Twitter}
                    className="text-blue-500 border-blue-300 hover:bg-blue-50"
                  >
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleShare('facebook')}
                    variant="outline"
                    size="sm"
                    icon={Facebook}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Facebook
                  </Button>
                </div>
              </div>
            </Card>

            {/* Commission History */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Commission History
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Alice Smith joined</p>
                    <p className="text-sm text-gray-600">January 18, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+₿0.025</p>
                    <p className="text-xs text-gray-500">Signup bonus</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Monthly commission</p>
                    <p className="text-sm text-gray-600">January 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+₿0.045</p>
                    <p className="text-xs text-gray-500">5% of referral earnings</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Bob Johnson joined</p>
                    <p className="text-sm text-gray-600">January 20, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+₿0.025</p>
                    <p className="text-xs text-gray-500">Signup bonus</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Team milestone bonus</p>
                    <p className="text-sm text-gray-600">January 30, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+₿0.030</p>
                    <p className="text-xs text-gray-500">5 active referrals</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Teams */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Top Teams
              </h3>
              
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Elite Miners', earnings: 25.7834, members: 20, leader: 'Alex Kim' },
                  { rank: 2, name: 'Crypto Legends', earnings: 22.1456, members: 18, leader: 'Maria Garcia' },
                  { rank: 3, name: 'Diamond Miners', earnings: 15.2456, members: 12, leader: 'John Doe', isCurrentTeam: true },
                  { rank: 4, name: 'Hash Heroes', earnings: 13.8901, members: 15, leader: 'David Park' },
                  { rank: 5, name: 'Crypto Pioneers', earnings: 12.3456, members: 15, leader: 'Emma Davis' }
                ].map((team) => (
                  <div 
                    key={team.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      team.isCurrentTeam ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        team.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                        team.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        team.rank === 3 ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {team.rank}
                      </div>
                      <div>
                        <p className={`font-medium ${team.isCurrentTeam ? 'text-blue-900' : 'text-gray-900'}`}>
                          {team.name}
                          {team.isCurrentTeam && <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Your Team</span>}
                        </p>
                        <p className="text-sm text-gray-600">Led by {team.leader} • {team.members} members</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₿{team.earnings.toFixed(4)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Individual Miners */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Top Individual Miners
              </h3>
              
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Alex Kim', earnings: 4.5678, team: 'Elite Miners', streak: 25 },
                  { rank: 2, name: 'Maria Garcia', earnings: 4.2134, team: 'Crypto Legends', streak: 23 },
                  { rank: 3, name: 'John Doe', earnings: 3.2456, team: 'Diamond Miners', streak: 15, isCurrentUser: true },
                  { rank: 4, name: 'David Park', earnings: 3.1567, team: 'Hash Heroes', streak: 18 },
                  { rank: 5, name: 'Emma Davis', earnings: 2.9876, team: 'Crypto Pioneers', streak: 12 }
                ].map((miner) => (
                  <div 
                    key={miner.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      miner.isCurrentUser ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        miner.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                        miner.rank === 2 ? 'bg-gray-100 text-gray-600' :
                        miner.rank === 3 ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {miner.rank}
                      </div>
                      <div>
                        <p className={`font-medium ${miner.isCurrentUser ? 'text-green-900' : 'text-gray-900'}`}>
                          {miner.name}
                          {miner.isCurrentUser && <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">You</span>}
                        </p>
                        <p className="text-sm text-gray-600">{miner.team} • {miner.streak} day streak</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₿{miner.earnings.toFixed(4)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Available Teams Section */}
        {!currentTeam.isJoined && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Teams to Join</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {availableTeams.map((team) => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{team.name}</h4>
                      <p className="text-sm text-gray-600">Led by {team.leaderName}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      Rank #{team.teamRank}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">{team.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Members</p>
                      <p className="font-medium">{team.totalMembers}/{team.maxMembers}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Earnings</p>
                      <p className="font-medium">₿{team.totalEarnings.toFixed(4)}</p>
                    </div>
                  </div>
                  
                  <Button variant="primary" className="w-full" icon={UserPlus}>
                    Join Team
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share Referral Link</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Referral Link</label>
              <div className="flex">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  variant={copiedLink ? "secondary" : "primary"}
                  className="rounded-l-none"
                  icon={copiedLink ? CheckCircle : Copy}
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Share on social media</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleShare('twitter')}
                  variant="outline"
                  icon={Twitter}
                  className="text-blue-500 border-blue-300 hover:bg-blue-50"
                >
                  Twitter
                </Button>
                <Button
                  onClick={() => handleShare('facebook')}
                  variant="outline"
                  icon={Facebook}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  Facebook
                </Button>
                <Button
                  onClick={() => handleShare('email')}
                  variant="outline"
                  icon={Mail}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;