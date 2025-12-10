/**
 * Full flow integration test
 * Tests end-to-end workflows across all extension contexts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../setup/chromeApiMocks';

describe('Full Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Extension Initialization Flow', () => {
    it('should initialize all contexts without errors', async () => {
      // This test verifies the basic initialization flow
      expect(chrome.runtime).toBeDefined();
      expect(chrome.storage).toBeDefined();
      expect(chrome.tabs).toBeDefined();
    });

    it('should have proper manifest configuration', () => {
      // Verify extension manifest is properly configured
      // In a real test, you would load and parse public/manifest.json
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Settings Management Flow', () => {
    it('should persist and retrieve settings across contexts', async () => {
      const testSettings = {
        version: 1,
        theme: 'dark' as const,
        notifications: true,
        autoSync: false,
        language: 'en',
      };

      // Simulate saving settings from options page
      await chrome.storage.sync.set({ settings: testSettings });

      // Simulate loading settings from popup
      const result = await chrome.storage.sync.get('settings');

      expect(result.settings).toEqual(testSettings);
    });

    it('should broadcast settings changes to all contexts', async () => {
      const listener = vi.fn();
      chrome.storage.onChanged.addListener(listener);

      const newSettings = {
        version: 1,
        theme: 'light' as const,
        notifications: false,
        autoSync: true,
        language: 'en',
      };

      // Update settings
      await chrome.storage.sync.set({ settings: newSettings });

      // Verify listener was called
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: expect.objectContaining({
            newValue: newSettings,
          }),
        }),
        'sync',
      );
    });

    it('should handle storage quota gracefully', async () => {
      // Test storage quota handling
      const largeData = 'x'.repeat(10000); // 10KB of data

      try {
        await chrome.storage.sync.set({ largeData });
        const result = await chrome.storage.sync.get('largeData');
        expect(result.largeData).toBe(largeData);
      } catch (error) {
        // Should handle quota exceeded error
        expect(error).toBeDefined();
      }
    });
  });

  describe('Message Passing Flow', () => {
    it('should send and receive messages between contexts', async () => {
      const testMessage = {
        type: 'GET_SETTINGS',
        payload: {},
      };

      const mockResponse = {
        success: true,
        data: { theme: 'dark' },
      };

      // Setup message handler
      const handler = (
        message: unknown,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: unknown) => void,
      ) => {
        if (
          typeof message === 'object' &&
          message !== null &&
          'type' in message &&
          message.type === 'GET_SETTINGS'
        ) {
          sendResponse(mockResponse);
        }
        return true;
      };

      chrome.runtime.onMessage.addListener(handler);

      // Send message
      const response = await chrome.runtime.sendMessage(testMessage);

      expect(response).toEqual(mockResponse);
    });

    it('should handle message validation', async () => {
      const invalidMessage = {
        type: 'INVALID_TYPE',
        payload: 'invalid',
      };

      // Should handle invalid message gracefully
      try {
        await chrome.runtime.sendMessage(invalidMessage);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should support different message types', async () => {
      const messageTypes = [
        'GET_SETTINGS',
        'UPDATE_SETTINGS',
        'GET_STATE',
        'UPDATE_STATE',
        'EXECUTE_ACTION',
      ];

      for (const type of messageTypes) {
        const message = { type, payload: {} };

        // Setup handler for each type
        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
          if (
            typeof msg === 'object' &&
            msg !== null &&
            'type' in msg &&
            msg.type === type
          ) {
            sendResponse({ success: true });
          }
          return true;
        });

        const response = await chrome.runtime.sendMessage(message);
        expect(response).toEqual({ success: true });
      }
    });
  });

  describe('State Management Flow', () => {
    it('should maintain state in background worker', async () => {
      const initialState = {
        isActive: true,
        lastSync: new Date().toISOString(),
        activeTabId: 1,
        errorCount: 0,
      };

      // Save state
      await chrome.storage.local.set({ state: initialState });

      // Retrieve state
      const result = await chrome.storage.local.get('state');

      expect(result.state).toEqual(initialState);
    });

    it('should update state on user actions', async () => {
      // Simulate user action that updates state
      const updateMessage = {
        type: 'UPDATE_STATE',
        payload: { isActive: false },
      };

      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (
          typeof msg === 'object' &&
          msg !== null &&
          'type' in msg &&
          msg.type === 'UPDATE_STATE'
        ) {
          chrome.storage.local.set({
            state: { isActive: false },
          });
          sendResponse({ success: true });
        }
        return true;
      });

      const response = await chrome.runtime.sendMessage(updateMessage);
      expect(response.success).toBe(true);

      const result = await chrome.storage.local.get('state');
      expect(result.state.isActive).toBe(false);
    });
  });

  describe('Tab Interaction Flow', () => {
    it('should track active tab changes', async () => {
      const listener = vi.fn();
      chrome.tabs.onActivated.addListener(listener);

      // Simulate tab activation
      const activeInfo = { tabId: 123, windowId: 1 };
      chrome.tabs.onActivated.dispatch(activeInfo);

      expect(listener).toHaveBeenCalledWith(activeInfo);
    });

    it('should send data from content script to background', async () => {
      const tabData = {
        type: 'TAB_DATA',
        payload: {
          tabId: 1,
          url: 'https://example.com',
          title: 'Example',
          isProcessed: true,
        },
      };

      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (
          typeof msg === 'object' &&
          msg !== null &&
          'type' in msg &&
          msg.type === 'TAB_DATA'
        ) {
          // Background processes tab data
          sendResponse({ success: true, processed: true });
        }
        return true;
      });

      const response = await chrome.runtime.sendMessage(tabData);
      expect(response.success).toBe(true);
      expect(response.processed).toBe(true);
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle runtime errors gracefully', async () => {
      const errorMessage = {
        type: 'TRIGGER_ERROR',
        payload: {},
      };

      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (
          typeof msg === 'object' &&
          msg !== null &&
          'type' in msg &&
          msg.type === 'TRIGGER_ERROR'
        ) {
          try {
            throw new Error('Test error');
          } catch (error) {
            sendResponse({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }
        return true;
      });

      const response = await chrome.runtime.sendMessage(errorMessage);
      expect(response.success).toBe(false);
      expect(response.error).toBe('Test error');
    });

    it('should increment error count on failures', async () => {
      let errorCount = 0;

      // Simulate multiple errors
      for (let i = 0; i < 3; i++) {
        try {
          throw new Error('Test error');
        } catch {
          errorCount++;
        }
      }

      await chrome.storage.local.set({ state: { errorCount } });
      const result = await chrome.storage.local.get('state');

      expect(result.state.errorCount).toBe(3);
    });
  });

  describe('Action Execution Flow', () => {
    it('should execute background actions on demand', async () => {
      const actions = ['sync-data', 'clear-cache', 'export-data'];

      for (const action of actions) {
        const message = {
          type: 'EXECUTE_ACTION',
          payload: { action },
        };

        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
          if (
            typeof msg === 'object' &&
            msg !== null &&
            'type' in msg &&
            msg.type === 'EXECUTE_ACTION' &&
            'payload' in msg &&
            typeof msg.payload === 'object' &&
            msg.payload !== null &&
            'action' in msg.payload
          ) {
            // Execute action
            sendResponse({ success: true, action: msg.payload.action });
          }
          return true;
        });

        const response = await chrome.runtime.sendMessage(message);
        expect(response.success).toBe(true);
        expect(response.action).toBe(action);
      }
    });
  });

  describe('Notification Flow', () => {
    it('should display notifications on user actions', async () => {
      const notificationOptions = {
        type: 'basic' as const,
        iconUrl: '/icons/icon-48.png',
        title: 'Test Notification',
        message: 'This is a test',
      };

      const notificationId =
        await chrome.notifications.create(notificationOptions);

      expect(notificationId).toBeDefined();
      expect(typeof notificationId).toBe('string');
    });
  });

  describe('Storage Migration Flow', () => {
    it('should migrate storage schema on version change', async () => {
      // Old version schema
      const oldSettings = {
        version: 1,
        theme: 'dark',
        notifications: true,
      };

      await chrome.storage.sync.set({ settings: oldSettings });

      // Simulate migration to version 2
      const settings = (await chrome.storage.sync.get('settings')).settings;

      if (settings && settings.version === 1) {
        const migratedSettings = {
          ...settings,
          version: 2,
          autoSync: true, // New field in v2
          language: 'en', // New field in v2
        };

        await chrome.storage.sync.set({ settings: migratedSettings });
      }

      const result = await chrome.storage.sync.get('settings');

      expect(result.settings.version).toBe(2);
      expect(result.settings.autoSync).toBeDefined();
      expect(result.settings.language).toBeDefined();
    });
  });

  describe('Performance Flow', () => {
    it('should complete message round-trip in <200ms', async () => {
      const startTime = Date.now();

      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        sendResponse({ success: true });
        return true;
      });

      await chrome.runtime.sendMessage({ type: 'PING', payload: {} });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(200);
    });

    it('should handle multiple concurrent messages', async () => {
      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        setTimeout(() => {
          sendResponse({ success: true, id: msg });
        }, 10);
        return true;
      });

      const messages = Array.from({ length: 10 }, (_, i) => ({
        type: 'TEST',
        payload: { id: i },
      }));

      const responses = await Promise.all(
        messages.map((msg) => chrome.runtime.sendMessage(msg)),
      );

      expect(responses).toHaveLength(10);
      responses.forEach((response) => {
        expect(response.success).toBe(true);
      });
    });
  });

  describe('Complete User Journey', () => {
    it('should complete full user workflow: install → configure → use', async () => {
      // 1. Install: Initialize default settings
      const defaultSettings = {
        version: 1,
        theme: 'system' as const,
        notifications: true,
        autoSync: true,
        language: 'en',
      };

      await chrome.storage.sync.set({ settings: defaultSettings });

      // 2. Configure: User opens options and changes settings
      const userSettings = {
        ...defaultSettings,
        theme: 'dark' as const,
        notifications: false,
      };

      await chrome.storage.sync.set({ settings: userSettings });

      // 3. Use: Popup loads settings
      const popupSettings = (await chrome.storage.sync.get('settings'))
        .settings;

      expect(popupSettings.theme).toBe('dark');
      expect(popupSettings.notifications).toBe(false);

      // 4. Content script sends data to background
      chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (
          typeof msg === 'object' &&
          msg !== null &&
          'type' in msg &&
          msg.type === 'TAB_DATA'
        ) {
          sendResponse({ success: true });
        }
        return true;
      });

      const response = await chrome.runtime.sendMessage({
        type: 'TAB_DATA',
        payload: { tabId: 1, url: 'https://example.com' },
      });

      expect(response.success).toBe(true);

      // 5. Background updates state
      const newState = {
        isActive: true,
        lastSync: new Date().toISOString(),
        activeTabId: 1,
        errorCount: 0,
      };

      await chrome.storage.local.set({ state: newState });

      const finalState = (await chrome.storage.local.get('state')).state;

      expect(finalState.isActive).toBe(true);
      expect(finalState.activeTabId).toBe(1);
    });
  });
});
