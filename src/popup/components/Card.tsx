import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  const classes = [
    'bg-white dark:bg-gray-800',
    'rounded-lg shadow-md',
    'border border-gray-200 dark:border-gray-700',
    paddingClasses[padding],
    className,
  ].join(' ');

  return <div className={classes}>{children}</div>;
};

export default Card;
