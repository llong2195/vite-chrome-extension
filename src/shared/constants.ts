/**
 * Storage keys used for chrome.storage.sync and chrome.storage.local
 */
export const STORAGE_KEYS = {
  SETTINGS: 'extension_settings',
  STATE: 'extension_state',
} as const;

/**
 * Message timeout in milliseconds
 */
export const MESSAGE_TIMEOUT = 5000;

/**
 * Default theme based on system preference
 */
export const DEFAULT_THEME = 'system' as const;

/**
 * Maximum retries for failed operations
 */
export const MAX_RETRIES = 3;

/**
 * Extension version
 */
export const EXTENSION_VERSION = '1.0.0';
