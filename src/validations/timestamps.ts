import { z } from 'zod';
import { dateSchema } from '@/validations/shared';

export const createTimestampSchema = z.object({
    sessionId: z.string().optional(),
    title: z.string().optional(),
    createdAt: dateSchema.optional(),
});

export type CreateTimestampInput = z.infer<typeof createTimestampSchema>;

export const updateTimestampSchema = z.object({
    id: z.string(),
    sessionId: z.string(),
    title: z.string().nullable(),
    createdAt: z.string().datetime(),
});

export type UpdateTimestampInput = z.infer<typeof updateTimestampSchema>;

export const timestampSchema = z.object({
    id: z.string(),
    sessionId: z.string(),
    title: z.string().nullable(),
    createdAt: dateSchema,
});

export type Timestamp = z.infer<typeof timestampSchema>;

export const timestampListSchema = z.array(timestampSchema);

export type TimestampList = z.infer<typeof timestampListSchema>;
