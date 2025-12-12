/**
 * Toggle switch component for boolean settings
 */

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}) => {
  const id = `switch-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <label
          htmlFor={id}
          className={cn(
            'block font-medium text-foreground',
            disabled ? 'opacity-50' : 'cursor-pointer',
          )}
        >
          {label}
        </label>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
};

export default ToggleSwitch;
