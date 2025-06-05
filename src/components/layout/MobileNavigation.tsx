import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Zap, 
  Users, 
  Wallet
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon: Icon, 
  label, 
  isActive, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center py-2 px-3 transition-colors duration-200
        ${isActive 
          ? 'text-blue-600' 
          : 'text-gray-400 hover:text-gray-600'
        }
      `}
    >
      <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
      <span className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
        {label}
      </span>
      {isActive && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-b-lg"></div>
      )}
    </button>
  );
};

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <nav className="flex justify-around items-center px-2 py-1">
        {menuItems.map((item) => (
          <div key={item.path} className="relative flex-1 max-w-20">
            <NavItem
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          </div>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;