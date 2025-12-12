/**
 * Theme selector component - using shadcn/ui select
 */

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ThemeSelectorProps {
  value: 'light' | 'dark' | 'system';
  onChange: (theme: 'light' | 'dark' | 'system') => void;
  disabled?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const themes: Array<{
    value: 'light' | 'dark' | 'system';
    label: string;
    description: string;
  }> = [
    {
      value: 'light',
      label: 'Light',
      description: 'Always use light theme',
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Always use dark theme',
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follow system preference',
    },
  ];

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.value} value={theme.value}>
              <div className="flex flex-col">
                <span className="font-medium">{theme.label}</span>
                <span className="text-xs text-muted-foreground">
                  {theme.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSelector;
