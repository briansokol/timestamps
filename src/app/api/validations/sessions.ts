import { z } from 'zod';

export const createSessionSchema = z.object({
  title: z.string().optional(),
  // We don't need to specify startedAt or endedAt since they have default values or are optional
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

// For future use if you need to update sessions
export const updateSessionSchema = z.object({
  title: z.string().optional(),
  endedAt: z.string().optional(),
});

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;