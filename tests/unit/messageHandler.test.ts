import { describe, it, expect, beforeEach } from 'vitest';
import { handleMessage } from '@background/messageHandler';
import { setSettings, setState, clearAllStorage } from '@background/storageManager';
import { createBaseMessage } from '@shared/utils/messageValidator';
import { DEFAULT_SETTINGS } from '@shared/types/settings';
import { DEFAULT_STATE } from '@shared/types/state';
import type {
  GetSettingsMessage,
  UpdateSettingsMessage,
  GetStateMessage,
} from '@shared/types/messages';

describe('Message Handler', () => {
  beforeEach(async () => {
    await clearAllStorage();
    await setSettings(DEFAULT_SETTINGS);
    await setState(DEFAULT_STATE);
  });

  describe('GET_SETTINGS', () => {
    it('should return settings', async () => {
      const message: GetSettingsMessage = {
        ...createBaseMessage(),
        type: 'GET_SETTINGS',
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(DEFAULT_SETTINGS);
    });

    it('should return default settings if none exist', async () => {
      await clearAllStorage();

      const message: GetSettingsMessage = {
        ...createBaseMessage(),
        type: 'GET_SETTINGS',
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('UPDATE_SETTINGS', () => {
    it('should update settings', async () => {
      const message: UpdateSettingsMessage = {
        ...createBaseMessage(),
        type: 'UPDATE_SETTINGS',
        payload: { theme: 'dark' },
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('theme', 'dark');
    });

    it('should merge with existing settings', async () => {
      const message: UpdateSettingsMessage = {
        ...createBaseMessage(),
        type: 'UPDATE_SETTINGS',
        payload: { notifications: false },
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      const data = response.data as typeof DEFAULT_SETTINGS;
      expect(data.notifications).toBe(false);
      expect(data.theme).toBe(DEFAULT_SETTINGS.theme);
    });
  });

  describe('GET_STATE', () => {
    it('should return state', async () => {
      const message: GetStateMessage = {
        ...createBaseMessage(),
        type: 'GET_STATE',
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(DEFAULT_STATE);
    });
  });

  describe('UPDATE_STATE', () => {
    it('should update state', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'UPDATE_STATE',
        payload: { isActive: false },
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('isActive', false);
    });

    it('should update errorCount', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'UPDATE_STATE',
        payload: { errorCount: 3 },
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('errorCount', 3);
    });
  });

  describe('EXECUTE_ACTION', () => {
    it('should handle sync-data action', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'EXECUTE_ACTION',
        payload: {
          action: 'sync-data',
          params: {},
        },
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('synced', true);
      expect(response.data).toHaveProperty('timestamp');
    });

    it('should handle clear-cache action', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'EXECUTE_ACTION',
        payload: {
          action: 'clear-cache',
        },
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('cleared', true);
    });

    it('should handle export-data action', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'EXECUTE_ACTION',
        payload: {
          action: 'export-data',
        },
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('settings');
      expect(response.data).toHaveProperty('state');
      expect(response.data).toHaveProperty('exportedAt');
    });

    it('should return error for unknown action', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'EXECUTE_ACTION',
        payload: {
          action: 'unknown-action',
        },
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(false);
      expect(response.error).toContain('Unknown action');
    });
  });

  describe('TAB_DATA', () => {
    it('should handle tab data message', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'TAB_DATA',
        payload: {
          tabId: 1,
          url: 'https://example.com',
          title: 'Test Page',
          isProcessed: true,
        },
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty('received', true);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid message structure', async () => {
      const invalidMessage = {
        type: 'GET_SETTINGS',
        // Missing id and timestamp
      };

      const response = await handleMessage(invalidMessage);

      expect(response.success).toBe(false);
      expect(response.error).toBeTruthy();
    });

    it('should handle unknown message type', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'UNKNOWN_TYPE',
      };

      const response = await handleMessage(message);

      expect(response.success).toBe(false);
      expect(response.error).toContain('Message validation failed');
    });
  });
});
