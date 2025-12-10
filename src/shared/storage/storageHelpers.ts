import { STORAGE_KEYS } from '../constants';
import type { Settings } from '../types/settings';
import type { State } from '../types/state';

/**
 * Get settings from chrome.storage.sync
 */
export async function getSettings(): Promise<Settings | null> {
  const result = await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS);
  return (result[STORAGE_KEYS.SETTINGS] as Settings) || null;
}

/**
 * Save settings to chrome.storage.sync
 */
export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEYS.SETTINGS]: settings });
}

/**
 * Update settings partially
 */
export async function updateSettings(partial: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const updated = { ...current, ...partial } as Settings;
  await saveSettings(updated as Settings);
  return updated;
}

/**
 * Get state from chrome.storage.local
 */
export async function getState(): Promise<State | null> {
  const result = await chrome.storage.local.get(STORAGE_KEYS.STATE);
  return (result[STORAGE_KEYS.STATE] as State) || null;
}

/**
 * Save state to chrome.storage.local
 */
export async function saveState(state: State): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.STATE]: state });
}

/**
 * Update state partially
 */
export async function updateState(partial: Partial<State>): Promise<State> {
  const current = await getState();
  const updated = { ...current, ...partial } as State;
  await saveState(updated);
  return updated;
}

/**
 * Clear all extension data
 */
export async function clearAllData(): Promise<void> {
  await chrome.storage.sync.clear();
  await chrome.storage.local.clear();
}
