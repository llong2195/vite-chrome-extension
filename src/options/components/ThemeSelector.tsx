/**
 * Theme selector component - radio buttons for light/dark/system
 */

import React from 'react';

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
    <div className="space-y-3">
      {themes.map((theme) => (
        <label
          key={theme.value}
          className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
            value === theme.value
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            type="radio"
            name="theme"
            value={theme.value}
            checked={value === theme.value}
            onChange={(e) =>
              onChange(e.target.value as 'light' | 'dark' | 'system')
            }
            disabled={disabled}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-3 flex-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {theme.label}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {theme.description}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default ThemeSelector;
