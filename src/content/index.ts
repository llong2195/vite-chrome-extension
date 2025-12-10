/**
 * Content Script
 * Runs in the context of web pages
 */

import {
  addPageIndicator,
  getPageMetadata,
  waitForDOMReady,
  highlightElements,
} from './pageModifier';
import { createBaseMessage } from '@shared/utils/messageValidator';
import type { TabDataMessage } from '@shared/types/messages';

console.log('Content script loaded');

/**
 * Initialize content script
 */
async function init(): Promise<void> {
  await waitForDOMReady();

  // Show indicator that extension is active
  addPageIndicator('✓ Extension Active', 2000);

  // Get page metadata
  const metadata = getPageMetadata();
  console.log('Page metadata:', metadata);

  // Send page data to background
  await sendPageDataToBackground(metadata);

  // Example: Highlight all links on the page
  const linkCount = highlightElements('a', '#3b82f6', 1500);
  console.log(`Found ${linkCount} links on page`);
}

/**
 * Send page data to background worker
 */
async function sendPageDataToBackground(
  metadata: ReturnType<typeof getPageMetadata>,
): Promise<void> {
  try {
    const tab = await chrome.tabs.getCurrent();
    const tabId = tab?.id || 0;

    const message: TabDataMessage = {
      ...createBaseMessage(),
      type: 'TAB_DATA',
      payload: {
        tabId,
        url: metadata.url,
        title: metadata.title,
        isProcessed: true,
        metadata: {
          description: metadata.description,
          keywords: metadata.keywords,
          headings: metadata.headings,
        },
      },
    };

    const response = await chrome.runtime.sendMessage(message);
    console.log('Background response:', response);
  } catch (error) {
    console.error('Failed to send message to background:', error);
  }
}

/**
 * Listen for messages from background or popup
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('Content script received message:', message);

  if (message.type === 'PING') {
    sendResponse({ success: true, data: { pong: true } });
    return true;
  }

  if (message.type === 'HIGHLIGHT_LINKS') {
    const count = highlightElements(
      'a',
      message.color || '#3b82f6',
      message.duration || 2000,
    );
    sendResponse({ success: true, data: { count } });
    return true;
  }

  sendResponse({ success: false, error: 'Unknown message type' });
  return true;
});

// Initialize
init().catch((error) => {
  console.error('Content script initialization failed:', error);
});

// Export for testing
export { init, sendPageDataToBackground };
