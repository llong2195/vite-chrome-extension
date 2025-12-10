import { z } from 'zod';

/**
 * Extension Settings stored in chrome.storage.sync
 * Synchronized across devices when user is signed into Chrome
 */
export const SettingsSchema = z.object({
  version: z.number().int().positive().default(1),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.boolean().default(true),
  autoSync: z.boolean().default(true),
  language: z.string().default('en'),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const DEFAULT_SETTINGS: Settings = {
  version: 1,
  theme: 'system',
  notifications: true,
  autoSync: true,
  language: 'en',
};
