import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface CardStatsWidgetProps {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  icon?: 'dollar' | 'activity' | 'trend';
}

export const CardStatsWidget: React.FC<CardStatsWidgetProps> = ({
  title,
  value,
  change,
  period = 'vs last month',
  icon = 'dollar'
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'activity':
        return <Activity className="w-5 h-5 text-purple-600" />;
      case 'trend':
        return change && change >= 0 ? 
          <TrendingUp className="w-5 h-5 text-green-600" /> : 
          <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="p-2 bg-gray-50 rounded-lg">
          {getIcon()}
        </div>
      </div>
      
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {change !== undefined && (
          <div className="flex items-center mt-2 text-sm">
            {change >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
              {Math.abs(change)}%
            </span>
            <span className="text-gray-500 ml-1">{period}</span>
          </div>
        )}
      </div>
    </div>
  );
};