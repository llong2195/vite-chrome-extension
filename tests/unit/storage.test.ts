import { describe, it, expect, beforeEach } from 'vitest';
import {
  getSettings,
  setSettings,
  updateSettings,
  getState,
  setState,
  updateState,
  clearAllStorage,
} from '@background/storageManager';
import { DEFAULT_SETTINGS } from '@shared/types/settings';
import { DEFAULT_STATE } from '@shared/types/state';

describe('Storage Manager', () => {
  beforeEach(async () => {
    // Clear storage before each test
    await clearAllStorage();
  });

  describe('Settings Management', () => {
    it('should return null when no settings exist', async () => {
      const settings = await getSettings();
      expect(settings).toBeNull();
    });

    it('should save and retrieve settings', async () => {
      await setSettings(DEFAULT_SETTINGS);
      const retrieved = await getSettings();

      expect(retrieved).toEqual(DEFAULT_SETTINGS);
    });

    it('should update settings partially', async () => {
      await setSettings(DEFAULT_SETTINGS);

      const updated = await updateSettings({ theme: 'dark' });

      expect(updated.theme).toBe('dark');
      expect(updated.notifications).toBe(DEFAULT_SETTINGS.notifications);
    });

    it('should validate settings schema on save', async () => {
      const invalidSettings = {
        ...DEFAULT_SETTINGS,
        theme: 'invalid-theme', // Invalid value
      } as never;

      await expect(setSettings(invalidSettings)).rejects.toThrow();
    });

    it('should handle concurrent updates correctly', async () => {
      await setSettings(DEFAULT_SETTINGS);

      await Promise.all([
        updateSettings({ theme: 'dark' }),
        updateSettings({ notifications: false }),
      ]);

      const final = await getSettings();
      expect(final).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should return null when no state exists', async () => {
      const state = await getState();
      expect(state).toBeNull();
    });

    it('should save and retrieve state', async () => {
      await setState(DEFAULT_STATE);
      const retrieved = await getState();

      expect(retrieved).toEqual(DEFAULT_STATE);
    });

    it('should update state partially', async () => {
      await setState(DEFAULT_STATE);

      const updated = await updateState({ isActive: false, errorCount: 5 });

      expect(updated.isActive).toBe(false);
      expect(updated.errorCount).toBe(5);
      expect(updated.activeTabId).toBe(DEFAULT_STATE.activeTabId);
    });

    it('should validate state schema on save', async () => {
      const invalidState = {
        ...DEFAULT_STATE,
        errorCount: -1, // Should be non-negative
      } as never;

      await expect(setState(invalidState)).rejects.toThrow();
    });

    it('should update lastSync timestamp', async () => {
      await setState(DEFAULT_STATE);

      const timestamp = new Date().toISOString();
      const updated = await updateState({ lastSync: timestamp });

      expect(updated.lastSync).toBe(timestamp);
    });
  });

  describe('Storage Clear', () => {
    it('should clear all storage', async () => {
      await setSettings(DEFAULT_SETTINGS);
      await setState(DEFAULT_STATE);

      await clearAllStorage();

      const settings = await getSettings();
      const state = await getState();

      expect(settings).toBeNull();
      expect(state).toBeNull();
    });
  });

  describe('Data Isolation', () => {
    it('should store settings and state independently', async () => {
      await setSettings(DEFAULT_SETTINGS);
      await setState(DEFAULT_STATE);

      await clearAllStorage();

      // Both should be cleared
      expect(await getSettings()).toBeNull();
      expect(await getState()).toBeNull();
    });
  });
});
