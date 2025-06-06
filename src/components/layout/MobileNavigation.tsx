import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Zap, 
  Users, 
  Wallet,
  CreditCard
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors w-full ${
      isActive 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    <Icon className="h-5 w-5 mb-1" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

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
      icon: CreditCard,
      label: 'Card',
      path: '/card'
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-20">
      <nav className="flex justify-around items-center px-2 py-1">
        {menuItems.map((item) => (
          <div key={item.path} className="relative flex-1 max-w-16">
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