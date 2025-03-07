'use client';

import { useQuery } from '@tanstack/react-query';

interface Session {
    id: string;
    title: string;
    createdAt: string;
    endedAt: string | null;
}

export default function SessionsPage() {
    const {
        data: sessions,
        isLoading,
        error,
    } = useQuery<Session[]>({
        queryKey: ['sessions'],
        queryFn: async () => {
            const response = await fetch('/api/session');
            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }
            return response.json();
        },
    });

    if (isLoading) {
        return <div>Loading sessions...</div>;
    }

    if (error) {
        return <div>Error loading sessions: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Sessions</h1>
            <ul className="space-y-2">
                {sessions?.map((session) => (
                    <li key={session.id} className="p-3 bg-gray-700 text-white rounded">
                        {session.title || 'Untitled Session'}
                    </li>
                ))}
            </ul>
        </div>
    );
}
