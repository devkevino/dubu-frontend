import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  Settings,
  Shield,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Lock,
  Unlock,
  Pause,
  Play,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Filter,
  Download,
  Smartphone,
  Package,
  Globe
} from 'lucide-react';
import { Card, StatsCard, Button, Input } from '../components/ui';
import { useWeb3Auth } from '../providers/Web3AuthProvider';

// 카드 타입 인터페이스
interface CryptoCard {
  id: string;
  type: 'virtual' | 'physical';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
  balance: number;
  currency: string;
  status: 'active' | 'locked' | 'pending' | 'expired';
  issueDate: string;
  lastUsed?: string;
  monthlySpent: number;
  monthlyLimit: number;
  cardNetwork: 'VISA' | 'MASTERCARD';
  cardDesign: string;
  isDefault: boolean;
}

// 거래 내역 인터페이스
interface Transaction {
  id: string;
  cardId: string;
  merchant: string;
  amount: number;
  currency: string;
  type: 'purchase' | 'refund' | 'topup' | 'fee';
  category: string;
  location?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  icon: string;
}

// 카드 충전 정보 인터페이스
interface TopUpInfo {
  dubuBalance: number;
  dubuPrice: number; // DUBU 현재 가격 (USD)
  minTopUpDubu: number;
  maxTopUpDubu: number;
  fee: number; // percentage
}

const CardPage: React.FC = () => {
  const { user, balance } = useWeb3Auth();
  const [selectedCard, setSelectedCard] = useState<string>('card-001');
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showCardSelector, setShowCardSelector] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 사용자의 등록된 카드들 (타입이 등록 시 결정됨)
  const cryptoCards: CryptoCard[] = [
    {
      id: 'card-001',
      type: 'virtual', // 등록 시 결정된 타입
      cardNumber: '4532 1234 5678 9012',
      expiryDate: '12/27',
      cvv: '123',
      holderName: user?.name || 'JOHN DOE',
      balance: 1250.45,
      currency: 'USDT',
      status: 'active',
      issueDate: '2024-01-15',
      lastUsed: '2024-01-05T14:30:00Z',
      monthlySpent: 450.20,
      monthlyLimit: 5000,
      cardNetwork: 'VISA',
      cardDesign: 'gradient-blue',
      isDefault: true
    },
    {
      id: 'card-002',
      type: 'virtual', // 등록 시 결정된 타입 (현재는 모두 virtual)
      cardNumber: '5432 9876 5432 1098',
      expiryDate: '08/26',
      cvv: '456',
      holderName: user?.name || 'JOHN DOE',
      balance: 750.80,
      currency: 'USDT',
      status: 'active',
      issueDate: '2023-12-01',
      lastUsed: '2024-01-03T09:15:00Z',
      monthlySpent: 220.15,
      monthlyLimit: 3000,
      cardNetwork: 'VISA',
      cardDesign: 'gradient-purple',
      isDefault: false
    },
    {
      id: 'card-003',
      type: 'virtual', // 등록 시 결정된 타입
      cardNumber: '4111 2233 4455 6677',
      expiryDate: '05/28',
      cvv: '789',
      holderName: user?.name || 'JOHN DOE',
      balance: 425.30,
      currency: 'USDT',
      status: 'active',
      issueDate: '2024-02-01',
      lastUsed: '2024-01-02T11:20:00Z',
      monthlySpent: 125.50,
      monthlyLimit: 2000,
      cardNetwork: 'VISA',
      cardDesign: 'gradient-green',
      isDefault: false
    }
  ];

  const transactions: Transaction[] = [
    {
      id: 'tx-001',
      cardId: 'card-001',
      merchant: 'Amazon',
      amount: -89.99,
      currency: 'USDT',
      type: 'purchase',
      category: 'Shopping',
      location: 'Online',
      date: '2024-01-05T14:30:00Z',
      status: 'completed',
      icon: '🛒'
    },
    {
      id: 'tx-002',
      cardId: 'card-001',
      merchant: 'Starbucks',
      amount: -15.75,
      currency: 'USDT',
      type: 'purchase',
      category: 'Food & Drink',
      location: 'New York, NY',
      date: '2024-01-05T08:45:00Z',
      status: 'completed',
      icon: '☕'
    },
    {
      id: 'tx-003',
      cardId: 'card-001',
      merchant: 'DUBU Wallet',
      amount: 500.00,
      currency: 'USDT',
      type: 'topup',
      category: 'Top Up',
      date: '2024-01-04T16:20:00Z',
      status: 'completed',
      icon: '💳'
    },
    {
      id: 'tx-004',
      cardId: 'card-002',
      merchant: 'Uber',
      amount: -25.40,
      currency: 'USDT',
      type: 'purchase',
      category: 'Transportation',
      location: 'Seoul, KR',
      date: '2024-01-03T19:30:00Z',
      status: 'completed',
      icon: '🚗'
    },
    {
      id: 'tx-005',
      cardId: 'card-003',
      merchant: 'Netflix',
      amount: -19.99,
      currency: 'USDT',
      type: 'purchase',
      category: 'Entertainment',
      location: 'Online',
      date: '2024-01-01T12:00:00Z',
      status: 'completed',
      icon: '🎬'
    },
    {
      id: 'tx-006',
      cardId: 'card-002',
      merchant: 'McDonald\'s',
      amount: -12.50,
      currency: 'USDT',
      type: 'purchase',
      category: 'Food & Drink',
      location: 'Seoul, KR',
      date: '2024-01-02T13:45:00Z',
      status: 'completed',
      icon: '🍔'
    }
  ];

  const topUpInfo: TopUpInfo = {
    dubuBalance: parseFloat(balance || '0') * 1000, // BNB를 DUBU로 가정 (1 BNB = 1000 DUBU)
    dubuPrice: 0.85, // 1 DUBU = 0.85 USD (추후 API에서 가져올 예정)
    minTopUpDubu: 10, // 최소 10 DUBU
    maxTopUpDubu: 10000, // 최대 10,000 DUBU
    fee: 1.5 // 1.5%
  };

  const currentCard = cryptoCards.find(card => card.id === selectedCard) || cryptoCards[0];
  const cardTransactions = transactions.filter(tx => tx.cardId === selectedCard);

  // 카드 정보 복사 함수
  const handleCopyField = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // 카드 충전 처리
  const handleTopUp = () => {
    const dubuAmount = parseFloat(topUpAmount);
    if (!dubuAmount || dubuAmount <= 0) return;

    // 최소/최대 한도 체크 (DUBU 기준)
    if (dubuAmount < topUpInfo.minTopUpDubu || dubuAmount > topUpInfo.maxTopUpDubu) {
      alert(`충전 가능 범위: ${topUpInfo.minTopUpDubu} - ${topUpInfo.maxTopUpDubu} DUBU`);
      return;
    }

    // DUBU를 USDT로 변환
    const usdtAmount = dubuAmount * topUpInfo.dubuPrice;
    
    // 수수료 계산 (USDT 기준)
    const feeAmount = usdtAmount * (topUpInfo.fee / 100);
    
    // 최종 충전될 금액 (수수료 제외)
    const finalChargeAmount = usdtAmount - feeAmount;

    // 잔고 확인
    if (dubuAmount > topUpInfo.dubuBalance) {
      alert('DUBU 잔고가 부족합니다.');
      return;
    }

    // 실제로는 블록체인 트랜잭션 실행
    console.log(`충전 요청:
      - DUBU 소모: ${dubuAmount} DUBU
      - 변환 금액: ${usdtAmount.toFixed(2)} USDT
      - 수수료: ${feeAmount.toFixed(2)} USDT
      - 최종 충전: ${finalChargeAmount.toFixed(2)} USDT`);
    
    setShowTopUpModal(false);
    setTopUpAmount('');
    // TODO: 실제 충전 로직 구현
  };

  // Max 버튼 클릭 처리
  const handleMaxAmount = () => {
    setTopUpAmount(Math.min(topUpInfo.dubuBalance, topUpInfo.maxTopUpDubu).toFixed(2));
  };

  // 카드 상태 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'locked': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // 카드 디자인 스타일
  const getCardDesign = (design: string) => {
    switch (design) {
      case 'gradient-blue':
        return 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700';
      case 'gradient-purple':
        return 'bg-gradient-to-br from-purple-600 via-purple-700 to-pink-700';
      case 'gradient-green':
        return 'bg-gradient-to-br from-green-600 via-green-700 to-teal-700';
      default:
        return 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800';
    }
  };

  // 통계 데이터
  const statsData = [
    {
      title: 'Total Balance',
      value: `${cryptoCards.reduce((sum, card) => sum + card.balance, 0).toFixed(2)} USDT`,
      change: '+2.5% from last month',
      changeType: 'positive' as const,
      icon: <Wallet className="w-6 h-6" />,
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      title: 'Monthly Spent',
      value: `${currentCard?.monthlySpent.toFixed(2) || '0'} USDT`,
      change: `${currentCard ? ((currentCard.monthlySpent / currentCard.monthlyLimit) * 100).toFixed(1) : '0'}% of limit`,
      changeType: 'neutral' as const,
      icon: <TrendingUp className="w-6 h-6" />,
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Active Cards',
      value: cryptoCards.filter(card => card.status === 'active').length.toString(),
      change: `${cryptoCards.length} total cards`,
      changeType: 'neutral' as const,
      icon: <CreditCard className="w-6 h-6" />,
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'DUBU Balance',
      value: `${topUpInfo.dubuBalance.toFixed(2)}`,
      change: `≈ ${(topUpInfo.dubuBalance * topUpInfo.dubuPrice).toFixed(2)}`,
      changeType: 'positive' as const,
      icon: <DollarSign className="w-6 h-6" />,
      iconColor: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="p-4 md:p-6">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Crypto Cards</h2>
              <p className="text-sm md:text-base text-gray-600">
                Manage your virtual and physical crypto cards for seamless payments.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowTopUpModal(true)}
                variant="outline"
                icon={Plus}
                className="hidden md:flex"
              >
                Top Up
              </Button>
              <Button
                variant="primary"
                icon={CreditCard}
                className="hidden md:flex"
              >
                Order Card
              </Button>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="md:hidden flex space-x-2 mb-4">
            <Button
              onClick={() => setShowTopUpModal(true)}
              variant="outline"
              icon={Plus}
              className="flex-1"
            >
              Top Up
            </Button>
            <Button
              variant="primary"
              icon={CreditCard}
              className="flex-1"
            >
              Order Card
            </Button>
          </div>
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

        {/* Current Card Display */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Current Card</h3>
              {currentCard && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium text-blue-600">{currentCard.type} Card</span> 
                  {currentCard.isDefault && <span className="text-yellow-600 ml-1">⭐ Default</span>}
                </p>
              )}
            </div>
            
            {/* Card Selector Button */}
            {cryptoCards.length > 1 && (
              <Button
                onClick={() => setShowCardSelector(true)}
                variant="outline"
                size="sm"
                icon={CreditCard}
              >
                Switch Card ({cryptoCards.length})
              </Button>
            )}
          </div>
          
          {/* Single Card Display */}
          {currentCard ? (
            <div className="max-w-sm mx-auto">
              {/* Card Visual */}
              <div className={`relative w-full h-48 rounded-xl shadow-lg ${getCardDesign(currentCard.cardDesign)} p-6 text-white overflow-hidden transition-shadow duration-300`}>
                {/* Card Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -ml-12 -mb-12"></div>
                
                {/* Card Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      {currentCard.type === 'virtual' ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Package className="w-4 h-4" />
                      )}
                      <span className="text-xs uppercase tracking-wide font-medium opacity-90">
                        {currentCard.type}
                      </span>
                      {currentCard.isDefault && (
                        <Star className="w-3 h-3 fill-current" />
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(currentCard.status)}`}>
                      {currentCard.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{currentCard.balance.toFixed(2)} USDT</p>
                    <p className="text-xs opacity-75">{currentCard.currency}</p>
                  </div>
                </div>
                
                {/* Card Number */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-mono tracking-wider">
                      {showCardDetails ? currentCard.cardNumber : currentCard.cardNumber.replace(/\d(?=\d{4})/g, '•')}
                    </p>
                    <button
                      onClick={() => handleCopyField('cardNumber', currentCard.cardNumber)}
                      className="text-white hover:text-yellow-200 transition-colors"
                      title="Copy Card Number"
                    >
                      {copiedField === 'cardNumber' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-75">CARDHOLDER</p>
                    <p className="text-sm font-medium">
                      {showCardDetails ? currentCard.holderName : '••••'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs opacity-75">EXPIRES</p>
                    <p className="text-sm font-medium">
                      {showCardDetails ? currentCard.expiryDate : '••/••'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs opacity-75">CVV</p>
                    <p className="text-sm font-medium">
                      {showCardDetails ? currentCard.cvv : '•••'}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-xl font-bold tracking-wider">{currentCard.cardNetwork}</span>
                  </div>
                </div>
              </div>
              
              {/* Card Actions */}
              <div className="flex justify-center space-x-3 mt-4">
                <Button
                  onClick={() => setShowTopUpModal(true)}
                  variant="primary"
                  size="sm"
                  icon={Plus}
                >
                  Top Up
                </Button>
                <Button
                  onClick={() => setShowCardDetails(!showCardDetails)}
                  variant="outline"
                  size="sm"
                  icon={showCardDetails ? EyeOff : Eye}
                >
                  {showCardDetails ? 'Hide' : 'Show'} Details
                </Button>
              </div>
            </div>
          ) : (
            // No Card Available
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Card Available</h3>
              <p className="text-gray-600 mb-6">
                Order your first crypto card to start making payments worldwide.
              </p>
              <Button variant="primary" icon={CreditCard}>
                Order Card
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Grid - Usage Overview and Transactions side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Overview */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Overview</h3>
            
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Monthly Spending</span>
                  <span className="font-medium">{currentCard.monthlySpent.toFixed(2)} / {currentCard.monthlyLimit.toFixed(2)} USDT</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentCard.monthlySpent / currentCard.monthlyLimit) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((currentCard.monthlySpent / currentCard.monthlyLimit) * 100).toFixed(1)}% of monthly limit
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-gray-600 text-sm">Issue Date</p>
                  <p className="font-medium">{new Date(currentCard.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Last Used</p>
                  <p className="font-medium">
                    {currentCard.lastUsed 
                      ? new Date(currentCard.lastUsed).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Transaction List */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" icon={Filter}>
                  Filter
                </Button>
                <Button variant="outline" size="sm" icon={Download}>
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {cardTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{transaction.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.merchant}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{transaction.category}</span>
                        {transaction.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {transaction.location}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toFixed(2)} USDT
                    </p>
                    <p className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </p>
                  </div>
                </div>
              ))}

              {cardTransactions.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start using your card to see transaction history</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Card Selector Modal */}
      {showCardSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Select Card</h3>
                <button
                  onClick={() => setShowCardSelector(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              {/* Cards List */}
              <div className="space-y-4 mb-6">
                {cryptoCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setSelectedCard(card.id);
                      setShowCardSelector(false);
                    }}
                    className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                      selectedCard === card.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Mini Card Visual */}
                        <div className={`w-16 h-10 rounded-lg ${getCardDesign(card.cardDesign)} p-2 flex items-center justify-center`}>
                          {card.type === 'virtual' ? (
                            <Smartphone className="w-4 h-4 text-white" />
                          ) : (
                            <Package className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        {/* Card Info */}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {card.type === 'virtual' ? 'Virtual' : 'Physical'} Card
                            </h4>
                            {card.isDefault && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(card.status)}`}>
                              {card.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 font-mono">
                            •••• •••• •••• {card.cardNumber.slice(-4)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires {card.expiryDate} • {card.cardNetwork}
                          </p>
                        </div>
                      </div>
                      
                      {/* Balance & Selection */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{card.balance.toFixed(2)} USDT</p>
                        <p className="text-sm text-gray-600">
                          {card.monthlySpent.toFixed(0)}/{card.monthlyLimit} monthly
                        </p>
                        {selectedCard === card.id && (
                          <div className="mt-2">
                            <CheckCircle className="w-5 h-5 text-blue-600 ml-auto" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add New Card Option */}
              <div className="border-t border-gray-200 pt-4">
                <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Order New Card</p>
                      <p className="text-sm text-gray-600">Get a new virtual or physical card</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Up Card</h3>
              <button
                onClick={() => {
                  setShowTopUpModal(false);
                  setTopUpAmount('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {/* DUBU Balance Display */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 font-medium">DUBU Balance</span>
                <span className="text-blue-900 font-bold">{topUpInfo.dubuBalance.toFixed(2)} DUBU</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Current Price: ${topUpInfo.dubuPrice} per DUBU
              </p>
            </div>
            
            {/* DUBU Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">DUBU Amount</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter DUBU amount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">DUBU</span>
                  <button
                    onClick={handleMaxAmount}
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                  >
                    MAX
                  </button>
                </div>
              </div>
              
              {/* Min/Max Info */}
              <p className="text-xs text-gray-500 mt-1">
                Min: {topUpInfo.minTopUpDubu} DUBU, Max: {topUpInfo.maxTopUpDubu} DUBU
              </p>
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Quick Select</p>
              <div className="grid grid-cols-4 gap-2">
                {[10, 100, 1000, 5000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTopUpAmount(amount.toString())}
                    className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    disabled={amount > topUpInfo.dubuBalance}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Calculation Summary */}
            {topUpAmount && parseFloat(topUpAmount) > 0 && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Charge Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">DUBU Amount:</span>
                    <span className="font-medium">{parseFloat(topUpAmount).toFixed(2)} DUBU</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Converted to USDT:</span>
                    <span className="font-medium">{(parseFloat(topUpAmount) * topUpInfo.dubuPrice).toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Fee ({topUpInfo.fee}%):</span>
                    <span>-{(parseFloat(topUpAmount) * topUpInfo.dubuPrice * (topUpInfo.fee / 100)).toFixed(2)} USDT</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between font-semibold text-green-600">
                      <span>Final Charge Amount:</span>
                      <span>
                        {(parseFloat(topUpAmount) * topUpInfo.dubuPrice * (1 - topUpInfo.fee / 100)).toFixed(2)} USDT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => {
                  setShowTopUpModal(false);
                  setTopUpAmount('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleTopUp}
                variant="primary"
                disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
              >
                Charge Card
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPage;