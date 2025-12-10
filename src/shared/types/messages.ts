import { z } from 'zod';
import { SettingsSchema } from './settings';
import { StateSchema } from './state';

/**
 * Base message structure for all messages
 */
export const BaseMessageSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.number().int().positive(),
});

/**
 * Message types for communication between extension contexts
 */
export const MessageSchema = z.discriminatedUnion('type', [
  // Get settings from background
  BaseMessageSchema.extend({
    type: z.literal('GET_SETTINGS'),
  }),
  // Update settings in background
  BaseMessageSchema.extend({
    type: z.literal('UPDATE_SETTINGS'),
    payload: SettingsSchema.partial(),
  }),
  // Get state from background
  BaseMessageSchema.extend({
    type: z.literal('GET_STATE'),
  }),
  // Update state in background
  BaseMessageSchema.extend({
    type: z.literal('UPDATE_STATE'),
    payload: StateSchema.partial(),
  }),
  // Execute named action
  BaseMessageSchema.extend({
    type: z.literal('EXECUTE_ACTION'),
    payload: z.object({
      action: z.string(),
      params: z.record(z.unknown()).optional(),
    }),
  }),
  // Notification message
  BaseMessageSchema.extend({
    type: z.literal('NOTIFY'),
    payload: z.object({
      level: z.enum(['info', 'warning', 'error']),
      message: z.string(),
    }),
  }),
  // Settings updated broadcast
  BaseMessageSchema.extend({
    type: z.literal('SETTINGS_UPDATED'),
    payload: SettingsSchema,
  }),
  // Tab data from content script
  BaseMessageSchema.extend({
    type: z.literal('TAB_DATA'),
    payload: z.object({
      tabId: z.number().int().positive(),
      url: z.string().url(),
      title: z.string(),
      isProcessed: z.boolean(),
      metadata: z.record(z.unknown()).optional(),
    }),
  }),
]);

export type Message = z.infer<typeof MessageSchema>;

// Individual message type helpers
export type GetSettingsMessage = Extract<Message, { type: 'GET_SETTINGS' }>;
export type UpdateSettingsMessage = Extract<Message, { type: 'UPDATE_SETTINGS' }>;
export type GetStateMessage = Extract<Message, { type: 'GET_STATE' }>;
export type UpdateStateMessage = Extract<Message, { type: 'UPDATE_STATE' }>;
export type ExecuteActionMessage = Extract<Message, { type: 'EXECUTE_ACTION' }>;
export type NotifyMessage = Extract<Message, { type: 'NOTIFY' }>;
export type SettingsUpdatedMessage = Extract<Message, { type: 'SETTINGS_UPDATED' }>;
export type TabDataMessage = Extract<Message, { type: 'TAB_DATA' }>;

/**
 * Message response wrapper
 */
export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
