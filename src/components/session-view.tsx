'use client';

import { Loader, Space, Stack, Tabs } from '@mantine/core';
import { SessionEditView } from '@/components/session-edit-view';
import { SessionTimelineView } from '@/components/session-timeline-view';
import { SessionYouTubeView } from '@/components/session-youtube-view';
import { useGetSessionById } from '@/hooks/sessions';
import { useGetTimestampListBySessionId } from '@/hooks/timestamps';
import { SessionTitleView } from './session-title-view';

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
            <SessionTitleView session={session} />
            {session ? (
                <Tabs defaultValue="timeline">
                    <Tabs.List>
                        <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
                        <Tabs.Tab value="youtube">YouTube</Tabs.Tab>
                        <Tabs.Tab value="edit">Edit</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="timeline">
                        <Space h="md" />
                        <SessionTimelineView timestamps={timestamps} session={session} />
                    </Tabs.Panel>

                    <Tabs.Panel value="youtube">
                        <Space h="md" />
                        <SessionYouTubeView timestamps={timestamps} />
                    </Tabs.Panel>

                    <Tabs.Panel value="edit">
                        <Space h="md" />
                        <SessionEditView timestamps={timestamps} sessionId={session.id} />
                    </Tabs.Panel>
                </Tabs>
            ) : null}
        </Stack>
    );
}
