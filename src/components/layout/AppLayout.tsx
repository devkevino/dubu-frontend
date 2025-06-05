import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileNavigation from './MobileNavigation';
import { useResponsive } from '../../hooks/useResponsive';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isMobile } = useResponsive();

  if (isMobile) {
    // Mobile Layout
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <MobileHeader />
        <main className="flex-1 overflow-auto pb-16">
          {children}
        </main>
        <MobileNavigation />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;