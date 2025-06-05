import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Mail } from 'lucide-react';
import { Button, Card, Input } from '../components/ui';
import { useWeb3Auth } from '../providers/Web3AuthProvider';
import { useNavigate } from 'react-router-dom';
import { LoginProvider } from '../types/web3auth.types';

export const SigninPage: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const { login, isLoading } = useWeb3Auth();
  const navigate = useNavigate();

  const handleLogin = async (provider: LoginProvider) => {
    setError('');
    
    try {
      await login(provider);
      navigate('/dashboard');
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      setError(`Failed to login with ${provider}. Please try again.`);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    try {
      await login('email_passwordless');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Email login error:', error);
      setError('Failed to login with email. Please check your email for the magic link.');
    }
  };

  const handleWeb3AuthModal = async () => {
    setError('');
    try {
      await login('web3auth'); // 이렇게 하면 Web3Auth 모달이 열림
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Web3Auth modal error:', error);
      setError('Failed to open Web3Auth login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MineCore</h1>
          <p className="text-gray-600">Choose your preferred login method</p>
        </div>

        {/* Login Card */}
        <Card>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email Login Section */}
          <div className="mb-6">
            <Input
              label="Email (Passwordless)"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />
            <Button
              onClick={handleEmailLogin}
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full mt-2"
            >
              Send Magic Link
            </Button>
          </div>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {/* Google Login */}
            <Button
              variant="outline"
              onClick={() => handleLogin('google')}
              disabled={isLoading}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            
            {/* Facebook Login */}
            <Button
              variant="outline"
              onClick={() => handleLogin('facebook')}
              disabled={isLoading}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>

            {/* Twitter Login */}
            <Button
              variant="outline"
              onClick={() => handleLogin('twitter')}
              disabled={isLoading}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-3" fill="#1DA1F2" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Continue with Twitter
            </Button>

            {/* Discord Login */}
            <Button
              variant="outline"
              onClick={() => handleLogin('discord')}
              disabled={isLoading}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-3" fill="#5865F2" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Continue with Discord
            </Button>

            {/* Web3Auth Modal (All Options) */}
            <div className="pt-3 border-t border-gray-200">
              <Button
                onClick={handleWeb3AuthModal}
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Open Web3Auth Login Modal
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Includes all login methods above + more options
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">🔐 Secure Login</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• No passwords needed</li>
                <li>• Your keys, your control</li>
                <li>• Multi-factor authentication</li>
                <li>• Industry-leading security</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};