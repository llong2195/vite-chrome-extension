import { z } from 'zod';

/**
 * Extension State stored in chrome.storage.local and maintained by background worker
 * Not synchronized across devices
 */
export const StateSchema = z.object({
  isActive: z.boolean().default(true),
  lastSync: z.string().datetime().nullable().default(null),
  activeTabId: z.number().int().positive().nullable().default(null),
  errorCount: z.number().int().nonnegative().default(0),
});

export type State = z.infer<typeof StateSchema>;

export const DEFAULT_STATE: State = {
  isActive: true,
  lastSync: null,
  activeTabId: null,
  errorCount: 0,
};
