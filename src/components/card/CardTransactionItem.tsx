import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, Coffee, Fuel, ShoppingCart } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'purchase' | 'topup' | 'refund';
  merchant: string;
  category: 'shopping' | 'food' | 'transport' | 'entertainment' | 'other';
  amount: number;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
}

interface CardTransactionItemProps {
  transaction: Transaction;
}

export const CardTransactionItem: React.FC<CardTransactionItemProps> = ({ transaction }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shopping':
        return <ShoppingBag className="w-5 h-5" />;
      case 'food':
        return <Coffee className="w-5 h-5" />;
      case 'transport':
        return <Fuel className="w-5 h-5" />;
      default:
        return <ShoppingCart className="w-5 h-5" />;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'topup':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
      case 'refund':
        return <ArrowDownLeft className="w-4 h-4 text-blue-600" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'topup':
      case 'refund':
        return 'text-green-600';
      default:
        return 'text-gray-900';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg">
      <div className="flex items-center space-x-4">
        {/* Category Icon */}
        <div className="p-2 bg-gray-100 rounded-lg">
          {getCategoryIcon(transaction.category)}
        </div>
        
        {/* Transaction Details */}
        <div>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900">{transaction.merchant}</p>
            {getTransactionIcon(transaction.type)}
          </div>
          <p className="text-sm text-gray-500">
            {transaction.date} at {transaction.time}
          </p>
        </div>
      </div>

      {/* Amount and Status */}
      <div className="text-right">
        <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
          {transaction.type === 'topup' || transaction.type === 'refund' ? '+' : '-'}
          ${transaction.amount.toFixed(2)}
        </p>
        {getStatusBadge(transaction.status)}
      </div>
    </div>
  );
};