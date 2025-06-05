import React from 'react';
import { 
  TrendingUp, 
  Bell, 
  HelpCircle, 
  User,
  ChevronDown
} from 'lucide-react';
import { useWeb3Auth } from '../../providers/Web3AuthProvider';
import { CURRENT_NETWORK } from '../../config/networks';

const MobileHeader: React.FC = () => {
  const { logout, user, isConnected, address, balance, chainId, networkName } = useWeb3Auth();

  const handleLogout = async () => {
    try {
      console.log('🚪 [Mobile] Starting logout process...');
      console.log('📊 [Mobile] Current auth state before logout:', { isConnected, user });
      
      await logout();
      
      console.log('✅ [Mobile] Logout completed, redirecting...');
      console.log('🧹 [Mobile] localStorage after logout:', {
        isAuthenticated: localStorage.getItem('isAuthenticated'),
        userData: localStorage.getItem('userData'),
        loginProvider: localStorage.getItem('loginProvider')
      });
      
      // 로그아웃 후 명시적으로 signin 페이지로 이동
      window.location.href = '/signin';
    } catch (error) {
      console.error('❌ [Mobile] Logout error:', error);
      // 에러가 발생해도 일단 signin 페이지로 이동
      window.location.href = '/signin';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">MineCore</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Help Button */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          
          {/* Notification Button */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* User Info Bar (Mobile) - Dynamic Network */}
      {isConnected && user && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between text-xs mb-1">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Connected</span>
              </div>
              {user.typeOfLogin && (
                <span className="text-blue-600">via {user.typeOfLogin}</span>
              )}
              <span className={`font-medium ${chainId === CURRENT_NETWORK.chainId ? 'text-green-600' : 'text-red-600'}`}>
                {networkName || 'Unknown Network'}
              </span>
            </div>
            <div className="text-gray-500 truncate max-w-32 ml-2">
              {user?.name || user?.email || 'Anonymous'}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              {address && (
                <div className="text-gray-500 font-mono">
                  {address.slice(0, 10)}...{address.slice(-8)}
                </div>
              )}
              <div className="text-gray-600">
                {balance ? `${parseFloat(balance).toFixed(3)} BNB` : '0 BNB'}
              </div>
              {chainId && (
                <div className="text-gray-500">
                  Chain: {chainId}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {chainId === CURRENT_NETWORK.chainId && CURRENT_NETWORK.faucetUrl ? (
                <button
                  onClick={() => window.open(CURRENT_NETWORK.faucetUrl, '_blank')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Faucet
                </button>
              ) : chainId ? (
                <span className="text-red-600 text-xs">Wrong Network</span>
              ) : null}
            </div>
          </div>
          
          {/* Network Status Indicator */}
          {chainId !== CURRENT_NETWORK.chainId && chainId && (
            <div className="mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              ⚠️ Please switch to {CURRENT_NETWORK.displayName} (Chain ID: {CURRENT_NETWORK.chainId})
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default MobileHeader;