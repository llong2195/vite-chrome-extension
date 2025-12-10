# Data Model: Vite Chrome Extension Template

**Feature**: 001-vite-extension-template  
**Date**: 2025-12-10  
**Status**: Complete

## Overview

This document defines the data models and entities used in the Chrome extension template. Since this is a template, these models serve as examples that developers can extend or replace based on their specific extension needs.

## Core Entities

### 1. Extension Settings

Represents user-configurable settings stored in chrome.storage.sync.

**Attributes**:

- `version`: number - Schema version for migrations (required)
- `theme`: 'light' | 'dark' | 'system' - User's theme preference
- `notifications`: boolean - Whether to show notifications
- `autoSync`: boolean - Whether to sync data across devices
- `language`: string - User's preferred language (i18n ready)

**Storage Location**: `chrome.storage.sync`

**Validation Schema** (Zod):

```typescript
import { z } from "zod";

export const SettingsSchema = z.object({
  version: z.number().int().positive().default(1),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  notifications: z.boolean().default(true),
  autoSync: z.boolean().default(true),
  language: z.string().default("en"),
});

export type Settings = z.infer<typeof SettingsSchema>;
```

**Default Values**:

```typescript
const DEFAULT_SETTINGS: Settings = {
  version: 1,
  theme: "system",
  notifications: true,
  autoSync: true,
  language: "en",
};
```

**Constraints**:

- chrome.storage.sync quota: 100KB total, 8KB per item
- Settings object must remain under 8KB when serialized

---

### 2. Extension State

Represents runtime state managed by the background service worker.

**Attributes**:

- `isActive`: boolean - Whether extension is currently active
- `lastSync`: Date | null - Timestamp of last sync operation
- `activeTabId`: number | null - Currently active tab ID
- `errorCount`: number - Count of errors since last reset

**Storage Location**: In-memory (service worker) + chrome.storage.local for persistence

**Validation Schema**:

```typescript
export const StateSchema = z.object({
  isActive: z.boolean().default(true),
  lastSync: z.string().datetime().nullable().default(null),
  activeTabId: z.number().int().positive().nullable().default(null),
  errorCount: z.number().int().nonnegative().default(0),
});

export type State = z.infer<typeof StateSchema>;
```

**Lifecycle**:

- Initialized when service worker starts
- Persisted to chrome.storage.local on state changes
- Restored from storage when service worker restarts after termination

---

### 3. Message

Represents messages passed between extension contexts (popup ↔ background ↔ content).

**Message Types**:

```typescript
// Base message structure
interface BaseMessage {
  id: string; // Unique message ID for tracking
  timestamp: number; // Unix timestamp
}

// Specific message types
type Message =
  | GetSettingsMessage
  | UpdateSettingsMessage
  | GetStateMessage
  | UpdateStateMessage
  | ExecuteActionMessage
  | NotifyMessage;

// Message type definitions
interface GetSettingsMessage extends BaseMessage {
  type: "GET_SETTINGS";
}

interface UpdateSettingsMessage extends BaseMessage {
  type: "UPDATE_SETTINGS";
  payload: Partial<Settings>;
}

interface GetStateMessage extends BaseMessage {
  type: "GET_STATE";
}

interface UpdateStateMessage extends BaseMessage {
  type: "UPDATE_STATE";
  payload: Partial<State>;
}

interface ExecuteActionMessage extends BaseMessage {
  type: "EXECUTE_ACTION";
  payload: {
    action: string;
    params?: Record<string, unknown>;
  };
}

interface NotifyMessage extends BaseMessage {
  type: "NOTIFY";
  payload: {
    level: "info" | "warning" | "error";
    message: string;
  };
}
```

**Validation Schema**:

```typescript
export const MessageSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().uuid(),
    timestamp: z.number().int().positive(),
    type: z.literal("GET_SETTINGS"),
  }),
  z.object({
    id: z.string().uuid(),
    timestamp: z.number().int().positive(),
    type: z.literal("UPDATE_SETTINGS"),
    payload: SettingsSchema.partial(),
  }),
  // ... other message types
]);

export type Message = z.infer<typeof MessageSchema>;
```

**Flow**:

1. Sender creates message with unique ID and timestamp
2. Sender calls `chrome.runtime.sendMessage(message)`
3. Receiver validates message against schema
4. Receiver processes message and sends response
5. Sender receives response (or timeout after 5s)

---

### 4. Tab Data

Represents data associated with a specific browser tab (managed by content scripts).

**Attributes**:

- `tabId`: number - Chrome tab ID
- `url`: string - Tab URL
- `title`: string - Page title
- `isProcessed`: boolean - Whether content script has processed the page
- `metadata`: Record<string, unknown> - Custom metadata extracted from page

**Storage Location**: In-memory (content script) + optionally in chrome.storage.local

**Validation Schema**:

```typescript
export const TabDataSchema = z.object({
  tabId: z.number().int().positive(),
  url: z.string().url(),
  title: z.string(),
  isProcessed: z.boolean().default(false),
  metadata: z.record(z.unknown()).default({}),
});

export type TabData = z.infer<typeof TabDataSchema>;
```

**Lifecycle**:

- Created when content script injected into new tab
- Updated as page content is analyzed
- Cleaned up when tab is closed or navigated away

---

## Relationships

```
┌─────────────────────┐
│  Extension Settings │
│  (chrome.storage)   │
└──────────┬──────────┘
           │
           │ read/write
           ▼
┌─────────────────────┐         ┌──────────────────┐
│  Background Worker  │◄────────┤  Popup UI        │
│  (Service Worker)   │ message │  (React App)     │
└──────────┬──────────┘ passing └──────────────────┘
           │
           │ message              ┌──────────────────┐
           │ passing              │  Options Page    │
           ├─────────────────────►│  (React App)     │
           │                      └──────────────────┘
           │
           │ message
           │ passing
           ▼
┌─────────────────────┐
│  Content Scripts    │
│  (injected in tabs) │
└─────────────────────┘
```

**Communication Flow**:

1. **Popup/Options → Background**: Request settings, trigger actions
2. **Background → Popup/Options**: Send settings, notify of state changes
3. **Content → Background**: Report page data, request actions
4. **Background → Content**: Send commands, update content script state

---

## State Transitions

### Settings Update Flow

```
User interacts with Options page
  ↓
Options page sends UPDATE_SETTINGS message
  ↓
Background worker receives message
  ↓
Background validates new settings (Zod)
  ↓
Background saves to chrome.storage.sync
  ↓
Background broadcasts SETTINGS_UPDATED to all contexts
  ↓
Popup/Content scripts update local state
```

### Extension Activation State

```
┌─────────┐  User clicks icon   ┌────────┐
│ Inactive│ ───────────────────►│ Active │
└─────────┘                     └────────┘
     ▲                               │
     │    User disables extension    │
     └───────────────────────────────┘
```

---

## Storage Schema Versioning

### Migration Strategy

When the storage schema changes between extension versions:

```typescript
interface StorageMigration {
  fromVersion: number;
  toVersion: number;
  migrate: (oldData: unknown) => unknown;
}

const migrations: StorageMigration[] = [
  {
    fromVersion: 1,
    toVersion: 2,
    migrate: (old: any) => ({
      ...old,
      newField: "default value",
      version: 2,
    }),
  },
];

async function migrateStorage(): Promise<void> {
  const data = await chrome.storage.sync.get();
  let current = data.version || 1;

  for (const migration of migrations) {
    if (current === migration.fromVersion) {
      const migrated = migration.migrate(data);
      await chrome.storage.sync.set(migrated);
      current = migration.toVersion;
    }
  }
}
```

### Version History

| Version | Changes                           | Migration Required |
| ------- | --------------------------------- | ------------------ |
| 1       | Initial schema (Settings + State) | N/A                |

---

## Validation Rules

### Settings Validation

1. **Theme**: Must be one of 'light', 'dark', 'system'
2. **Language**: Must be valid ISO 639-1 language code
3. **Version**: Must be positive integer
4. **Size**: Serialized settings must be <8KB (chrome.storage.sync limit)

### Message Validation

1. **ID**: Must be valid UUID v4
2. **Timestamp**: Must be positive integer (Unix timestamp in ms)
3. **Type**: Must be one of defined message types
4. **Payload**: Must match schema for message type

### State Validation

1. **Tab ID**: Must be positive integer (valid Chrome tab ID)
2. **Error count**: Must be non-negative integer
3. **Last sync**: Must be valid ISO 8601 datetime string or null

---

## Error Handling

### Storage Errors

```typescript
async function safeStorageGet<T>(
  key: string,
  schema: z.ZodSchema<T>,
  fallback: T
): Promise<T> {
  try {
    const result = await chrome.storage.sync.get(key);
    const validated = schema.parse(result[key]);
    return validated;
  } catch (error) {
    console.error("Storage read error:", error);
    return fallback;
  }
}
```

### Validation Errors

```typescript
function validateMessage(message: unknown): Message {
  const result = MessageSchema.safeParse(message);

  if (!result.success) {
    throw new ValidationError("Invalid message format", result.error.issues);
  }

  return result.data;
}
```

---

## Performance Considerations

### Storage Access Patterns

- **Read frequently, write infrequently**: Settings are cached in memory
- **Batch updates**: Multiple setting changes batched into single storage write
- **Lazy loading**: Don't load all storage data on extension start, load on demand

### Message Passing

- **Timeout handling**: All messages have 5s timeout
- **Response caching**: Frequently requested data cached in sender
- **Message queue**: Rate-limit messages to prevent overwhelming background worker

### Memory Management

- **Tab data cleanup**: Remove data for closed tabs immediately
- **Service worker storage**: Keep minimal state in service worker memory
- **Content script isolation**: Each content script instance independent

---

## Example Usage

### Reading Settings

```typescript
import { SettingsSchema, DEFAULT_SETTINGS } from "./shared/types";

async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.sync.get("settings");

  if (!result.settings) {
    return DEFAULT_SETTINGS;
  }

  return SettingsSchema.parse(result.settings);
}
```

### Sending Messages

```typescript
import { v4 as uuidv4 } from "uuid";

async function updateSettings(updates: Partial<Settings>): Promise<void> {
  const message: UpdateSettingsMessage = {
    id: uuidv4(),
    timestamp: Date.now(),
    type: "UPDATE_SETTINGS",
    payload: updates,
  };

  await chrome.runtime.sendMessage(message);
}
```

### Handling Messages

```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    const validated = validateMessage(message);

    switch (validated.type) {
      case "GET_SETTINGS":
        getSettings().then(sendResponse);
        return true; // Will respond asynchronously

      case "UPDATE_SETTINGS":
        updateSettings(validated.payload).then(() => {
          sendResponse({ success: true });
        });
        return true;

      default:
        sendResponse({ error: "Unknown message type" });
    }
  } catch (error) {
    sendResponse({ error: error.message });
  }
});
```

---

## Summary

This data model provides a foundation for Chrome extension development with:

- ✅ Type-safe data structures using TypeScript + Zod
- ✅ Clear separation of concerns (settings vs. state vs. messages)
- ✅ Schema versioning for backwards compatibility
- ✅ Validation at API boundaries
- ✅ Performance-conscious storage patterns
- ✅ Example code for common operations

Developers can extend these models or replace them entirely based on their extension's specific requirements.
