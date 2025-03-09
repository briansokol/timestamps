'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDateTime } from '@/utils/dates';
import { SessionList, sessionListSchema } from '@/validations/sessions';

export default function SessionsPage() {
    const {
        data: sessions,
        isLoading,
        error,
    } = useQuery<SessionList>({
        queryKey: ['sessions'],
        queryFn: async () => {
            const response = await fetch('/api/session');
            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }
            return sessionListSchema.parse(await response.json());
        },
    });

    if (sessions) {
        console.log(sessions);
    }

    if (isLoading) {
        return <div>Loading sessions...</div>;
    }

    if (error) {
        return <div>Error loading sessions: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Sessions</h1>
            <ul className="space-y-2">
                {sessions?.map((session) => (
                    <li key={session.id} className="rounded bg-gray-700 p-3 text-white">
                        <p className="font-semibold">{session.title || 'Untitled Session'}</p>
                        <ul>
                            <li>Started: {formatDateTime(session.startedAt)}</li>
                            <li>Ended: {session.endedAt ? formatDateTime(session.endedAt) : 'Not ended'}</li>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}
