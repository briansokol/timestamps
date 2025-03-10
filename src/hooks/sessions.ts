import { useQuery } from '@tanstack/react-query';
import {
    Session,
    SessionListResponse,
    sessionListResponseSchema,
    sessionSchema,
} from '@/validations/sessions';

export function useGetSessionList() {
    const { data, isLoading, error } = useQuery<SessionListResponse>({
        queryKey: ['sessions'],
        queryFn: async () => {
            const response = await fetch('/api/session?page=1&pageSize=10');
            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }
            return sessionListResponseSchema.parse(await response.json());
        },
    });

    return { sessions: data?.data, pagination: data?.pagination, isLoading, error };
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
