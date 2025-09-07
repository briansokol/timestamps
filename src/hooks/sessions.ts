import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Session, SessionListResponse, sessionListResponseSchema, sessionSchema } from '@/validations/sessions';

export function useGetSessionList() {
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery<SessionListResponse>({
            queryKey: ['sessions'],
            queryFn: async ({ pageParam = 1 }) => {
                const response = await fetch(`/api/session?page=${pageParam}&pageSize=20`);
                if (!response.ok) {
                    throw new Error('Failed to fetch sessions');
                }
                return sessionListResponseSchema.parse(await response.json());
            },
            getNextPageParam: (lastPage) => {
                console.log('Last page:', lastPage);
                const { page, totalPages } = lastPage.pagination;
                return page < totalPages ? page + 1 : undefined;
            },
            initialPageParam: 1,
        });

    // Flatten all sessions from all pages
    const sessions = data?.pages.flatMap((page) => page.data) ?? [];
    const pagination = data?.pages[data.pages.length - 1]?.pagination;

    return {
        sessions,
        pagination,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    };
}

export function useGetSessionById(sessionId?: string) {
    const {
        data: session,
        isLoading,
        error,
    } = useQuery<Session | null>({
        queryKey: ['sessions', sessionId],
        queryFn: async () => {
            if (!sessionId) {
                return null;
            }
            const response = await fetch(`/api/session/${sessionId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }
            return sessionSchema.parse(await response.json());
        },
    });

    return { session, isLoading, error };
}
