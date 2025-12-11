import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateMessage,
  createBaseMessage,
} from '@shared/utils/messageValidator';
import type { TabDataMessage, MessageResponse } from '@shared/types/messages';

describe('Content-Background Messaging', () => {
  beforeEach(() => {
    // Mocks are reset automatically by chromeApiMocks.ts
  });

  describe('Message Validation', () => {
    it('should validate TAB_DATA message', () => {
      const message: TabDataMessage = {
        ...createBaseMessage(),
        type: 'TAB_DATA',
        payload: {
          tabId: 1,
          url: 'https://example.com',
          title: 'Example Page',
          isProcessed: true,
          metadata: {
            description: 'Test page',
          },
        },
      };

      expect(() => validateMessage(message)).not.toThrow();
      const validated = validateMessage(message);
      expect(validated.type).toBe('TAB_DATA');
      expect(validated.payload.tabId).toBe(1);
    });

    it('should reject invalid message structure', () => {
      const invalidMessage = {
        type: 'TAB_DATA',
        // Missing id and timestamp
      };

      expect(() => validateMessage(invalidMessage)).toThrow();
    });

    it('should reject invalid TAB_DATA payload', () => {
      const message = {
        ...createBaseMessage(),
        type: 'TAB_DATA',
        payload: {
          // Missing required fields
          tabId: 'invalid', // Should be number
        },
      };

      expect(() => validateMessage(message)).toThrow();
    });
  });

  describe('Message Creation', () => {
    it('should create base message with UUID and timestamp', () => {
      const base = createBaseMessage();

      expect(base).toHaveProperty('id');
      expect(base).toHaveProperty('timestamp');
      expect(typeof base.id).toBe('string');
      expect(typeof base.timestamp).toBe('number');
      expect(base.id.length).toBeGreaterThan(0);
      expect(base.timestamp).toBeGreaterThan(0);
    });

    it('should create unique IDs for different messages', () => {
      const msg1 = createBaseMessage();
      const msg2 = createBaseMessage();

      expect(msg1.id).not.toBe(msg2.id);
    });
  });

  describe('Message Sending', () => {
    it('should send message to background', async () => {
      const message: TabDataMessage = {
        ...createBaseMessage(),
        type: 'TAB_DATA',
        payload: {
          tabId: 1,
          url: 'https://example.com',
          title: 'Test',
          isProcessed: true,
        },
      };

      const response =
        await chrome.runtime.sendMessage<MessageResponse>(message);

      expect(response).toHaveProperty('success');
      expect(response.success).toBe(true);
    });
  });

  describe('Message Responses', () => {
    it('should include success status', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'PING',
      };

      const response =
        await chrome.runtime.sendMessage<MessageResponse>(message);

      expect(response).toHaveProperty('success');
      expect(typeof response.success).toBe('boolean');
    });

    it('should include data on success', async () => {
      const message = {
        ...createBaseMessage(),
        type: 'PING',
      };

      const response =
        await chrome.runtime.sendMessage<MessageResponse>(message);

      if (response.success) {
        expect(response).toHaveProperty('data');
      }
    });
  });
});
