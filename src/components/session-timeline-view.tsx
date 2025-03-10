'use client';

import { Loader, Stack, Text, ThemeIcon, Timeline, Title } from '@mantine/core';
import { FaChevronDown, FaChevronUp, FaMinus } from 'react-icons/fa6';
import { useGetSessionById } from '@/hooks/sessions';
import { useGetTimestampListBySessionId } from '@/hooks/timestamps';
import { formatDateTime } from '@/utils/dates';

interface SessionBasicViewProps {
    sessionId: string;
}

export function SessionTimelineView({ sessionId }: SessionBasicViewProps) {
    const { session, isLoading: sessionIsLoading, error: sessionError } = useGetSessionById(sessionId);

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
        <Stack gap="md">
            <div>
                <Title order={2}>{session?.title}</Title>
                <Text size="md">{`${formatDateTime(session?.startedAt)}${session?.endedAt ? ` - ${formatDateTime(session?.endedAt)}` : ''}`}</Text>
            </div>
            <Timeline bulletSize={35}>
                {timestamps?.map((timestamp, i) => (
                    <Timeline.Item
                        key={timestamp.id}
                        title={timestamp?.title ?? 'Untitled'}
                        bullet={
                            <ThemeIcon radius="xl">
                                {i === 0 ? (
                                    <FaChevronDown />
                                ) : i === timestamps.length - 1 ? (
                                    <FaChevronUp />
                                ) : (
                                    <FaMinus />
                                )}
                            </ThemeIcon>
                        }
                    >
                        <Text c="dimmed" size="sm">
                            {formatDateTime(timestamp?.createdAt)}
                        </Text>
                    </Timeline.Item>
                ))}
            </Timeline>
        </Stack>
    );
}
