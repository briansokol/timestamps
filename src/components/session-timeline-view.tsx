'use client';

import { Button, Stack, Text, ThemeIcon, Timeline } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaChevronDown, FaChevronUp, FaMinus } from 'react-icons/fa6';
import { formatDateTime } from '@/utils/datetime';
import { Session, UpdateSessionInput, updateSessionSchema } from '@/validations/sessions';
import { TimestampList } from '@/validations/timestamps';

interface SessionTimelineViewProps {
    session?: Session | null;
    timestamps?: TimestampList | null;
}

export function SessionTimelineView({ session, timestamps }: SessionTimelineViewProps) {
    const queryClient = useQueryClient();

    const endMutation = useMutation({
        mutationFn: async (session: UpdateSessionInput) => {
            const data = updateSessionSchema.parse({
                ...session,
                endedAt: new Date().toISOString(),
            });

            return fetch(`/api/session/${session.id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to update session: ' + res.statusText);
                }
                return res;
            });
        },
        onSuccess: (_, { id: sessionId }) => {
            queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    if (!session || !timestamps) {
        return null;
    }

    return (
        <Stack align="flex-start" justify="flex-start" gap="md">
            <Timeline bulletSize={35}>
                {timestamps?.map((timestamp, i) => (
                    <Timeline.Item
                        key={timestamp.id}
                        title={timestamp?.title ?? 'Untitled'}
                        bullet={
                            <ThemeIcon radius="xl">
                                {i === 0 ? (
                                    <FaChevronDown />
                                ) : i === timestamps.length - 1 && session.endedAt ? (
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
            {!session.endedAt ? (
                <Button
                    variant="filled"
                    onClick={() =>
                        endMutation.mutate({
                            ...session,
                            startedAt: session.startedAt.toISOString(),
                            endedAt: session.endedAt?.toISOString() ?? null,
                        })
                    }
                >
                    End Session
                </Button>
            ) : null}
        </Stack>
    );
}
