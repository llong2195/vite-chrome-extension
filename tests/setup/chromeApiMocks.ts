/**
 * Chrome API mocks for testing
 * Provides lightweight implementations of chrome.* APIs needed during Vitest runs
 */

import { beforeEach } from 'vitest';

type Listener<Args extends unknown[]> = (...args: Args) => void;

type StorageAreaName = 'sync' | 'local';

type TabActiveInfo = {
  tabId: number;
  windowId: number;
};

function createEmitter<Args extends unknown[]>() {
  const listeners: Array<Listener<Args>> = [];

  return {
    addListener(listener: Listener<Args>) {
      if (!listeners.includes(listener)) {
        listeners.push(listener);
      }
    },
    removeListener(listener: Listener<Args>) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    },
    hasListener(listener: Listener<Args>) {
      return listeners.includes(listener);
    },
    dispatch(...args: Args) {
      listeners.slice().forEach((listener) => listener(...args));
    },
    clear() {
      listeners.length = 0;
    },
    getListeners() {
      return listeners;
    },
  };
}

const storageData: Record<StorageAreaName, Record<string, unknown>> = {
  sync: {},
  local: {},
};

const storageOnChangedEmitter =
  createEmitter<
    [Record<string, chrome.storage.StorageChange>, StorageAreaName]
  >();

function createStorageArea(
  areaName: StorageAreaName,
): chrome.storage.StorageArea {
  const area = storageData[areaName];

  const get = async (
    keys?: string | string[] | null,
  ): Promise<Record<string, unknown>> => {
    if (!keys) {
      return { ...area };
    }

    if (typeof keys === 'string') {
      return { [keys]: area[keys] };
    }

    const result: Record<string, unknown> = {};
    keys.forEach((key) => {
      if (key in area) {
        result[key] = area[key];
      }
    });

    return result;
  };

  const set = async (items: Record<string, unknown>): Promise<void> => {
    const previous = { ...area };
    Object.assign(area, items);

    const changes = Object.fromEntries(
      Object.entries(items).map(([key, value]) => [
        key,
        {
          oldValue: previous[key],
          newValue: value,
        },
      ]),
    );

    storageOnChangedEmitter.dispatch(changes, areaName);
  };

  const remove = async (keys: string | string[]): Promise<void> => {
    const keyArray = typeof keys === 'string' ? [keys] : keys;
    const previous = { ...area };

    keyArray.forEach((key) => {
      if (key in area) {
        delete area[key];
      }
    });

    const changes = Object.fromEntries(
      keyArray.map((key) => [
        key,
        {
          oldValue: previous[key],
          newValue: undefined,
        },
      ]),
    );

    storageOnChangedEmitter.dispatch(changes, areaName);
  };

  const clear = async (): Promise<void> => {
    const previous = { ...area };

    Object.keys(area).forEach((key) => {
      delete area[key];
    });

    if (Object.keys(previous).length === 0) {
      return;
    }

    const changes = Object.fromEntries(
      Object.keys(previous).map((key) => [
        key,
        {
          oldValue: previous[key],
          newValue: undefined,
        },
      ]),
    );

    storageOnChangedEmitter.dispatch(changes, areaName);
  };

  return {
    get,
    set,
    remove,
    clear,
  } as unknown as chrome.storage.StorageArea;
}

export const mockChromeStorage = {
  sync: createStorageArea('sync'),
  local: createStorageArea('local'),
  onChanged: storageOnChangedEmitter,
};

const runtimeOnMessageEmitter =
  createEmitter<
    [unknown, chrome.runtime.MessageSender, (response: unknown) => void]
  >();
const runtimeOnInstalledEmitter =
  createEmitter<[chrome.runtime.InstalledDetails]>();
const runtimeOnStartupEmitter = createEmitter<[]>();

const runtimeSendMessage = <T = unknown>(message: unknown): Promise<T> => {
  const listeners = runtimeOnMessageEmitter.getListeners();

  if (listeners.length === 0) {
    const isValidMessage =
      typeof message === 'object' &&
      message !== null &&
      'id' in message &&
      typeof (message as Record<string, unknown>).id === 'string' &&
      'timestamp' in message &&
      typeof (message as Record<string, unknown>).timestamp === 'number';

    if (!isValidMessage) {
      return Promise.reject(new Error('Invalid message structure'));
    }

    return Promise.resolve({ success: true, data: null } as T);
  }

  return new Promise<T>((resolve, reject) => {
    let settled = false;

    const timeoutId = setTimeout(() => {
      if (settled) {
        return;
      }

      settled = true;
      reject(new Error('No runtime listener responded'));
    }, 100);

    const finalize = () => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeoutId);
    };

    const sendResponse = (response: unknown) => {
      if (settled) {
        return;
      }

      finalize();
      Promise.resolve(response as T)
        .then(resolve)
        .catch(reject);
    };

    try {
      listeners.forEach((listener) => {
        listener(message, {} as chrome.runtime.MessageSender, sendResponse);
      });
    } catch (error) {
      finalize();
      reject(error);
    }
  });
};

export const mockChromeRuntime = {
  id: 'test-extension-id',
  sendMessage: runtimeSendMessage,
  onMessage: runtimeOnMessageEmitter,
  onInstalled: runtimeOnInstalledEmitter,
  onStartup: runtimeOnStartupEmitter,
  getURL: (path: string): string =>
    `chrome-extension://test-extension-id/${path}`,
};
const tabsOnActivatedEmitter = createEmitter<[TabActiveInfo]>();

const defaultTab: chrome.tabs.Tab = {
  id: 1,
  windowId: 1,
  index: 0,
  active: true,
  highlighted: true,
  pinned: false,
  status: 'complete',
  incognito: false,
  discarded: false,
  url: 'https://example.com',
  title: 'Example',
  favIconUrl: '',
  autoDiscardable: true,
} as chrome.tabs.Tab;

export const mockChromeTabs = {
  query: async (): Promise<chrome.tabs.Tab[]> => [defaultTab],
  getCurrent: async (): Promise<chrome.tabs.Tab> => defaultTab,
  sendMessage: async <T = unknown>(
    _tabId: number,
    _message: unknown,
  ): Promise<T> => {
    void _tabId;
    void _message;
    return { success: true } as T;
  },
  onActivated: tabsOnActivatedEmitter,
};

const notificationStore: Record<
  string,
  chrome.notifications.NotificationOptions
> = {};
let notificationIdCounter = 0;

export const mockChromeNotifications = {
  create: async (options: chrome.notifications.NotificationOptions) => {
    const notificationId = `mock-notification-${++notificationIdCounter}`;
    notificationStore[notificationId] = options;
    return notificationId;
  },
  clear: async (notificationId: string) => {
    const existed = Boolean(notificationStore[notificationId]);
    delete notificationStore[notificationId];
    return existed;
  },
};
const alarmEmitter = createEmitter<[chrome.alarms.Alarm]>();
const scheduledAlarms = new Map<string, chrome.alarms.Alarm>();

export const mockChromeAlarms = {
  create: (name: string, alarmInfo: chrome.alarms.AlarmCreateInfo) => {
    const alarm: chrome.alarms.Alarm = {
      name,
      scheduledTime: Date.now(),
      periodInMinutes: alarmInfo.periodInMinutes,
      when: alarmInfo.when,
    } as chrome.alarms.Alarm;

    scheduledAlarms.set(name, alarm);

    setTimeout(() => {
      alarmEmitter.dispatch(alarm);
    }, 0);
  },
  clear: async (name?: string) => {
    if (name) {
      scheduledAlarms.delete(name);
    } else {
      scheduledAlarms.clear();
    }

    return true;
  },
  onAlarm: alarmEmitter,
};

const chromeMock = {
  runtime: mockChromeRuntime,
  storage: mockChromeStorage,
  tabs: mockChromeTabs,
  notifications: mockChromeNotifications,
  alarms: mockChromeAlarms,
} as unknown as typeof chrome;

Object.defineProperty(globalThis, 'chrome', {
  value: chromeMock,
  configurable: true,
  writable: true,
});

export function resetChromeMocks(): void {
  Object.keys(storageData.sync).forEach((key) => delete storageData.sync[key]);
  Object.keys(storageData.local).forEach(
    (key) => delete storageData.local[key],
  );
  storageOnChangedEmitter.clear();

  runtimeOnMessageEmitter.clear();
  runtimeOnInstalledEmitter.clear();
  runtimeOnStartupEmitter.clear();

  tabsOnActivatedEmitter.clear();
  alarmEmitter.clear();

  scheduledAlarms.clear();
  notificationIdCounter = 0;
  Object.keys(notificationStore).forEach((id) => delete notificationStore[id]);
}

beforeEach(() => {
  resetChromeMocks();
});
