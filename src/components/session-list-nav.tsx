'use client';

import { ActionIcon, Loader, NavLink, ScrollArea, Title } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { IoCaretForwardCircle, IoEllipse, IoTrash } from 'react-icons/io5';
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
    const queryClient = useQueryClient();
    const router = useRouter();

    const deleteSessionMutation = useMutation({
        mutationFn: async (sessionId: string) => {
            const response = await fetch(`/api/session/${sessionId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete session');
            }
            return response.json();
        },
        onSuccess: (_, deletedSessionId) => {
            // Invalidate and refetch sessions to update the list
            queryClient.invalidateQueries({ queryKey: ['sessions'] });

            // If the deleted session is currently active, redirect to home
            if (deletedSessionId === activeSessionId) {
                router.push('/');
            }
        },
        onError: (error) => {
            console.error('Failed to delete session:', error);
            // You could add toast notification here
        },
    });

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

    const handleDeleteSession = useCallback(
        (sessionId: string, event: React.MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

            // You could add a confirmation dialog here
            if (window.confirm('Are you sure you want to delete this session?')) {
                deleteSessionMutation.mutate(sessionId);
            }
        },
        [deleteSessionMutation]
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
                            <span style={{ fontSize: '1.2rem' }}>
                                {session.endedAt ? (
                                    <IoEllipse style={{ color: 'DarkSlateGrey ' }} />
                                ) : (
                                    <IoCaretForwardCircle style={{ color: 'var(--mantine-color-green-9)' }} />
                                )}
                            </span>
                        }
                        rightSection={
                            session.endedAt ? (
                                <ActionIcon
                                    size="sm"
                                    variant="subtle"
                                    color="pink"
                                    onClick={(event) => handleDeleteSession(session.id, event)}
                                    loading={
                                        deleteSessionMutation.isPending &&
                                        deleteSessionMutation.variables === session.id
                                    }
                                    style={{ opacity: 0.7 }}
                                >
                                    <IoTrash />
                                </ActionIcon>
                            ) : null
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
