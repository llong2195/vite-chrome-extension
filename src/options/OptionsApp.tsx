/**
 * Options page main component
 * Allows users to configure extension settings
 */

import React, { useState } from 'react';
import { useSettings } from './hooks/useSettings';
import ThemeSelector from './components/ThemeSelector';
import ToggleSwitch from './components/ToggleSwitch';
import Toast from './components/Toast';

const OptionsApp: React.FC = () => {
  const { settings, loading, error, updateSettings, resetSettings } = useSettings();
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' | 'info'): void => {
    setToast({ message, type });
  };

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system'): Promise<void> => {
    setIsSaving(true);
    const success = await updateSettings({ theme });
    setIsSaving(false);

    if (success) {
      showToast('Theme updated successfully', 'success');
    } else {
      showToast('Failed to update theme', 'error');
    }
  };

  const handleNotificationsChange = async (notifications: boolean): Promise<void> => {
    setIsSaving(true);
    const success = await updateSettings({ notifications });
    setIsSaving(false);

    if (success) {
      showToast(`Notifications ${notifications ? 'enabled' : 'disabled'}`, 'success');
    } else {
      showToast('Failed to update notifications', 'error');
    }
  };

  const handleAutoSyncChange = async (autoSync: boolean): Promise<void> => {
    setIsSaving(true);
    const success = await updateSettings({ autoSync });
    setIsSaving(false);

    if (success) {
      showToast(`Auto-sync ${autoSync ? 'enabled' : 'disabled'}`, 'success');
    } else {
      showToast('Failed to update auto-sync', 'error');
    }
  };

  const handleReset = async (): Promise<void> => {
    if (!confirm('Reset all settings to defaults? This cannot be undone.')) {
      return;
    }

    setIsSaving(true);
    const success = await resetSettings();
    setIsSaving(false);

    if (success) {
      showToast('Settings reset to defaults', 'success');
    } else {
      showToast('Failed to reset settings', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Loading settings...
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Please wait</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Error Loading Settings
            </h2>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Extension Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Configure your extension preferences and behavior
          </p>
        </div>

        {/* Settings Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Theme Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Appearance</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose how the extension looks
            </p>
            <ThemeSelector
              value={settings.theme}
              onChange={handleThemeChange}
              disabled={isSaving}
            />
          </div>

          {/* Notifications Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Notifications
            </h2>
            <ToggleSwitch
              label="Enable Notifications"
              description="Show notifications for important events and updates"
              checked={settings.notifications}
              onChange={handleNotificationsChange}
              disabled={isSaving}
            />
          </div>

          {/* Sync Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Synchronization
            </h2>
            <ToggleSwitch
              label="Auto-Sync"
              description="Automatically synchronize data in the background"
              checked={settings.autoSync}
              onChange={handleAutoSyncChange}
              disabled={isSaving}
            />
          </div>

          {/* About Section */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Reset Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Restore all settings to default values
                </p>
              </div>
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Settings are automatically saved and synced across your devices
          </p>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default OptionsApp;
