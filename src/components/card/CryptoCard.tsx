import React from 'react';
import { Wifi, CreditCard } from 'lucide-react';

interface CryptoCardProps {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  balance?: string;
  cardType?: 'visa' | 'mastercard';
  variant?: 'default' | 'gradient' | 'dark';
}

export const CryptoCard: React.FC<CryptoCardProps> = ({
  cardNumber = '•••• •••• •••• ••••',
  cardHolder = 'CARD HOLDER',
  expiryDate = '••/••',
  balance = '0.00',
  cardType = 'visa',
  variant = 'gradient'
}) => {
  const formatCardNumber = (number: string) => {
    if (number.includes('•')) return number;
    return number.replace(/(.{4})/g, '$1 ').trim();
  };

  const cardStyles = {
    default: 'bg-gray-800 text-white',
    gradient: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white',
    dark: 'bg-black text-white'
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className={`relative aspect-[1.586/1] rounded-2xl shadow-2xl p-6 md:p-8 ${cardStyles[variant]} transform transition-transform hover:scale-105`}>
        {/* Card Chip */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8">
          <div className="w-12 h-10 bg-yellow-400/80 rounded-md">
            <div className="grid grid-cols-3 gap-0.5 p-1">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-yellow-600/50 h-1.5 rounded-sm"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Contactless Payment Icon */}
        <div className="absolute top-6 right-6 md:top-8 md:right-8">
          <Wifi className="w-8 h-8 rotate-90 opacity-60" />
        </div>

        {/* Card Number */}
        <div className="absolute top-1/2 left-6 right-6 md:left-8 md:right-8 -translate-y-1/2">
          <p className="text-xl md:text-2xl font-mono tracking-wider">
            {formatCardNumber(cardNumber)}
          </p>
        </div>

        {/* Card Details */}
        <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-70 mb-1">Card Holder</p>
              <p className="text-sm md:text-base font-medium uppercase tracking-wide">{cardHolder}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70 mb-1">Expires</p>
              <p className="text-sm md:text-base font-medium">{expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Card Type Logo */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8">
          {cardType === 'visa' ? (
            <svg className="w-12 h-8" viewBox="0 0 48 32" fill="none">
              <path d="M19.5 20.5L22.5 11.5H25.5L22.5 20.5H19.5Z" fill="white"/>
              <path d="M35 11.3C34.3 11 33.2 10.7 31.9 10.7C28.9 10.7 26.8 12.3 26.8 14.5C26.8 16.1 28.2 17 29.3 17.5C30.4 18 30.8 18.3 30.8 18.8C30.8 19.5 30 19.8 29.2 19.8C27.8 19.8 27 19.6 25.6 19L25.1 18.8L24.6 21.6C25.6 22.1 27.4 22.5 29.3 22.5C32.5 22.5 34.5 20.9 34.5 18.5C34.5 17.2 33.8 16.2 32.2 15.4C31.3 14.9 30.7 14.6 30.7 14.1C30.7 13.6 31.3 13.1 32.4 13.1C33.3 13.1 34 13.3 34.6 13.5L34.9 13.6L35.4 11Z" fill="white"/>
              <path d="M40.5 11.5C39.6 11.5 38.9 11.5 38.5 12.3L33.8 20.5H37L37.6 19H41.4L41.7 20.5H44.5L42 11.5H40.5ZM38.5 16.8L39.8 13.7L40.5 16.8H38.5Z" fill="white"/>
              <path d="M16.5 11.5L13.5 17.8L13.2 16.3C12.7 14.8 11.1 13.1 9.3 12.2L12 20.5H15.2L19.7 11.5H16.5Z" fill="white"/>
              <path d="M10 11.5H4.5L4.5 11.8C8.8 12.8 11.5 15.2 12.5 17.8L11.5 12.3C11.3 11.5 10.7 11.5 10 11.5Z" fill="#F9A825"/>
            </svg>
          ) : (
            <CreditCard className="w-12 h-8 opacity-80" />
          )}
        </div>

        {/* Balance Display */}
        <div className="absolute top-20 left-6 md:left-8">
          <p className="text-xs opacity-70">Balance</p>
          <p className="text-lg md:text-xl font-bold">${balance}</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};