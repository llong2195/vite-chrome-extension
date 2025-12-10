import { useState, useEffect } from 'react';
import Button from './components/Button';
import Card from './components/Card';

interface ManifestType {
  name: string;
  version: string;
  description: string;
}

function App(): React.ReactElement {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [manifest, setManifest] = useState<ManifestType | null>(null);

  useEffect(() => {
    // Load manifest data
    const manifestData = chrome.runtime.getManifest();
    setManifest({
      name: manifestData.name,
      version: manifestData.version,
      description: manifestData.description || '',
    });

    // Detect system theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(prefersDark.matches ? 'dark' : 'light');

    // Listen for theme changes
    const handleThemeChange = (e: MediaQueryListEvent): void => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    prefersDark.addEventListener('change', handleThemeChange);

    return () => {
      prefersDark.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const handleThemeToggle = (): void => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // In a full implementation, this would update settings
  };

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

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Current Theme: {theme}
              </span>
              <Button onClick={handleThemeToggle} variant="primary" size="sm">
                Toggle Theme
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              Quick Start
            </h2>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>✅ Extension loaded successfully</li>
              <li>✅ React 18 + TypeScript</li>
              <li>✅ TailwindCSS styling</li>
              <li>✅ Hot module replacement ready</li>
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
