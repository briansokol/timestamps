import { z } from 'zod';

export const paginationSchema = z.object({
    page: z.number(),
    pageSize: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
});

export type Pagination = z.infer<typeof paginationSchema>;
