'use client';

import { Badge, Loader, NavLink, ScrollArea, Title } from '@mantine/core';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { useGetSessionList } from '@/hooks/sessions';
import { formatDateTime } from '@/utils/datetime';

interface Coordinates {
    x: number;
    y: number;
}

export function SessionListNav() {
    const { sessionId: activeSessionId } = useParams<{ sessionId?: string }>();
    const { sessions, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetSessionList();
    const viewport = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(
        (coords: Coordinates) => {
            if (!hasNextPage || isFetchingNextPage) {
                return;
            }

            const viewportScrollHeight = viewport.current!.scrollHeight ?? 0;
            const clientHeight = viewport.current!.clientHeight ?? 0;

            const isNearBottom = coords.y + clientHeight >= viewportScrollHeight - 100; // Load when 100px from bottom

            if (isNearBottom) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    if (isLoading) {
        return <Loader type="dots" />;
    }

    if (error) {
        return <div>Error loading sessions: {error.message}</div>;
    }

    return (
        <div>
            <Title order={3}>Sessions</Title>
            <ScrollArea
                viewportRef={viewport}
                h="calc(100vh - 120px)"
                offsetScrollbars
                overscrollBehavior="contain"
                scrollbarSize={20}
                scrollHideDelay={500}
                onScrollPositionChange={handleScroll}
            >
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
                {isFetchingNextPage && (
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                        <Loader type="dots" size="sm" />
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
