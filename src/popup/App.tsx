import { useState, useEffect } from 'react';
import Button from './components/Button';
import Card from './components/Card';
import type { Settings } from '@shared/types/settings';
import {
  createGetSettingsMessage,
  createUpdateSettingsMessage,
} from '@shared/utils/messageValidator';

interface ManifestType {
  name: string;
  version: string;
  description: string;
}

function App(): React.ReactElement {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [manifest, setManifest] = useState<ManifestType | null>(null);

  useEffect(() => {
    // Load manifest data
    const manifestData = chrome.runtime.getManifest();
    setManifest({
      name: manifestData.name,
      version: manifestData.version,
      description: manifestData.description || '',
    });

    // Load settings from background
    async function loadSettings(): Promise<void> {
      try {
        const message = createGetSettingsMessage();
        const response = await chrome.runtime.sendMessage(message);

        if (response.success) {
          setSettings(response.data as Settings);
        } else {
          console.error('Failed to load settings:', response.error);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleThemeToggle = async (): Promise<void> => {
    if (!settings) return;

    const newTheme =
      settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'system' : 'light';

    try {
      const message = createUpdateSettingsMessage({ theme: newTheme });
      const response = await chrome.runtime.sendMessage(message);

      if (response.success) {
        setSettings(response.data as Settings);
      } else {
        console.error('Failed to update theme:', response.error);
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  if (loading) {
    return (
      <div className="w-96 min-h-[400px] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Loading settings...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 min-h-[400px] p-4">
      <Card>
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {manifest?.name || 'Loading...'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Version {manifest?.version || '...'}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {manifest?.description || 'Loading...'}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Theme: {settings?.theme || 'system'}
                </span>
                <Button onClick={handleThemeToggle} variant="primary" size="sm">
                  Toggle Theme
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Notifications
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {settings?.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Auto Sync
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {settings?.autoSync ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Quick Start
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>✅ Extension loaded successfully</li>
              <li>✅ React 19 + TypeScript</li>
              <li>✅ TailwindCSS v4 styling</li>
              <li>✅ Settings loaded from storage</li>
            </ul>
          </div>

          <div className="pt-2">
            <Button onClick={() => chrome.runtime.openOptionsPage()} variant="secondary" fullWidth>
              Open Options
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default App;
