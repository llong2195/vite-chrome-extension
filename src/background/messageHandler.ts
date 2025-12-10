/**
 * Message Handler for Background Service Worker
 * Handles all incoming messages from popup, content scripts, and options page
 */

import {
  validateMessage,
  createSuccessResponse,
  createErrorResponse,
} from '@shared/utils/messageValidator';
import {
  getSettings,
  saveSettings,
  getState,
  saveState,
} from '@shared/storage/storageHelpers';
import { DEFAULT_SETTINGS } from '@shared/types/settings';
import { DEFAULT_STATE } from '@shared/types/state';
import type { Message, MessageResponse } from '@shared/types/messages';

/**
 * Main message handler - routes messages to appropriate handlers
 */
export async function handleMessage(
  message: unknown,
): Promise<MessageResponse> {
  try {
    // Validate message structure
    const validatedMessage = validateMessage(message);

    // Route to appropriate handler
    switch (validatedMessage.type) {
      case 'GET_SETTINGS':
        return await handleGetSettings();

      case 'UPDATE_SETTINGS':
        return await handleUpdateSettings(validatedMessage);

      case 'GET_STATE':
        return await handleGetState();

      case 'UPDATE_STATE':
        return await handleUpdateState(validatedMessage);

      case 'EXECUTE_ACTION':
        return await handleExecuteAction(validatedMessage);

      case 'TAB_DATA':
        return await handleTabData(validatedMessage);

      case 'NOTIFY':
        return await handleNotify(validatedMessage);

      default:
        return createErrorResponse(
          `Unknown message type: ${(validatedMessage as Message).type}`,
        );
    }
  } catch (error) {
    console.error('Message handling error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Unknown error occurred',
    );
  }
}

/**
 * Handle GET_SETTINGS message
 */
async function handleGetSettings(): Promise<MessageResponse> {
  const settings = await getSettings();
  return createSuccessResponse(settings || DEFAULT_SETTINGS);
}

/**
 * Handle UPDATE_SETTINGS message
 */
async function handleUpdateSettings(
  message: Message,
): Promise<MessageResponse> {
  if (message.type !== 'UPDATE_SETTINGS') {
    return createErrorResponse('Invalid message type');
  }

  const currentSettings = (await getSettings()) || DEFAULT_SETTINGS;
  const updatedSettings = { ...currentSettings, ...message.payload };

  await saveSettings(updatedSettings);

  // Broadcast settings update to all contexts
  await broadcastSettingsUpdate(updatedSettings);

  return createSuccessResponse(updatedSettings);
}

/**
 * Handle GET_STATE message
 */
async function handleGetState(): Promise<MessageResponse> {
  const state = await getState();
  return createSuccessResponse(state || DEFAULT_STATE);
}

/**
 * Handle UPDATE_STATE message
 */
async function handleUpdateState(message: Message): Promise<MessageResponse> {
  if (message.type !== 'UPDATE_STATE') {
    return createErrorResponse('Invalid message type');
  }

  const currentState = (await getState()) || DEFAULT_STATE;
  const updatedState = { ...currentState, ...message.payload };

  await saveState(updatedState);

  return createSuccessResponse(updatedState);
}

/**
 * Handle EXECUTE_ACTION message
 */
async function handleExecuteAction(message: Message): Promise<MessageResponse> {
  if (message.type !== 'EXECUTE_ACTION') {
    return createErrorResponse('Invalid message type');
  }

  const { action, params } = message.payload;

  switch (action) {
    case 'sync-data':
      return await performSyncData(params);

    case 'clear-cache':
      return await performClearCache();

    case 'export-data':
      return await performExportData();

    default:
      return createErrorResponse(`Unknown action: ${action}`);
  }
}

/**
 * Handle TAB_DATA message
 */
async function handleTabData(message: Message): Promise<MessageResponse> {
  if (message.type !== 'TAB_DATA') {
    return createErrorResponse('Invalid message type');
  }

  console.log('Received tab data:', message.payload);

  // Store tab data or process as needed
  // In a real extension, you might save this to storage or process it

  return createSuccessResponse({ received: true });
}

/**
 * Handle NOTIFY message
 */
async function handleNotify(message: Message): Promise<MessageResponse> {
  if (message.type !== 'NOTIFY') {
    return createErrorResponse('Invalid message type');
  }

  const { level, message: notificationMessage } = message.payload;
  console.log(`[${level.toUpperCase()}]`, notificationMessage);

  return createSuccessResponse({ notified: true });
}

/**
 * Broadcast settings update to all tabs
 */
async function broadcastSettingsUpdate(settings: unknown): Promise<void> {
  const tabs = await chrome.tabs.query({});

  tabs.forEach((tab) => {
    if (tab.id) {
      chrome.tabs
        .sendMessage(tab.id, {
          type: 'SETTINGS_UPDATED',
          payload: settings,
        })
        .catch(() => {
          // Ignore errors for tabs that don't have content scripts
        });
    }
  });
}

/**
 * Action handlers
 */
async function performSyncData(
  params?: Record<string, unknown>,
): Promise<MessageResponse> {
  // Implement sync logic
  console.log('Syncing data with params:', params);
  const state = await getState();
  const updatedState = {
    ...state,
    lastSync: new Date().toISOString(),
  } as {
    isActive: boolean;
    lastSync: string | null;
    activeTabId: number | null;
    errorCount: number;
  };
  await saveState(updatedState);

  return createSuccessResponse({
    synced: true,
    timestamp: updatedState.lastSync,
  });
}

async function performClearCache(): Promise<MessageResponse> {
  // Implement cache clearing logic
  console.log('Clearing cache...');
  return createSuccessResponse({ cleared: true });
}

async function performExportData(): Promise<MessageResponse> {
  const settings = await getSettings();
  const state = await getState();

  return createSuccessResponse({
    settings,
    state,
    exportedAt: new Date().toISOString(),
  });
}
