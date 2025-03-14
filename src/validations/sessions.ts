import { z } from 'zod';
import { dateSchema } from '@/validations/shared';
import { paginationSchema } from './pagination';

export const createSessionSchema = z.object({
    title: z.string().optional(),
    startedAt: z.string().datetime().optional(),
    endedAt: z.string().datetime().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const updateSessionSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    startedAt: z.string().datetime(),
    endedAt: z.string().datetime().nullable(),
});

export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

export const sessionSchema = z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    startedAt: dateSchema,
    endedAt: dateSchema.nullable(),
});

export type Session = z.infer<typeof sessionSchema>;

export const sessionListSchema = z.array(sessionSchema);

export type SessionList = z.infer<typeof sessionListSchema>;

export const sessionListResponseSchema = z.object({
    data: sessionListSchema,
    pagination: paginationSchema,
});

export type SessionListResponse = z.infer<typeof sessionListResponseSchema>;
