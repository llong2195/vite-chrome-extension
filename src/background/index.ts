/**
 * Background Service Worker
 * Handles extension initialization, message passing, and state management
 */

import { handleMessage } from './messageHandler';
import { initializeStorage } from './storageManager';

console.log('Background service worker initialized');

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('Extension installed:', details.reason);

  // Initialize storage with default values
  await initializeStorage();

  console.log('Extension initialization complete');
});

/**
 * Initialize on startup
 */
chrome.runtime.onStartup.addListener(async () => {
  console.log('Extension startup');
  await initializeStorage();
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
 * Listen for storage changes and sync across contexts
 */
chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log('Storage changed:', { areaName, changes });

  // You can broadcast changes to tabs here if needed
  if (changes.extension_settings) {
    console.log('Settings updated:', changes.extension_settings.newValue);
  }
});

/**
 * Handle tab updates to inject content scripts or track active tabs
 */
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('Tab activated:', activeInfo.tabId);

  // Update state with active tab ID
  // This will be used in Phase 5 implementation
});

/**
 * Example: Periodic task using chrome.alarms API
 * This demonstrates how to run background tasks on a schedule
 */

// Create an alarm on installation
chrome.runtime.onInstalled.addListener(() => {
  // Create a periodic alarm that fires every 60 minutes
  chrome.alarms.create('periodicSync', {
    periodInMinutes: 60,
  });
  console.log('Periodic sync alarm created');
});

// Listen for alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log('Alarm triggered:', alarm.name);

  if (alarm.name === 'periodicSync') {
    // Perform periodic sync task
    performPeriodicSync();
  }
});

/**
 * Example periodic sync function
 * Replace with your actual sync logic
 */
async function performPeriodicSync(): Promise<void> {
  console.log('Performing periodic sync...');

  try {
    // Example: Sync data, check for updates, etc.
    // This could fetch data from an API, update local storage, etc.

    const timestamp = new Date().toISOString();
    console.log(`Sync completed at ${timestamp}`);

    // You could update state here
    // await updateState({ lastSync: timestamp });
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

// Export for testing
export { handleMessage };
