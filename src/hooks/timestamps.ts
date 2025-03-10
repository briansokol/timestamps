import { useQuery } from '@tanstack/react-query';
import { TimestampList, timestampListSchema } from '@/validations/timestamps';

export function useGetTimestampListBySessionId(sessionId?: string) {
    const {
        data: timestamps,
        isLoading,
        error,
    } = useQuery<TimestampList>({
        queryKey: ['timestamps', sessionId],
        queryFn: async () => {
            if (!sessionId) {
                return [];
            }

            const response = await fetch(`/api/session/${sessionId}/timestamps`);
            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }
            return timestampListSchema.parse(await response.json());
        },
    });

    return { timestamps, isLoading, error };
}
