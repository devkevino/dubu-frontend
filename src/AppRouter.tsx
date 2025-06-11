import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SigninPage } from './pages/SigninPage';
import DashboardPage from './pages/DashboardPage';
import EarnPage from './pages/EarnPage';
import TeamPage from './pages/TeamPage';
import WalletPage from './pages/WalletPage';
import CardPage from './pages/CardPage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './components/layout/AppLayout';
import { useWeb3Auth } from './providers/Web3AuthProvider';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, isLoading } = useWeb3Auth();
  
  // 로딩 중일 때는 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // 로그인되지 않았으면 signin 페이지로 리다이렉트
  return isConnected ? (
    <AppLayout>{children}</AppLayout>
  ) : (
    <Navigate to="/signin" replace />
  );
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, isLoading } = useWeb3Auth();
  
  // 로딩 중일 때는 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // 이미 로그인되어 있으면 대시보드로 리다이렉트
  return isConnected ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Public routes */}
      <Route 
        path="/signin" 
        element={
          <PublicRoute>
            <SigninPage />
          </PublicRoute>
        } 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/earn" 
        element={
          <ProtectedRoute>
            <EarnPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/team" 
        element={
          <ProtectedRoute>
            <TeamPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/wallet" 
        element={
          <ProtectedRoute>
            <WalletPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/card" 
        element={
          <ProtectedRoute>
            <CardPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* 404 Not Found */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-6">Page not found</p>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        } 
      />
    </Routes>
  );
};

export default AppRouter;