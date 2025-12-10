/**
 * Background Service Worker
 * Handles extension initialization, message passing, and state management
 */

import { DEFAULT_SETTINGS } from '@shared/types/settings';
import { DEFAULT_STATE } from '@shared/types/state';
import { getSettings, saveSettings, getState, saveState } from '@shared/storage/storageHelpers';

console.log('Background service worker initialized');

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed:', details.reason);

  // Initialize settings if not exists
  const existingSettings = await getSettings();
  if (!existingSettings) {
    await saveSettings(DEFAULT_SETTINGS);
    console.log('Default settings initialized');
  }

  // Initialize state if not exists
  const existingState = await getState();
  if (!existingState) {
    await saveState(DEFAULT_STATE);
    console.log('Default state initialized');
  }
});

/**
 * Handle messages from other extension contexts
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Received message:', message);

  // Handle async message processing
  handleMessage(message)
    .then((response) => sendResponse(response))
    .catch((error) => {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    });

  // Return true to indicate async response
  return true;
});

/**
 * Process incoming messages
 */
async function handleMessage(
  _message: unknown
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  // Basic message handling - will be expanded in Phase 5
  return { success: true, data: { received: true } };
}

// Export for testing
export { handleMessage };
