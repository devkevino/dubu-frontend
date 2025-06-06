import React from 'react';
import { Shield, Zap, Globe, Smartphone, Check } from 'lucide-react';
import { Button } from '../ui';

interface CardIntroSectionProps {
  onApply: () => void;
}

export const CardIntroSection: React.FC<CardIntroSectionProps> = ({ onApply }) => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Protected',
      description: 'Bank-level security with multi-factor authentication'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Transactions',
      description: 'Real-time crypto to fiat conversions'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Acceptance',
      description: 'Use anywhere Visa is accepted worldwide'
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Mobile First',
      description: 'Manage your card directly from the app'
    }
  ];

  const benefits = [
    'No annual fees',
    'Up to 5% cashback in crypto',
    'Free ATM withdrawals worldwide',
    'Virtual and physical card options',
    'Real-time spending notifications',
    'Freeze/unfreeze card instantly'
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          The Future of Spending is Here
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Experience seamless crypto spending with our next-generation MineCore Card. 
          Convert and spend your mining earnings instantly, anywhere in the world.
        </p>
        <Button onClick={onApply} size="lg" className="px-8">
          Apply for Your Card
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose MineCore Card?
            </h2>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Card Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-3xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex justify-between items-start mb-16">
                <div className="w-12 h-10 bg-yellow-400/80 rounded"></div>
                <span className="text-xl font-bold">MINECORE</span>
              </div>
              <div className="space-y-4">
                <p className="text-xl font-mono">•••• •••• •••• ••••</p>
                <div className="flex justify-between">
                  <span className="text-sm opacity-80">CARD HOLDER</span>
                  <span className="text-sm opacity-80">••/••</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gray-900 text-white rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Crypto Experience?
        </h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of miners who are already enjoying the freedom of spending their earnings anywhere, anytime.
        </p>
        <Button onClick={onApply} size="lg" variant="primary" className="bg-white text-gray-900 hover:bg-gray-100">
          Get Started Now
        </Button>
      </div>
    </div>
  );
};