'use client';

import { Loader, Text, Timeline } from '@mantine/core';
import { useGetSessionById } from '@/hooks/sessions';
import { useGetTimestampListBySessionId } from '@/hooks/timestamps';
import { formatDateTime } from '@/utils/dates';

interface SessionBasicViewProps {
    sessionId: string;
}

export function SessionTimelineView({ sessionId }: SessionBasicViewProps) {
    const {
        session,
        isLoading: sessionIsLoading,
        error: sessionError,
    } = useGetSessionById(sessionId);

    const {
        timestamps,
        isLoading: timestampsIsLoading,
        error: timestampsError,
    } = useGetTimestampListBySessionId(sessionId);

    if (session) {
        console.log('session:', session);
    }

    if (timestamps) {
        console.log('timestamps:', timestamps);
    }

    if (sessionIsLoading || timestampsIsLoading) {
        return <Loader type="dots" />;
    }

    if (sessionError || timestampsError) {
        return (
            <>
                <div>Error loading data:</div>
                <ul>
                    {sessionError && <li>{sessionError.message}</li>}
                    {timestampsError && <li>{timestampsError.message}</li>}
                </ul>
            </>
        );
    }

    return (
        <div>
            <h1>{session?.title}</h1>
            <p>{formatDateTime(session?.startedAt)}</p>
            <Timeline bulletSize={32}>
                {timestamps?.map((timestamp) => (
                    <Timeline.Item key={timestamp.id} title={timestamp?.title ?? 'Untitled'}>
                        <Text c="dimmed" size="sm">
                            Default bullet without anything
                        </Text>
                    </Timeline.Item>
                ))}
            </Timeline>
        </div>
    );
}
