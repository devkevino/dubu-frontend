import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const classes = `card ${paddingClasses[padding]} ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''} ${className}`;
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconColor?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconColor = 'bg-blue-100 text-blue-600',
}) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };
  
  return (
    <Card hover className="relative overflow-hidden" padding="sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
          <p className="text-lg md:text-2xl font-bold text-gray-900 mb-1 truncate">{value}</p>
          {change && (
            <p className={`text-xs md:text-sm font-medium truncate ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-2 md:p-3 rounded-lg flex-shrink-0 ml-2 ${iconColor}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};