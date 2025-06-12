import React, { useState } from 'react';
import { 
  Settings,
  Shield,
  Bell,
  Zap,
  CreditCard,
  Palette,
  HelpCircle,
  User,
  Camera,
  Key,
  History,
  LogOut,
  Download,
  Upload,
  Eye,
  EyeOff,
  MessageSquare,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Clock,
  DollarSign,
  Smartphone,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  RefreshCw,
  FileText,
  MessageCircle,
  Bug,
  Lightbulb,
  BookOpen,
  Mail,
  Phone,
  Save,
  X,
  Edit3,
  Copy,
  QrCode,
  Coffee,
  PlayCircle
} from 'lucide-react';
import { Card, Button, Input } from '../components/ui';
import { useWeb3Auth } from '../providers/Web3AuthProvider';

type SettingsTab = 'account' | 'notifications' | 'mining' | 'card' | 'display' | 'support';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

const SettingsPage: React.FC = () => {
  const { user, address, logout } = useWeb3Auth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  // Settings states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profileImage: user?.profileImage || ''
  });

  const [connectedAccounts] = useState({
    google: !!user?.typeOfLogin?.includes('google'),
    facebook: false,
    twitter: true,
    discord: false
  });

  const [miningNotifications, setMiningNotifications] = useState({
    sessionComplete: true,
    hashRateChanges: true,
    efficiencyAlerts: false,
    maintenanceReminders: true
  });

  const [transactionNotifications, setTransactionNotifications] = useState({
    deposits: true,
    withdrawals: true,
    cardUsage: true,
    largeTransactions: true
  });

  const [teamNotifications, setTeamNotifications] = useState({
    newMembers: true,
    referralRewards: true,
    rankChanges: true,
    teamAchievements: false
  });

  const [miningSettings, setMiningSettings] = useState({
    autoStart: false,
    snsConnections: true,
    dailyReminders: true,
    efficiency_target: 85
  });

  const [cardSettings, setCardSettings] = useState({
    onlinePayments: true,
    atmWithdrawals: false,
    internationalUsage: true,
    transactionAlerts: true,
    monthlyLimit: 5000
  });

  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    language: 'en',
    timezone: 'Asia/Seoul',
    currency: 'USD',
    hideBalances: false
  });

  const tabs = [
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'mining', label: 'Mining', icon: Zap },
    { id: 'card', label: 'Card & Payments', icon: CreditCard },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'support', label: 'Help & Support', icon: HelpCircle }
  ];

  const handleSaveProfile = () => {
    // 실제로는 API 호출
    console.log('Saving profile:', profileData);
    setShowEditProfile(false);
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const handleExportPrivateKey = () => {
    // 실제로는 Web3Auth에서 개인키 내보내기
    console.log('Exporting private key...');
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Settings className="w-6 h-6 mr-3" />
            Settings
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Manage your account, security, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Account & Security Tab */}
            {activeTab === 'account' && (
              <>
                {/* Profile Information */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Profile Information
                    </h3>
                    <Button
                      onClick={() => setShowEditProfile(true)}
                      variant="outline"
                      size="sm"
                      icon={Edit3}
                    >
                      Edit
                    </Button>
                  </div>

                  {!showEditProfile ? (
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        {user?.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt="Profile" 
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-blue-600" />
                          </div>
                        )}
                        <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                          <Camera className="w-3 h-3" />
                        </button>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">{user?.name || 'Anonymous User'}</h4>
                        <p className="text-gray-600">{user?.email || 'No email'}</p>
                        {user?.typeOfLogin && (
                          <p className="text-sm text-blue-600">Connected via {user.typeOfLogin}</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        label="Full Name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        placeholder="Enter your email"
                      />
                      <div className="flex space-x-3">
                        <Button onClick={handleSaveProfile} variant="primary" icon={Save}>
                          Save Changes
                        </Button>
                        <Button onClick={() => setShowEditProfile(false)} variant="outline" icon={X}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Connected Accounts */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Connected Accounts
                  </h3>
                  <div className="space-y-4">
                    {[
                      { id: 'google', name: 'Google', icon: Mail, color: 'text-red-600' },
                      { id: 'facebook', name: 'Facebook', icon: User, color: 'text-blue-600' },
                      { id: 'twitter', name: 'Twitter', icon: MessageCircle, color: 'text-blue-400' },
                      { id: 'discord', name: 'Discord', icon: MessageSquare, color: 'text-purple-600' }
                    ].map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <account.icon className={`w-6 h-6 ${account.color}`} />
                          <div>
                            <p className="font-medium text-gray-900">{account.name}</p>
                            <p className="text-sm text-gray-600">
                              {connectedAccounts[account.id as keyof typeof connectedAccounts] 
                                ? 'Connected' 
                                : 'Not connected'
                              }
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={connectedAccounts[account.id as keyof typeof connectedAccounts] ? "secondary" : "outline"}
                          size="sm"
                        >
                          {connectedAccounts[account.id as keyof typeof connectedAccounts] ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Wallet Security */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Wallet Security
                  </h3>
                  <div className="space-y-4">
                    {/* Wallet Address */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">Wallet Address</p>
                        <Button onClick={handleCopyAddress} variant="outline" size="sm" icon={Copy}>
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm font-mono text-gray-600 break-all">
                        {address || 'No wallet connected'}
                      </p>
                    </div>

                    {/* Private Key Export */}
                    <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-orange-900">Private Key Backup</p>
                          <p className="text-sm text-orange-700 mt-1">
                            Export your private key for backup purposes. Keep it safe and never share it.
                          </p>
                          <Button
                            onClick={handleExportPrivateKey}
                            variant="outline"
                            size="sm"
                            className="mt-3 border-orange-300 text-orange-700 hover:bg-orange-100"
                            icon={Download}
                          >
                            Export Private Key
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 2FA Setup */}
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-900">Two-Factor Authentication</p>
                          <p className="text-sm text-green-700">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                          Setup 2FA
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Login History */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Login History
                  </h3>
                  <div className="space-y-3">
                    {[
                      { date: '2024-01-06 14:30', location: 'Seoul, South Korea', device: 'Chrome on Windows', status: 'current' },
                      { date: '2024-01-05 09:15', location: 'Seoul, South Korea', device: 'Mobile App', status: 'success' },
                      { date: '2024-01-04 18:45', location: 'Seoul, South Korea', device: 'Chrome on Windows', status: 'success' }
                    ].map((login, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{login.device}</p>
                          <p className="text-sm text-gray-600">{login.location}</p>
                          <p className="text-xs text-gray-500">{login.date}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          login.status === 'current' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {login.status === 'current' ? 'Current Session' : 'Successful'}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <>
                {/* Mining Notifications */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Mining Notifications
                  </h3>
                  <div className="space-y-1">
                    <ToggleSwitch
                      enabled={miningNotifications.sessionComplete}
                      onChange={(enabled) => setMiningNotifications({...miningNotifications, sessionComplete: enabled})}
                      label="Mining Session Complete"
                      description="Get notified when your 24-hour mining session is complete"
                    />
                    <ToggleSwitch
                      enabled={miningNotifications.hashRateChanges}
                      onChange={(enabled) => setMiningNotifications({...miningNotifications, hashRateChanges: enabled})}
                      label="Hash Rate Changes"
                      description="Alert when hash rate changes significantly"
                    />
                    <ToggleSwitch
                      enabled={miningNotifications.efficiencyAlerts}
                      onChange={(enabled) => setMiningNotifications({...miningNotifications, efficiencyAlerts: enabled})}
                      label="Efficiency Alerts"
                      description="Notify when mining efficiency drops below threshold"
                    />
                    <ToggleSwitch
                      enabled={miningNotifications.maintenanceReminders}
                      onChange={(enabled) => setMiningNotifications({...miningNotifications, maintenanceReminders: enabled})}
                      label="Maintenance Reminders"
                      description="Remind to perform equipment maintenance"
                    />
                  </div>
                </Card>

                {/* Transaction Notifications */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Transaction Notifications
                  </h3>
                  <div className="space-y-1">
                    <ToggleSwitch
                      enabled={transactionNotifications.deposits}
                      onChange={(enabled) => setTransactionNotifications({...transactionNotifications, deposits: enabled})}
                      label="Deposits"
                      description="Notify when tokens are deposited to your wallet"
                    />
                    <ToggleSwitch
                      enabled={transactionNotifications.withdrawals}
                      onChange={(enabled) => setTransactionNotifications({...transactionNotifications, withdrawals: enabled})}
                      label="Withdrawals"
                      description="Alert for all withdrawal transactions"
                    />
                    <ToggleSwitch
                      enabled={transactionNotifications.cardUsage}
                      onChange={(enabled) => setTransactionNotifications({...transactionNotifications, cardUsage: enabled})}
                      label="Card Usage"
                      description="Notify when crypto card is used for payments"
                    />
                    <ToggleSwitch
                      enabled={transactionNotifications.largeTransactions}
                      onChange={(enabled) => setTransactionNotifications({...transactionNotifications, largeTransactions: enabled})}
                      label="Large Transactions"
                      description="Alert for transactions above $1,000"
                    />
                  </div>
                </Card>

                {/* Team & Referral Notifications */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Team & Referral Notifications
                  </h3>
                  <div className="space-y-1">
                    <ToggleSwitch
                      enabled={teamNotifications.newMembers}
                      onChange={(enabled) => setTeamNotifications({...teamNotifications, newMembers: enabled})}
                      label="New Team Members"
                      description="Notify when someone joins your referral team"
                    />
                    <ToggleSwitch
                      enabled={teamNotifications.referralRewards}
                      onChange={(enabled) => setTeamNotifications({...teamNotifications, referralRewards: enabled})}
                      label="Referral Rewards"
                      description="Alert when you receive referral commissions"
                    />
                    <ToggleSwitch
                      enabled={teamNotifications.rankChanges}
                      onChange={(enabled) => setTeamNotifications({...teamNotifications, rankChanges: enabled})}
                      label="Team Rank Changes"
                      description="Notify when your team rank changes"
                    />
                    <ToggleSwitch
                      enabled={teamNotifications.teamAchievements}
                      onChange={(enabled) => setTeamNotifications({...teamNotifications, teamAchievements: enabled})}
                      label="Team Achievements"
                      description="Celebrate when your team reaches milestones"
                    />
                  </div>
                </Card>
              </>
            )}

            {/* Mining Settings Tab */}
            {activeTab === 'mining' && (
              <>
                {/* Bonus Management */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Bonus Management
                  </h3>
                  <div className="space-y-1">
                    <ToggleSwitch
                      enabled={miningSettings.autoStart}
                      onChange={(enabled) => setMiningSettings({...miningSettings, autoStart: enabled})}
                      label="Auto-Start Mining"
                      description="Automatically start new mining session after completion"
                    />
                    <ToggleSwitch
                      enabled={miningSettings.snsConnections}
                      onChange={(enabled) => setMiningSettings({...miningSettings, snsConnections: enabled})}
                      label="SNS Connection Bonus"
                      description="Enable efficiency bonuses from connected social accounts"
                    />
                    <ToggleSwitch
                      enabled={miningSettings.dailyReminders}
                      onChange={(enabled) => setMiningSettings({...miningSettings, dailyReminders: enabled})}
                      label="Daily Check-in Reminders"
                      description="Remind to complete daily check-in for hash rate bonus"
                    />
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Efficiency Target: {miningSettings.efficiency_target}%
                        </label>
                        <input
                          type="range"
                          min="60"
                          max="100"
                          value={miningSettings.efficiency_target}
                          onChange={(e) => setMiningSettings({...miningSettings, efficiency_target: parseInt(e.target.value)})}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>60%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* SNS Connections Management */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">SNS Connection Management</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Facebook', icon: User, color: 'text-blue-600', connected: true },
                      { name: 'Twitter', icon: MessageCircle, color: 'text-blue-400', connected: false },
                      { name: 'Instagram', icon: Camera, color: 'text-pink-600', connected: true },
                      { name: 'YouTube', icon: PlayCircle, color: 'text-red-600', connected: false }
                    ].map((social) => (
                      <div key={social.name} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3 mb-3">
                          <social.icon className={`w-6 h-6 ${social.color}`} />
                          <span className="font-medium">{social.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${social.connected ? 'text-green-600' : 'text-gray-500'}`}>
                            {social.connected ? 'Connected (+1.5%)' : 'Not Connected'}
                          </span>
                          <Button 
                            variant={social.connected ? "secondary" : "outline"} 
                            size="sm"
                          >
                            {social.connected ? 'Disconnect' : 'Connect'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* Card & Payments Tab */}
            {activeTab === 'card' && (
              <>
                {/* Card Management */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Card Management
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Spending Limit: ${cardSettings.monthlyLimit}
                      </label>
                      <input
                        type="range"
                        min="1000"
                        max="10000"
                        step="500"
                        value={cardSettings.monthlyLimit}
                        onChange={(e) => setCardSettings({...cardSettings, monthlyLimit: parseInt(e.target.value)})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>$1,000</span>
                        <span>$10,000</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Security Settings */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Card Security Settings
                  </h3>
                  <div className="space-y-1">
                    <ToggleSwitch
                      enabled={cardSettings.onlinePayments}
                      onChange={(enabled) => setCardSettings({...cardSettings, onlinePayments: enabled})}
                      label="Online Payments"
                      description="Allow card to be used for online transactions"
                    />
                    <ToggleSwitch
                      enabled={cardSettings.atmWithdrawals}
                      onChange={(enabled) => setCardSettings({...cardSettings, atmWithdrawals: enabled})}
                      label="ATM Withdrawals"
                      description="Enable cash withdrawals from ATMs"
                    />
                    <ToggleSwitch
                      enabled={cardSettings.internationalUsage}
                      onChange={(enabled) => setCardSettings({...cardSettings, internationalUsage: enabled})}
                      label="International Usage"
                      description="Allow card usage outside your home country"
                    />
                    <ToggleSwitch
                      enabled={cardSettings.transactionAlerts}
                      onChange={(enabled) => setCardSettings({...cardSettings, transactionAlerts: enabled})}
                      label="Transaction Alerts"
                      description="Get notified for every card transaction"
                    />
                  </div>
                </Card>

                {/* Category Limits */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Spending Limits</h3>
                  <div className="space-y-4">
                    {[
                      { category: 'Online Shopping', limit: 2000, icon: Smartphone },
                      { category: 'Restaurants', limit: 1000, icon: Coffee },
                      { category: 'Travel', limit: 3000, icon: MapPin },
                      { category: 'Entertainment', limit: 500, icon: PlayCircle }
                    ].map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <cat.icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">{cat.category}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">${cat.limit}/month</span>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}

            {/* Display Settings Tab */}
            {activeTab === 'display' && (
              <>
                {/* Appearance */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Appearance
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900 mb-3">Theme</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setDisplaySettings({...displaySettings, darkMode: false})}
                          className={`p-4 border-2 rounded-lg flex items-center space-x-3 ${
                            !displaySettings.darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <Sun className="w-5 h-5" />
                          <span>Light Mode</span>
                        </button>
                        <button
                          onClick={() => setDisplaySettings({...displaySettings, darkMode: true})}
                          className={`p-4 border-2 rounded-lg flex items-center space-x-3 ${
                            displaySettings.darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <Moon className="w-5 h-5" />
                          <span>Dark Mode</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Localization */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Localization
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={displaySettings.language}
                        onChange={(e) => setDisplaySettings({...displaySettings, language: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="ko">한국어</option>
                        <option value="ja">日本語</option>
                        <option value="zh">中文</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <select
                        value={displaySettings.timezone}
                        onChange={(e) => setDisplaySettings({...displaySettings, timezone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Asia/Seoul">Seoul (GMT+9)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                        <option value="Europe/London">London (GMT+0)</option>
                        <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency Display</label>
                      <select
                        value={displaySettings.currency}
                        onChange={(e) => setDisplaySettings({...displaySettings, currency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="KRW">KRW (₩)</option>
                        <option value="BTC">BTC (₿)</option>
                        <option value="ETH">ETH (Ξ)</option>
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Privacy */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Privacy Settings
                  </h3>
                  <div className="space-y-1">
                    <ToggleSwitch
                      enabled={displaySettings.hideBalances}
                      onChange={(enabled) => setDisplaySettings({...displaySettings, hideBalances: enabled})}
                      label="Hide Balances by Default"
                      description="Mask wallet balances and amounts when app opens"
                    />
                  </div>
                </Card>
              </>
            )}

            {/* Help & Support Tab */}
            {activeTab === 'support' && (
              <>
                {/* User Support */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    User Support
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">FAQ</p>
                          <p className="text-sm text-gray-600">Frequently asked questions</p>
                        </div>
                      </div>
                    </button>

                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Contact Support</p>
                          <p className="text-sm text-gray-600">Get help from our team</p>
                        </div>
                      </div>
                    </button>

                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="flex items-center space-x-3">
                        <Bug className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="font-medium text-gray-900">Report Bug</p>
                          <p className="text-sm text-gray-600">Help us improve the app</p>
                        </div>
                      </div>
                    </button>

                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="flex items-center space-x-3">
                        <Lightbulb className="w-6 h-6 text-yellow-600" />
                        <div>
                          <p className="font-medium text-gray-900">Feature Request</p>
                          <p className="text-sm text-gray-600">Suggest new features</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </Card>

                {/* App Information */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    App Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Version</p>
                        <p className="text-sm text-gray-600">1.0.0 (Build 100)</p>
                      </div>
                      <Button variant="outline" size="sm" icon={RefreshCw}>
                        Check Update
                      </Button>
                    </div>

                    <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Terms of Service</p>
                          <p className="text-sm text-gray-600">Read our terms and conditions</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>

                    <button className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Privacy Policy</p>
                          <p className="text-sm text-gray-600">How we handle your data</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  </div>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200">
                  <h3 className="text-lg font-semibold text-red-900 mb-6 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Danger Zone
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-900">Logout</p>
                          <p className="text-sm text-red-700">Sign out of your account</p>
                        </div>
                        <Button 
                          onClick={logout}
                          variant="outline" 
                          className="border-red-300 text-red-700 hover:bg-red-100"
                          icon={LogOut}
                        >
                          Logout
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-900">Delete Account</p>
                          <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-red-500 text-red-700 hover:bg-red-100"
                          icon={AlertTriangle}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;