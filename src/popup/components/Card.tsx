import React from 'react';
import { Card as ShadcnCard } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    none: 'py-0',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
  };

  return (
    <ShadcnCard className={cn(paddingClasses[padding], className)}>
      {children}
    </ShadcnCard>
  );
};

export default Card;
