/**
 * Chrome API mocks for testing
 * Provides mock implementations of chrome.* APIs used in tests
 */

import { beforeEach } from 'vitest';

// Mock chrome.storage API
const storageData: Record<string, Record<string, unknown>> = {
  sync: {},
  local: {},
};

export const mockChromeStorage = {
  sync: {
    get: async (keys?: string | string[] | null): Promise<Record<string, unknown>> => {
      if (!keys) return { ...storageData.sync };
      if (typeof keys === 'string') {
        return { [keys]: storageData.sync[keys] };
      }
      const result: Record<string, unknown> = {};
      keys.forEach((key) => {
        if (key in storageData.sync) {
          result[key] = storageData.sync[key];
        }
      });
      return result;
    },
    set: async (items: Record<string, unknown>): Promise<void> => {
      Object.assign(storageData.sync, items);
    },
    remove: async (keys: string | string[]): Promise<void> => {
      const keyArray = typeof keys === 'string' ? [keys] : keys;
      keyArray.forEach((key) => delete storageData.sync[key]);
    },
    clear: async (): Promise<void> => {
      storageData.sync = {};
    },
  },
  local: {
    get: async (keys?: string | string[] | null): Promise<Record<string, unknown>> => {
      if (!keys) return { ...storageData.local };
      if (typeof keys === 'string') {
        return { [keys]: storageData.local[keys] };
      }
      const result: Record<string, unknown> = {};
      keys.forEach((key) => {
        if (key in storageData.local) {
          result[key] = storageData.local[key];
        }
      });
      return result;
    },
    set: async (items: Record<string, unknown>): Promise<void> => {
      Object.assign(storageData.local, items);
    },
    remove: async (keys: string | string[]): Promise<void> => {
      const keyArray = typeof keys === 'string' ? [keys] : keys;
      keyArray.forEach((key) => delete storageData.local[key]);
    },
    clear: async (): Promise<void> => {
      storageData.local = {};
    },
  },
};

// Mock chrome.runtime API
const messageListeners: Array<
  (message: unknown, sender: unknown, sendResponse: (response: unknown) => void) => void
> = [];

export const mockChromeRuntime = {
  id: 'test-extension-id',
  sendMessage: async <T = unknown>(message: unknown): Promise<T> => {
    // Simulate message sending
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: null } as T);
      }, 0);
    });
  },
  onMessage: {
    addListener: (
      callback: (
        message: unknown,
        sender: unknown,
        sendResponse: (response: unknown) => void
      ) => void
    ): void => {
      messageListeners.push(callback);
    },
    removeListener: (
      callback: (
        message: unknown,
        sender: unknown,
        sendResponse: (response: unknown) => void
      ) => void
    ): void => {
      const index = messageListeners.indexOf(callback);
      if (index > -1) {
        messageListeners.splice(index, 1);
      }
    },
  },
  getURL: (path: string): string => {
    return `chrome-extension://test-extension-id/${path}`;
  },
};

// Mock chrome.tabs API
export const mockChromeTabs = {
  query: async (): Promise<chrome.tabs.Tab[]> => {
    return [
      {
        id: 1,
        url: 'https://example.com',
        title: 'Example',
        active: true,
        windowId: 1,
        index: 0,
        pinned: false,
        highlighted: false,
        incognito: false,
        selected: false,
        discarded: false,
        autoDiscardable: true,
        groupId: -1,
        frozen: false,
      },
    ];
  },
  getCurrent: async (): Promise<chrome.tabs.Tab> => {
    return {
      id: 1,
      url: 'https://example.com',
      title: 'Example',
      active: true,
      windowId: 1,
      index: 0,
      pinned: false,
      highlighted: false,
      incognito: false,
      selected: false,
      discarded: false,
      autoDiscardable: true,
      groupId: -1,
      frozen: false,
    };
  },
};

// Setup global chrome object for tests
(globalThis as unknown as { chrome: typeof chrome }).chrome = {
  storage: mockChromeStorage,
  runtime: mockChromeRuntime,
  tabs: mockChromeTabs,
} as unknown as typeof chrome;

// Reset function for tests
export function resetChromeMocks(): void {
  storageData.sync = {};
  storageData.local = {};
  messageListeners.length = 0;
}

// Run reset before each test
beforeEach(() => {
  resetChromeMocks();
});
