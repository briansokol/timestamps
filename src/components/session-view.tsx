'use client';

import { Loader, Space, Stack, Tabs, Text, Title } from '@mantine/core';
import { SessionTimelineView } from '@/components/session-timeline-view';
import { SessionYouTubeView } from '@/components/session-youtube-view';
import { useGetSessionById } from '@/hooks/sessions';
import { useGetTimestampListBySessionId } from '@/hooks/timestamps';
import { formatDateTime } from '@/utils/datetime';

interface SessionViewProps {
    sessionId: string;
}

export function SessionView({ sessionId }: SessionViewProps) {
    const { session, isLoading: sessionIsLoading, error: sessionError } = useGetSessionById(sessionId);

    const {
        timestamps,
        isLoading: timestampsIsLoading,
        error: timestampsError,
    } = useGetTimestampListBySessionId(sessionId);

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
            <Tabs defaultValue="timeline">
                <Tabs.List>
                    <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
                    <Tabs.Tab value="youtube">YouTube</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="timeline">
                    <Space h="md" />
                    <SessionTimelineView timestamps={timestamps} />
                </Tabs.Panel>

                <Tabs.Panel value="youtube">
                    <Space h="md" />
                    <SessionYouTubeView timestamps={timestamps} />
                </Tabs.Panel>
            </Tabs>
        </Stack>
    );
}
