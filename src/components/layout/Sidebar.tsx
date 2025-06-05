import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  LayoutDashboard,
  Zap, 
  Users, 
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';
import { useWeb3Auth } from '../../providers/Web3AuthProvider';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive, 
  collapsed, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative
        ${isActive 
          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }
        ${collapsed ? 'justify-center' : 'justify-start'}
      `}
    >
      <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
      
      <span 
        className={`
          font-medium transition-all duration-300 overflow-hidden
          ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
        `}
      >
        {label}
      </span>

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-14 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isConnected, address } = useWeb3Auth();

  const handleLogout = async () => {
    try {
      console.log('🚪 Starting logout process...');
      console.log('📊 Current auth state before logout:', { isConnected, user });
      
      await logout();
      
      console.log('✅ Logout completed, redirecting...');
      console.log('🧹 localStorage after logout:', {
        isAuthenticated: localStorage.getItem('isAuthenticated'),
        userData: localStorage.getItem('userData'),
        loginProvider: localStorage.getItem('loginProvider')
      });
      
      // 로그아웃 후 명시적으로 signin 페이지로 이동
      window.location.href = '/signin';
    } catch (error) {
      console.error('❌ Logout error:', error);
      // 에러가 발생해도 일단 signin 페이지로 이동
      window.location.href = '/signin';
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: Zap,
      label: 'Earn',
      path: '/earn'
    },
    {
      icon: Users,
      label: 'Team',
      path: '/team'
    },
    {
      icon: Wallet,
      label: 'Wallet',
      path: '/wallet'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings'
    }
  ];

  return (
    <div 
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`flex items-center space-x-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">MineCore</h1>
              <p className="text-xs text-gray-500">Mining Platform</p>
            </div>
          )}
        </div>
        
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className={`
            p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors
            ${collapsed ? 'absolute -right-3 top-4 bg-white border border-gray-200 shadow-sm' : ''}
          `}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <MenuItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={location.pathname === item.path}
            collapsed={collapsed}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        {/* User Info */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} mb-3`}>
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
          )}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Anonymous User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'No email'}
              </p>
              {user?.typeOfLogin && (
                <p className="text-xs text-blue-600 truncate">
                  via {user.typeOfLogin}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Connection Status */}
        {!collapsed && (
          <div className="mb-3 px-2">
            <div className={`flex items-center justify-between text-xs`}>
              <div className={`flex items-center space-x-2 ${
                isConnected ? 'text-green-600' : 'text-gray-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              {address && (
                <div className="text-gray-500 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative
            ${collapsed ? 'justify-center' : 'justify-start'}
          `}
        >
          <LogOut className={`w-4 h-4 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
          
          <span 
            className={`
              transition-all duration-300 overflow-hidden
              ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
            `}
          >
            Logout
          </span>

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-12 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>

      {/* Mining Status Indicator (when collapsed) */}
      {collapsed && isConnected && (
        <div className="absolute bottom-20 left-2 right-2">
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto">
            <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;