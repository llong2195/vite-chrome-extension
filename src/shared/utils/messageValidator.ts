import { MessageSchema, type Message, type MessageResponse } from '../types/messages';
import { ZodError } from 'zod';

/**
 * Validate message against schema
 */
export function validateMessage(message: unknown): Message {
  try {
    return MessageSchema.parse(message);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Message validation failed: ${error.issues.map((e: { message: string }) => e.message).join(', ')}`
      );
    }
    throw error;
  }
}

/**
 * Create a successful response
 */
export function createSuccessResponse<T>(data: T): MessageResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create an error response
 */
export function createErrorResponse(error: string): MessageResponse {
  return {
    success: false,
    error,
  };
}

/**
 * Generate unique message ID
 */
export function generateMessageId(): string {
  return crypto.randomUUID();
}

/**
 * Get current timestamp
 */
export function getTimestamp(): number {
  return Date.now();
}

/**
 * Create base message structure
 */
export function createBaseMessage(): { id: string; timestamp: number } {
  return {
    id: generateMessageId(),
    timestamp: getTimestamp(),
  };
}

/**
 * Message creation helpers
 */

export function createGetSettingsMessage() {
  return {
    ...createBaseMessage(),
    type: 'GET_SETTINGS' as const,
  };
}

export function createUpdateSettingsMessage(settings: Partial<Record<string, unknown>>) {
  return {
    ...createBaseMessage(),
    type: 'UPDATE_SETTINGS' as const,
    payload: { settings },
  };
}

export function createGetStateMessage() {
  return {
    ...createBaseMessage(),
    type: 'GET_STATE' as const,
  };
}

export function createUpdateStateMessage(state: Partial<Record<string, unknown>>) {
  return {
    ...createBaseMessage(),
    type: 'UPDATE_STATE' as const,
    payload: { state },
  };
}

export function createExecuteActionMessage(action: string, params?: Record<string, unknown>) {
  return {
    ...createBaseMessage(),
    type: 'EXECUTE_ACTION' as const,
    payload: { action, params },
  };
}

export function createTabDataMessage(data: {
  tabId: number;
  url: string;
  title: string;
  isProcessed: boolean;
}) {
  return {
    ...createBaseMessage(),
    type: 'TAB_DATA' as const,
    payload: data,
  };
}

export function createNotifyMessage(
  message: string,
  type: 'info' | 'success' | 'error' | 'warning' = 'info'
) {
  return {
    ...createBaseMessage(),
    type: 'NOTIFY' as const,
    payload: { message, type },
  };
}
