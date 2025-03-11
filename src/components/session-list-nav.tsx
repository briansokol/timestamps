'use client';

import { Badge, Loader, NavLink, ScrollArea, Title } from '@mantine/core';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetSessionList } from '@/hooks/sessions';
import { formatDateTime } from '@/utils/datetime';

export function SessionListNav() {
    const { sessionId: activeSessionId } = useParams<{ sessionId?: string }>();
    const { sessions, isLoading, error } = useGetSessionList();

    if (isLoading) {
        return <Loader type="dots" />;
    }

    if (error) {
        return <div>Error loading sessions: {error.message}</div>;
    }

    return (
        <div>
            <Title order={3}>Sessions</Title>
            <ScrollArea h={250} offsetScrollbars overscrollBehavior="contain" scrollbarSize={20} scrollHideDelay={500}>
                {sessions?.map((session) => (
                    <NavLink
                        key={session.id}
                        component={Link}
                        href={`/${session.id}`}
                        label={session.title || 'Untitled Session'}
                        description={formatDateTime(session.startedAt)}
                        leftSection={
                            <Badge color={session.endedAt ? 'gray' : 'green'} variant="outline" circle>
                                A
                            </Badge>
                        }
                        active={session.id === activeSessionId}
                    />
                ))}
            </ScrollArea>
        </div>
    );
}
