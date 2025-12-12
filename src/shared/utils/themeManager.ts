/**
 * Theme manager for applying theme classes to the DOM
 */

export type Theme = 'light' | 'dark' | 'system';

/**
 * Apply theme to the document root element
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const isDark = resolveTheme(theme);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Resolve the actual theme (light/dark) from theme setting
 */
export function resolveTheme(theme: Theme): boolean {
  if (theme === 'dark') {
    return true;
  }
  if (theme === 'light') {
    return false;
  }
  // System preference
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/**
 * Listen for system theme changes
 */
export function watchSystemTheme(
  callback: (isDark: boolean) => void,
): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  // Use addEventListener for modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }

  return () => {};
}
