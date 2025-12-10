/**
 * Custom hook for managing extension settings
 */

import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '@shared/types/settings';
import {
  createGetSettingsMessage,
  createUpdateSettingsMessage,
} from '@shared/utils/messageValidator';

interface UseSettingsResult {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<Settings>) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
}

export function useSettings(): UseSettingsResult {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings(): Promise<void> {
      try {
        const message = createGetSettingsMessage();
        const response = await chrome.runtime.sendMessage(message);

        if (response.success) {
          setSettings(response.data as Settings);
          setError(null);
        } else {
          setError(response.error || 'Failed to load settings');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = useCallback(
    async (updates: Partial<Settings>): Promise<boolean> => {
      try {
        const message = createUpdateSettingsMessage(updates);
        const response = await chrome.runtime.sendMessage(message);

        if (response.success) {
          setSettings(response.data as Settings);
          setError(null);
          return true;
        } else {
          setError(response.error || 'Failed to update settings');
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return false;
      }
    },
    [],
  );

  // Reset to defaults
  const resetSettings = useCallback(async (): Promise<boolean> => {
    try {
      const defaultSettings: Partial<Settings> = {
        theme: 'system',
        notifications: true,
        autoSync: false,
        language: 'en',
      };

      const message = createUpdateSettingsMessage(defaultSettings);
      const response = await chrome.runtime.sendMessage(message);

      if (response.success) {
        setSettings(response.data as Settings);
        setError(null);
        return true;
      } else {
        setError(response.error || 'Failed to reset settings');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    }
  }, []);

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
  };
}
