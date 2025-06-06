import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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
  const { isLoggedIn, isLoading } = useWeb3Auth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/signin', { state: { from: location } });
    }
  }, [isLoggedIn, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  const { isLoggedIn } = useWeb3Auth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect to dashboard if logged in and on signin page
    if (isLoggedIn && location.pathname === '/signin') {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from);
    }
  }, [isLoggedIn, location, navigate]);

  return (
    <Routes>
      <Route path="/signin" element={<SigninPage />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        
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
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;