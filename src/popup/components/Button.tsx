import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
}) => {
  // Map our custom variants to shadcn variants
  const shadcnVariant = variant === 'primary' ? 'default' : 'secondary';

  // Map our sizes to shadcn sizes
  const shadcnSize = size === 'md' ? 'default' : size;

  return (
    <ShadcnButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant={shadcnVariant}
      size={shadcnSize}
      className={cn(fullWidth && 'w-full')}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
