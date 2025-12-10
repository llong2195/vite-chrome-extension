# Message Protocol Contract

**Feature**: 001-vite-extension-template  
**Version**: 1.0.0  
**Date**: 2025-12-10

## Overview

This document defines the message passing protocol used for communication between different Chrome extension contexts (popup, background, content scripts, options page). All messages follow a strict type-safe contract validated at runtime using Zod schemas.

## Message Architecture

### Communication Channels

```
┌──────────────┐
│  Popup Page  │────┐
└──────────────┘    │
                    │
┌──────────────┐    │    ┌─────────────────────┐
│ Options Page │────┼───►│ Background Worker   │
└──────────────┘    │    │ (Service Worker)    │
                    │    └─────────────────────┘
┌──────────────┐    │              │
│Content Script│────┘              │
│  (Tab 1)     │                   │
└──────────────┘                   │
                                   ▼
┌──────────────┐           chrome.storage API
│Content Script│
│  (Tab 2)     │
└──────────────┘
```

**Message Flow**:

- All contexts can send messages to background worker
- Background worker can send messages to specific tabs (content scripts)
- Background worker broadcasts messages to all contexts
- Popup/Options communicate with each other through background worker

---

## Base Message Structure

All messages MUST include these base fields:

```typescript
interface BaseMessage {
  id: string; // UUID v4 - unique message identifier
  timestamp: number; // Unix timestamp in milliseconds
  type: string; // Message type discriminator
}
```

**Validation**:

```typescript
const BaseMessageSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number().int().positive(),
  type: z.string(),
});
```

---

## Message Types

### 1. GET_SETTINGS

Request current extension settings from background worker.

**Direction**: Popup/Options/Content → Background

**Request**:

```typescript
interface GetSettingsMessage extends BaseMessage {
  type: "GET_SETTINGS";
}
```

**Response**:

```typescript
interface GetSettingsResponse {
  success: true;
  data: Settings;
}
```

**Example**:

```typescript
// Sender
const message: GetSettingsMessage = {
  id: crypto.randomUUID(),
  timestamp: Date.now(),
  type: "GET_SETTINGS",
};

const response = await chrome.runtime.sendMessage(message);
console.log("Settings:", response.data);
```

**Error Handling**:

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}
```

---

### 2. UPDATE_SETTINGS

Update one or more extension settings.

**Direction**: Popup/Options → Background

**Request**:

```typescript
interface UpdateSettingsMessage extends BaseMessage {
  type: "UPDATE_SETTINGS";
  payload: Partial<Settings>;
}
```

**Schema**:

```typescript
const UpdateSettingsMessageSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number().int().positive(),
  type: z.literal("UPDATE_SETTINGS"),
  payload: z.object({
    theme: z.enum(["light", "dark", "system"]).optional(),
    notifications: z.boolean().optional(),
    autoSync: z.boolean().optional(),
    language: z.string().optional(),
  }),
});
```

**Response**:

```typescript
interface UpdateSettingsResponse {
  success: true;
  data: Settings; // Updated settings
}
```

**Side Effects**:

- Background worker saves to chrome.storage.sync
- Background worker broadcasts SETTINGS_UPDATED to all contexts
- All listening contexts update their local state

**Example**:

```typescript
const message: UpdateSettingsMessage = {
  id: crypto.randomUUID(),
  timestamp: Date.now(),
  type: "UPDATE_SETTINGS",
  payload: {
    theme: "dark",
    notifications: false,
  },
};

const response = await chrome.runtime.sendMessage(message);
console.log("Updated settings:", response.data);
```

---

### 3. GET_STATE

Request current extension runtime state.

**Direction**: Popup/Options → Background

**Request**:

```typescript
interface GetStateMessage extends BaseMessage {
  type: "GET_STATE";
}
```

**Response**:

```typescript
interface GetStateResponse {
  success: true;
  data: State;
}
```

**Example**:

```typescript
const message: GetStateMessage = {
  id: crypto.randomUUID(),
  timestamp: Date.now(),
  type: "GET_STATE",
};

const response = await chrome.runtime.sendMessage(message);
console.log("Is active:", response.data.isActive);
```

---

### 4. UPDATE_STATE

Update extension runtime state.

**Direction**: Popup/Content → Background

**Request**:

```typescript
interface UpdateStateMessage extends BaseMessage {
  type: "UPDATE_STATE";
  payload: Partial<State>;
}
```

**Schema**:

```typescript
const UpdateStateMessageSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number().int().positive(),
  type: z.literal("UPDATE_STATE"),
  payload: z.object({
    isActive: z.boolean().optional(),
    lastSync: z.string().datetime().nullable().optional(),
    activeTabId: z.number().int().positive().nullable().optional(),
    errorCount: z.number().int().nonnegative().optional(),
  }),
});
```

**Response**:

```typescript
interface UpdateStateResponse {
  success: true;
  data: State; // Updated state
}
```

---

### 5. EXECUTE_ACTION

Execute a named action in the background worker.

**Direction**: Popup/Content → Background

**Request**:

```typescript
interface ExecuteActionMessage extends BaseMessage {
  type: "EXECUTE_ACTION";
  payload: {
    action: string;
    params?: Record<string, unknown>;
  };
}
```

**Schema**:

```typescript
const ExecuteActionMessageSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number().int().positive(),
  type: z.literal("EXECUTE_ACTION"),
  payload: z.object({
    action: z.string(),
    params: z.record(z.unknown()).optional(),
  }),
});
```

**Response**:

```typescript
interface ExecuteActionResponse {
  success: true;
  data?: unknown; // Action-specific result
}
```

**Supported Actions** (examples in template):

- `'sync-data'`: Trigger data synchronization
- `'clear-cache'`: Clear cached data
- `'export-data'`: Export user data
- `'reset-settings'`: Reset to default settings

**Example**:

```typescript
const message: ExecuteActionMessage = {
  id: crypto.randomUUID(),
  timestamp: Date.now(),
  type: "EXECUTE_ACTION",
  payload: {
    action: "sync-data",
    params: { force: true },
  },
};

const response = await chrome.runtime.sendMessage(message);
```

---

### 6. NOTIFY

Send notification message (one-way, no response expected).

**Direction**: Background → Popup/Content

**Message**:

```typescript
interface NotifyMessage extends BaseMessage {
  type: "NOTIFY";
  payload: {
    level: "info" | "warning" | "error";
    message: string;
    title?: string;
  };
}
```

**Schema**:

```typescript
const NotifyMessageSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number().int().positive(),
  type: z.literal("NOTIFY"),
  payload: z.object({
    level: z.enum(["info", "warning", "error"]),
    message: z.string(),
    title: z.string().optional(),
  }),
});
```

**Example**:

```typescript
// Background worker sending notification
chrome.tabs.query({}, (tabs) => {
  tabs.forEach((tab) => {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "NOTIFY",
        payload: {
          level: "info",
          message: "Data synchronized successfully",
        },
      });
    }
  });
});
```

---

### 7. SETTINGS_UPDATED (Broadcast)

Broadcast message sent when settings change.

**Direction**: Background → All contexts

**Message**:

```typescript
interface SettingsUpdatedMessage extends BaseMessage {
  type: "SETTINGS_UPDATED";
  payload: {
    settings: Settings;
    changedKeys: string[];
  };
}
```

**Example Listener**:

```typescript
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SETTINGS_UPDATED") {
    console.log("Settings changed:", message.payload.changedKeys);
    updateLocalState(message.payload.settings);
  }
});
```

---

### 8. TAB_DATA (Content → Background)

Content script reports page data to background.

**Direction**: Content → Background

**Request**:

```typescript
interface TabDataMessage extends BaseMessage {
  type: "TAB_DATA";
  payload: {
    url: string;
    title: string;
    metadata: Record<string, unknown>;
  };
}
```

**Response**:

```typescript
interface TabDataResponse {
  success: true;
}
```

---

## Message Validation

### Runtime Validation

All incoming messages MUST be validated using Zod schemas:

```typescript
import { z } from "zod";

// Union type of all message schemas
const MessageSchema = z.discriminatedUnion("type", [
  GetSettingsMessageSchema,
  UpdateSettingsMessageSchema,
  GetStateMessageSchema,
  UpdateStateMessageSchema,
  ExecuteActionMessageSchema,
  NotifyMessageSchema,
  SettingsUpdatedMessageSchema,
  TabDataMessageSchema,
]);

export type Message = z.infer<typeof MessageSchema>;

// Validation function
export function validateMessage(message: unknown): Message {
  const result = MessageSchema.safeParse(message);

  if (!result.success) {
    throw new MessageValidationError(
      "Invalid message format",
      result.error.issues
    );
  }

  return result.data;
}
```

### Error Responses

All errors follow this structure:

```typescript
interface ErrorResponse {
  success: false;
  error: string; // Human-readable error message
  code?: string; // Machine-readable error code
  details?: unknown; // Additional error details
}
```

**Error Codes**:

- `VALIDATION_ERROR`: Message failed schema validation
- `NOT_FOUND`: Requested resource not found
- `PERMISSION_DENIED`: Insufficient permissions
- `TIMEOUT`: Operation timed out
- `INTERNAL_ERROR`: Unexpected internal error

---

## Message Handler Pattern

### Background Worker Handler

```typescript
chrome.runtime.onMessage.addListener(
  (message: unknown, sender, sendResponse) => {
    (async () => {
      try {
        const validated = validateMessage(message);

        switch (validated.type) {
          case "GET_SETTINGS": {
            const settings = await getSettings();
            sendResponse({ success: true, data: settings });
            break;
          }

          case "UPDATE_SETTINGS": {
            const updated = await updateSettings(validated.payload);
            sendResponse({ success: true, data: updated });

            // Broadcast to all contexts
            broadcastSettingsUpdate(updated);
            break;
          }

          case "GET_STATE": {
            const state = await getState();
            sendResponse({ success: true, data: state });
            break;
          }

          case "EXECUTE_ACTION": {
            const result = await executeAction(
              validated.payload.action,
              validated.payload.params
            );
            sendResponse({ success: true, data: result });
            break;
          }

          default:
            sendResponse({
              success: false,
              error: "Unknown message type",
              code: "NOT_FOUND",
            });
        }
      } catch (error) {
        console.error("Message handler error:", error);
        sendResponse({
          success: false,
          error: error.message,
          code: "INTERNAL_ERROR",
        });
      }
    })();

    return true; // Will respond asynchronously
  }
);
```

### Popup/Content Sender

```typescript
async function sendMessage<T>(message: Message): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Message timeout after 5s"));
    }, 5000);

    chrome.runtime.sendMessage(message, (response) => {
      clearTimeout(timeout);

      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (!response.success) {
        reject(new Error(response.error || "Unknown error"));
        return;
      }

      resolve(response.data);
    });
  });
}

// Usage
try {
  const settings = await sendMessage<Settings>({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    type: "GET_SETTINGS",
  });
  console.log("Got settings:", settings);
} catch (error) {
  console.error("Failed to get settings:", error);
}
```

---

## Performance Considerations

### Message Batching

For multiple updates, batch into single message:

```typescript
// ❌ Bad: Multiple messages
await updateSettings({ theme: "dark" });
await updateSettings({ notifications: false });

// ✅ Good: Single batched message
await updateSettings({
  theme: "dark",
  notifications: false,
});
```

### Response Caching

Cache frequently accessed data:

```typescript
let settingsCache: Settings | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 5 seconds

async function getCachedSettings(): Promise<Settings> {
  const now = Date.now();

  if (settingsCache && now - cacheTimestamp < CACHE_TTL) {
    return settingsCache;
  }

  const settings = await sendMessage<Settings>({
    id: crypto.randomUUID(),
    timestamp: now,
    type: "GET_SETTINGS",
  });

  settingsCache = settings;
  cacheTimestamp = now;
  return settings;
}
```

### Message Deduplication

Prevent duplicate messages in flight:

```typescript
const pendingMessages = new Map<string, Promise<any>>();

async function sendMessageOnce<T>(key: string, message: Message): Promise<T> {
  if (pendingMessages.has(key)) {
    return pendingMessages.get(key)!;
  }

  const promise = sendMessage<T>(message).finally(() => {
    pendingMessages.delete(key);
  });

  pendingMessages.set(key, promise);
  return promise;
}
```

---

## Security Considerations

### Message Origin Validation

Always validate message sender:

```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Only accept messages from own extension
  if (sender.id !== chrome.runtime.id) {
    sendResponse({
      success: false,
      error: "Invalid sender",
      code: "PERMISSION_DENIED",
    });
    return;
  }

  // Handle message...
});
```

### Content Script Validation

When receiving messages from content scripts, validate tab context:

```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Content scripts must have valid tab information
  if (!sender.tab || !sender.tab.id) {
    sendResponse({
      success: false,
      error: "Invalid tab context",
      code: "PERMISSION_DENIED",
    });
    return;
  }

  // Validate tab URL if needed
  const url = sender.tab.url;
  if (!url || !isAllowedOrigin(url)) {
    sendResponse({
      success: false,
      error: "Not allowed on this page",
      code: "PERMISSION_DENIED",
    });
    return;
  }

  // Handle message...
});
```

---

## Testing

### Mock Message Passing

```typescript
import { vi } from "vitest";

// Mock chrome.runtime.sendMessage
vi.mock("chrome.runtime", () => ({
  sendMessage: vi.fn((message, callback) => {
    // Simulate async response
    setTimeout(() => {
      callback({ success: true, data: mockData });
    }, 10);
  }),
}));

// Test
const result = await sendMessage({
  id: crypto.randomUUID(),
  timestamp: Date.now(),
  type: "GET_SETTINGS",
});

expect(result).toEqual(mockData);
```

---

## Version Compatibility

This message protocol is version 1.0.0. Future versions will:

- Maintain backwards compatibility for existing messages
- Add new message types without breaking old ones
- Use version field in base message if breaking changes needed

---

## Summary

The message protocol provides:

- ✅ Type-safe communication between extension contexts
- ✅ Runtime validation using Zod schemas
- ✅ Consistent error handling
- ✅ Performance optimizations (caching, batching)
- ✅ Security validation
- ✅ Testable architecture

All extension contexts follow this contract for reliable cross-context communication.
