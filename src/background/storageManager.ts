/**
 * Storage Manager for Background Service Worker
 * Manages chrome.storage operations with versioning and migration support
 */

import { STORAGE_KEYS } from '@shared/constants';
import { DEFAULT_SETTINGS, type Settings, SettingsSchema } from '@shared/types/settings';
import { DEFAULT_STATE, type State, StateSchema } from '@shared/types/state';

/**
 * Storage version for migration management
 */
const CURRENT_STORAGE_VERSION = 1;

/**
 * Initialize storage with default values if needed
 */
export async function initializeStorage(): Promise<void> {
  const settings = await getSettings();
  if (!settings) {
    await setSettings(DEFAULT_SETTINGS);
    console.log('Initialized default settings');
  }

  const state = await getState();
  if (!state) {
    await setState(DEFAULT_STATE);
    console.log('Initialized default state');
  }

  // Check and perform migrations if needed
  await performMigrations();
}

/**
 * Get settings from chrome.storage.sync
 */
export async function getSettings(): Promise<Settings | null> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS);
    const data = result[STORAGE_KEYS.SETTINGS];

    if (!data) return null;

    // Validate with Zod
    const validated = SettingsSchema.parse(data);
    return validated;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
}

/**
 * Set settings in chrome.storage.sync
 */
export async function setSettings(settings: Settings): Promise<void> {
  try {
    // Validate before saving
    const validated = SettingsSchema.parse(settings);
    await chrome.storage.sync.set({ [STORAGE_KEYS.SETTINGS]: validated });
  } catch (error) {
    console.error('Error setting settings:', error);
    throw error;
  }
}

/**
 * Update settings partially
 */
export async function updateSettings(partial: Partial<Settings>): Promise<Settings> {
  const current = (await getSettings()) || DEFAULT_SETTINGS;
  const updated = { ...current, ...partial };
  await setSettings(updated);
  return updated;
}

/**
 * Get state from chrome.storage.local
 */
export async function getState(): Promise<State | null> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.STATE);
    const data = result[STORAGE_KEYS.STATE];

    if (!data) return null;

    // Validate with Zod
    const validated = StateSchema.parse(data);
    return validated;
  } catch (error) {
    console.error('Error getting state:', error);
    return null;
  }
}

/**
 * Set state in chrome.storage.local
 */
export async function setState(state: State): Promise<void> {
  try {
    // Validate before saving
    const validated = StateSchema.parse(state);
    await chrome.storage.local.set({ [STORAGE_KEYS.STATE]: validated });
  } catch (error) {
    console.error('Error setting state:', error);
    throw error;
  }
}

/**
 * Update state partially
 */
export async function updateState(partial: Partial<State>): Promise<State> {
  const current = (await getState()) || DEFAULT_STATE;
  const updated = { ...current, ...partial };
  await setState(updated);
  return updated;
}

/**
 * Clear all storage
 */
export async function clearAllStorage(): Promise<void> {
  await chrome.storage.sync.clear();
  await chrome.storage.local.clear();
  console.log('All storage cleared');
}

/**
 * Get storage version
 */
async function getStorageVersion(): Promise<number> {
  const result = await chrome.storage.local.get('storage_version');
  return (result.storage_version as number) || 0;
}

/**
 * Set storage version
 */
async function setStorageVersion(version: number): Promise<void> {
  await chrome.storage.local.set({ storage_version: version });
}

/**
 * Perform storage migrations if needed
 */
async function performMigrations(): Promise<void> {
  const currentVersion = await getStorageVersion();

  if (currentVersion < CURRENT_STORAGE_VERSION) {
    console.log(`Migrating storage from v${currentVersion} to v${CURRENT_STORAGE_VERSION}`);

    // Perform migrations based on version
    if (currentVersion < 1) {
      await migrateToV1();
    }

    // Add more migrations here as needed
    // if (currentVersion < 2) {
    //   await migrateToV2();
    // }

    await setStorageVersion(CURRENT_STORAGE_VERSION);
    console.log('Storage migration complete');
  }
}

/**
 * Migrate to version 1
 */
async function migrateToV1(): Promise<void> {
  // Initial version - ensure all fields have default values
  const settings = await getSettings();
  if (settings) {
    const migratedSettings = { ...DEFAULT_SETTINGS, ...settings, version: 1 };
    await setSettings(migratedSettings);
  }

  const state = await getState();
  if (state) {
    const migratedState = { ...DEFAULT_STATE, ...state };
    await setState(migratedState);
  }

  console.log('Migrated to storage v1');
}

/**
 * Export all data for backup
 */
export async function exportAllData(): Promise<{
  settings: Settings | null;
  state: State | null;
  version: number;
  exportedAt: string;
}> {
  return {
    settings: await getSettings(),
    state: await getState(),
    version: CURRENT_STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Import data from backup (with validation)
 */
export async function importData(data: { settings?: Settings; state?: State }): Promise<void> {
  if (data.settings) {
    await setSettings(data.settings);
  }

  if (data.state) {
    await setState(data.state);
  }

  console.log('Data imported successfully');
}
