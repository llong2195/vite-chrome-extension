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
        `Message validation failed: ${error.errors.map((e) => e.message).join(', ')}`
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
