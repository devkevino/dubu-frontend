import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  Copy,
  ExternalLink,
  Send,
  QrCode,
  RefreshCw,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  Minus,
  DollarSign,
  CreditCard,
  Shield,
  Info,
  Zap,
  Star
} from 'lucide-react';
import { Card, StatsCard, Button, Input } from '../components/ui';
import { NetworkSwitch, NetworkInfo } from '../components/ui/NetworkSwitch';
import { useWeb3Auth } from '../providers/Web3AuthProvider';
import { CURRENT_NETWORK } from '../config/networks';

// 토큰 정보 인터페이스
interface TokenInfo {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  change24h: number;
  decimals: number;
  contractAddress?: string;
  icon?: string;
}

// 거래 내역 인터페이스
interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'mining' | 'referral' | 'deposit' | 'withdrawal';
  amount: string;
  token: string;
  to?: string;
  from?: string;
  hash?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  fee?: string;
  usdValue?: string;
}

// 모달 타입
type ModalType = 'send' | 'receive' | 'history' | null;

const WalletPage: React.FC = () => {
  const { user, address, balance, chainId, networkName, isConnected, getBalance } = useWeb3Auth();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  // Send 모달 상태
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState('BNB');
  const [sendMemo, setSendMemo] = useState('');
  
  // 토큰 정보 (임시 데이터 - 실제로는 API에서 가져올 데이터)
  const [tokens, setTokens] = useState<TokenInfo[]>([
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      balance: balance || '0',
      usdValue: '0.00',
      change24h: 2.5,
      decimals: 18,
      icon: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png'
    },
    {
      symbol: 'DUBU',
      name: 'DUBU Coin',
      balance: '1,234.5678',
      usdValue: '456.78',
      change24h: -1.2,
      decimals: 18,
      contractAddress: '0x1234...5678',
      icon: '🪙'
    }
  ]);

  // 거래 내역 (임시 데이터)
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'mining',
      amount: '0.0245',
      token: 'BNB',
      timestamp: '2024-01-06T10:30:00Z',
      status: 'completed',
      description: 'Mining reward - 24h session',
      usdValue: '$8.50'
    },
    {
      id: '2',
      type: 'referral',
      amount: '125.0',
      token: 'DUBU',
      timestamp: '2024-01-06T09:15:00Z',
      status: 'completed',
      description: 'Referral bonus from Alice',
      usdValue: '$46.25'
    },
    {
      id: '3',
      type: 'send',
      amount: '0.1',
      token: 'BNB',
      to: '0x1234...5678',
      hash: '0xabcd...ef01',
      timestamp: '2024-01-05T16:45:00Z',
      status: 'completed',
      description: 'Transfer to external wallet',
      fee: '0.001',
      usdValue: '$34.50'
    },
    {
      id: '4',
      type: 'receive',
      amount: '50.0',
      token: 'DUBU',
      from: '0x8765...4321',
      hash: '0x5678...90ab',
      timestamp: '2024-01-05T14:20:00Z',
      status: 'completed',
      description: 'Received from Bob',
      usdValue: '$18.50'
    },
    {
      id: '5',
      type: 'deposit',
      amount: '0.5',
      token: 'BNB',
      hash: '0x9876...5432',
      timestamp: '2024-01-04T11:10:00Z',
      status: 'completed',
      description: 'Deposit from external wallet',
      usdValue: '$172.50'
    },
    {
      id: '6',
      type: 'withdrawal',
      amount: '200.0',
      token: 'DUBU',
      to: '0x2468...1357',
      hash: '0x1357...2468',
      timestamp: '2024-01-03T08:30:00Z',
      status: 'pending',
      description: 'Withdrawal to exchange',
      fee: '2.0',
      usdValue: '$74.00'
    }
  ]);

  // 발란스 새로고침
  const handleRefreshBalance = async () => {
    if (!isConnected) return;
    
    setIsRefreshing(true);
    try {
      const newBalance = await getBalance();
      setTokens(prev => prev.map(token => 
        token.symbol === 'BNB' 
          ? { ...token, balance: newBalance }
          : token
      ));
      
      // USD 가치 계산 (임시로 BNB = $350 가정)
      const bnbPrice = 350;
      const usdValue = (parseFloat(newBalance) * bnbPrice).toFixed(2);
      setTokens(prev => prev.map(token => 
        token.symbol === 'BNB' 
          ? { ...token, usdValue }
          : token
      ));
    } catch (error) {
      console.error('Balance refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 주소 복사
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // 전송 처리
  const handleSend = () => {
    // 실제 전송 로직 구현 필요
    console.log('Send transaction:', {
      amount: sendAmount,
      token: selectedToken,
      to: sendAddress,
      memo: sendMemo
    });
    
    // 모달 닫기 및 상태 초기화
    setActiveModal(null);
    setSendAmount('');
    setSendAddress('');
    setSendMemo('');
  };

  // 거래 타입별 아이콘 및 색상
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'send':
        return { icon: ArrowUpRight, color: 'text-red-600 bg-red-100' };
      case 'receive':
        return { icon: ArrowDownLeft, color: 'text-green-600 bg-green-100' };
      case 'mining':
        return { icon: Zap, color: 'text-blue-600 bg-blue-100' };
      case 'referral':
        return { icon: Star, color: 'text-purple-600 bg-purple-100' };
      case 'deposit':
        return { icon: Plus, color: 'text-green-600 bg-green-100' };
      case 'withdrawal':
        return { icon: Minus, color: 'text-orange-600 bg-orange-100' };
      default:
        return { icon: History, color: 'text-gray-600 bg-gray-100' };
    }
  };

  // 거래 상태 색상
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  // 총 포트폴리오 가치 계산
  const totalPortfolioValue = tokens.reduce((sum, token) => {
    return sum + parseFloat(token.usdValue);
  }, 0);

  const statsData = [
    {
      title: 'Portfolio Value',
      value: `$${totalPortfolioValue.toFixed(2)}`,
      change: '+$12.34 (2.1%)',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-6 h-6" />,
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      title: 'Total Tokens',
      value: tokens.length.toString(),
      change: `${tokens.filter(t => parseFloat(t.balance) > 0).length} with balance`,
      changeType: 'neutral' as const,
      icon: <Wallet className="w-6 h-6" />,
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Network',
      value: networkName || 'Unknown',
      change: `Chain ID: ${chainId}`,
      changeType: chainId === CURRENT_NETWORK.chainId ? 'positive' as const : 'negative' as const,
      icon: <Shield className="w-6 h-6" />,
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Last Updated',
      value: 'Just now',
      change: 'Auto-refresh enabled',
      changeType: 'neutral' as const,
      icon: <RefreshCw className="w-6 h-6" />,
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
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 flex items-center">
                <Wallet className="w-6 h-6 mr-3" />
                My Wallet
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Manage your digital assets and transaction history
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowBalance(!showBalance)}
                variant="outline"
                size="sm"
                icon={showBalance ? EyeOff : Eye}
                className="hidden md:flex"
              >
                {showBalance ? 'Hide' : 'Show'}
              </Button>
              <Button
                onClick={handleRefreshBalance}
                variant="outline"
                size="sm"
                icon={RefreshCw}
                loading={isRefreshing}
                disabled={!isConnected}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Mobile hide/show balance button */}
          <div className="md:hidden mb-4">
            <Button
              onClick={() => setShowBalance(!showBalance)}
              variant="outline"
              size="sm"
              icon={showBalance ? EyeOff : Eye}
              className="w-full"
            >
              {showBalance ? 'Hide Balance' : 'Show Balance'}
            </Button>
          </div>
        </div>

        {/* Network Status */}
        <NetworkSwitch />

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

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => setActiveModal('send')}
              variant="primary"
              className="flex-col h-20"
              disabled={!isConnected}
            >
              <Send className="w-6 h-6 mb-2" />
              Send
            </Button>
            <Button
              onClick={() => setActiveModal('receive')}
              variant="outline"
              className="flex-col h-20"
              disabled={!isConnected}
            >
              <QrCode className="w-6 h-6 mb-2" />
              Receive
            </Button>
            <Button
              onClick={() => setActiveModal('history')}
              variant="outline"
              className="flex-col h-20"
            >
              <History className="w-6 h-6 mb-2" />
              History
            </Button>
            <Button
              onClick={handleRefreshBalance}
              variant="outline"
              className="flex-col h-20"
              loading={isRefreshing}
              disabled={!isConnected}
            >
              <RefreshCw className="w-6 h-6 mb-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Token Balances */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Token Balances</h3>
          <div className="space-y-4">
            {tokens.map((token, index) => (
              <Card key={index} hover className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {token.icon ? (
                        typeof token.icon === 'string' && token.icon.startsWith('http') ? (
                          <img src={token.icon} alt={token.symbol} className="w-8 h-8 rounded-full" />
                        ) : (
                          <span className="text-2xl">{token.icon}</span>
                        )
                      ) : (
                        <CreditCard className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{token.name}</h4>
                      <p className="text-sm text-gray-600">{token.symbol}</p>
                      {token.contractAddress && (
                        <p className="text-xs text-gray-500 font-mono">
                          {token.contractAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {showBalance ? `${parseFloat(token.balance).toFixed(4)} ${token.symbol}` : '••••••'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {showBalance ? `$${token.usdValue}` : '••••'}
                    </p>
                    <div className={`flex items-center justify-end text-xs ${
                      token.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {token.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(token.change24h).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <Button
              onClick={() => setActiveModal('history')}
              variant="outline"
              size="sm"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => {
              const { icon: Icon, color } = getTransactionIcon(tx.type);
              return (
                <Card key={tx.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{tx.type}</p>
                        <p className="text-sm text-gray-600 truncate max-w-48">{tx.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                          <span className="text-xs text-gray-500">{formatTime(tx.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.type === 'send' || tx.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {tx.type === 'send' || tx.type === 'withdrawal' ? '-' : '+'}
                        {tx.amount} {tx.token}
                      </p>
                      {tx.usdValue && (
                        <p className="text-sm text-gray-600">{tx.usdValue}</p>
                      )}
                      {tx.hash && (
                        <button 
                          onClick={() => window.open(`${CURRENT_NETWORK.blockExplorer}/tx/${tx.hash}`, '_blank')}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          View
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Wallet Address Card */}
        {address && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Address</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Your Address</p>
                <p className="text-xs text-gray-600 font-mono truncate">{address}</p>
              </div>
              <Button
                onClick={handleCopyAddress}
                variant={copiedAddress ? "secondary" : "outline"}
                size="sm"
                icon={copiedAddress ? CheckCircle : Copy}
              >
                {copiedAddress ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Send Modal */}
      {activeModal === 'send' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Send Tokens</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Token Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol} - {parseFloat(token.balance).toFixed(4)} available
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount Input */}
              <Input
                label="Amount"
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
              />

              {/* Recipient Address */}
              <Input
                label="Recipient Address"
                placeholder="0x..."
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
              />

              {/* Memo (Optional) */}
              <Input
                label="Memo (Optional)"
                placeholder="Add a note..."
                value={sendMemo}
                onChange={(e) => setSendMemo(e.target.value)}
              />

              {/* Fee Estimate */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Estimated Fee:</span>
                  <span className="font-medium">~0.001 BNB ($0.35)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSend}
                  variant="primary"
                  className="flex-1"
                  disabled={!sendAmount || !sendAddress}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {activeModal === 'receive' && address && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Receive Tokens</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center">
              {/* QR Code Placeholder */}
              <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
              
              <p className="text-sm text-gray-600 mb-4">Send tokens to this address:</p>
              
              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <p className="text-xs font-mono text-gray-800 break-all">{address}</p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleCopyAddress}
                  variant={copiedAddress ? "secondary" : "outline"}
                  className="flex-1"
                  icon={copiedAddress ? CheckCircle : Copy}
                >
                  {copiedAddress ? 'Copied!' : 'Copy Address'}
                </Button>
                <Button
                  onClick={() => setActiveModal(null)}
                  variant="primary"
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-700">
                    Only send {CURRENT_NETWORK.displayName} compatible tokens to this address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Modal */}
      {activeModal === 'history' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {transactions.map((tx) => {
                  const { icon: Icon, color } = getTransactionIcon(tx.type);
                  return (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{tx.type}</p>
                          <p className="text-sm text-gray-600">{tx.description}</p>
                          <div className="flex items-center space-x-3 mt-1 text-xs">
                            <span className={`px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
                              {tx.status}
                            </span>
                            <span className="text-gray-500">{formatTime(tx.timestamp)}</span>
                            {tx.hash && (
                              <button 
                                onClick={() => window.open(`${CURRENT_NETWORK.blockExplorer}/tx/${tx.hash}`, '_blank')}
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                View <ExternalLink className="w-3 h-3 ml-1" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          tx.type === 'send' || tx.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {tx.type === 'send' || tx.type === 'withdrawal' ? '-' : '+'}
                          {tx.amount} {tx.token}
                        </p>
                        {tx.usdValue && (
                          <p className="text-sm text-gray-600">{tx.usdValue}</p>
                        )}
                        {tx.fee && (
                          <p className="text-xs text-gray-500">Fee: {tx.fee} {tx.token}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;