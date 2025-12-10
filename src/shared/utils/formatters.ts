/**
 * Utility functions for formatting data
 * Example utilities for common formatting needs in Chrome extensions
 */

/**
 * Format bytes to human-readable size
 * @example formatBytes(1024) // "1.00 KB"
 * @example formatBytes(1536, 0) // "2 KB"
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes < 0) return 'Invalid';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(dm)} ${sizes[i]}`;
}

/**
 * Format milliseconds to human-readable duration
 * @example formatDuration(1000) // "1s"
 * @example formatDuration(65000) // "1m 5s"
 * @example formatDuration(3665000) // "1h 1m 5s"
 */
export function formatDuration(ms: number): string {
  if (ms < 0) return 'Invalid';
  if (ms === 0) return '0s';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours % 24 > 0) parts.push(`${hours % 24}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);

  return parts.join(' ') || '0s';
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * @example formatRelativeTime(Date.now() - 3600000) // "1 hour ago"
 * @example formatRelativeTime(Date.now() + 86400000) // "in 1 day"
 */
export function formatRelativeTime(timestamp: number | Date): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.floor(Math.abs(diffMs) / 1000);

  const units: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];

  for (const [seconds, unit] of units) {
    const value = Math.floor(diffSecs / seconds);
    if (value >= 1) {
      const plural = value > 1 ? 's' : '';
      return diffMs < 0
        ? `${value} ${unit}${plural} ago`
        : `in ${value} ${unit}${plural}`;
    }
  }

  return 'just now';
}

/**
 * Format date to locale string with default options
 * @example formatDate(new Date()) // "Dec 10, 2025, 2:30 PM"
 */
export function formatDate(
  date: number | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = date instanceof Date ? date : new Date(date);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  };

  return d.toLocaleString(undefined, defaultOptions);
}

/**
 * Format number with thousands separator
 * @example formatNumber(1234567) // "1,234,567"
 * @example formatNumber(1234.56, 2) // "1,234.56"
 */
export function formatNumber(num: number, decimals?: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format percentage
 * @example formatPercent(0.1234) // "12.34%"
 * @example formatPercent(0.5, 0) // "50%"
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Truncate string to max length with ellipsis
 * @example truncate("Hello World", 8) // "Hello..."
 * @example truncate("Short", 10) // "Short"
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Format URL to display hostname only
 * @example formatUrl("https://www.example.com/path?query=1") // "example.com"
 */
export function formatUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Format storage key to human-readable label
 * @example formatStorageKey("user_settings") // "User Settings"
 * @example formatStorageKey("api-key") // "Api Key"
 */
export function formatStorageKey(key: string): string {
  return key
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format error message for display
 * Extracts meaningful error message from various error types
 * @example formatError(new Error("Failed")) // "Failed"
 * @example formatError("string error") // "string error"
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
}

/**
 * Format JSON with indentation for display
 * @example formatJson({ key: "value" }) // "{\n  \"key\": \"value\"\n}"
 */
export function formatJson(obj: unknown, indent = 2): string {
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    return String(obj);
  }
}

/**
 * Capitalize first letter of string
 * @example capitalize("hello world") // "Hello world"
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format array as comma-separated list with "and" before last item
 * @example formatList(["a", "b", "c"]) // "a, b, and c"
 * @example formatList(["a", "b"]) // "a and b"
 * @example formatList(["a"]) // "a"
 */
export function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  const last = items[items.length - 1];
  const rest = items.slice(0, -1);
  return `${rest.join(', ')}, and ${last}`;
}

/**
 * Format Chrome extension permission for display
 * @example formatPermission("tabs") // "Access your tabs"
 * @example formatPermission("storage") // "Store data"
 */
export function formatPermission(permission: string): string {
  const permissionLabels: Record<string, string> = {
    tabs: 'Access your tabs',
    storage: 'Store data',
    activeTab: 'Access the active tab',
    notifications: 'Display notifications',
    contextMenus: 'Add context menu items',
    webNavigation: 'Monitor navigation events',
    webRequest: 'Monitor and modify network requests',
    cookies: 'Access cookies',
    history: 'Access browsing history',
    bookmarks: 'Access bookmarks',
    downloads: 'Manage downloads',
    clipboardWrite: 'Write to clipboard',
    clipboardRead: 'Read from clipboard',
  };

  return permissionLabels[permission] || capitalize(permission);
}

/**
 * Format Chrome tab title for display (truncate long titles)
 * @example formatTabTitle("Very Long Page Title That Goes On Forever", 20) // "Very Long Page Ti..."
 */
export function formatTabTitle(title: string, maxLength = 40): string {
  return truncate(title, maxLength);
}

/**
 * Format storage size as percentage of quota
 * @example formatStorageUsage(50000, 100000) // "50% (48.83 KB / 97.66 KB)"
 */
export function formatStorageUsage(
  bytesInUse: number,
  quotaBytes: number,
): string {
  const percent = formatPercent(bytesInUse / quotaBytes, 0);
  const used = formatBytes(bytesInUse);
  const total = formatBytes(quotaBytes);
  return `${percent} (${used} / ${total})`;
}
