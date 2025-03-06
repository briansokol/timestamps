import { z } from 'zod';

export const createTimestampSchema = z.object({
  sessionId: z.string().or(z.number()).transform(val => 
    typeof val === 'string' ? parseInt(val, 10) : val
  ),
  title: z.string().optional(),
});

export type CreateTimestampInput = z.infer<typeof createTimestampSchema>;

export const updateTimestampSchema = z.object({
  title: z.string().optional(),
});

export type UpdateTimestampInput = z.infer<typeof updateTimestampSchema>;