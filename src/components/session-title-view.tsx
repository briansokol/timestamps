'use client';

import { ActionIcon, Group, Text, TextInput, Title } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { MdClear, MdDone, MdEdit } from 'react-icons/md';
import { formatDateTime } from '@/utils/datetime';
import { Session, UpdateSessionInput, updateSessionSchema } from '@/validations/sessions';

interface SessionTitleViewProps {
    session?: Session | null;
}

export function SessionTitleView({ session }: SessionTitleViewProps) {
    const [editTitle, setEditTitle] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');

    const setFormValues = useCallback(
        (session: Session) => {
            setEditTitle(true);
            setTitle(session.title ?? '');
        },
        [setEditTitle, setTitle]
    );

    const clearFormValues = useCallback(() => {
        setEditTitle(false);
        setTitle('');
    }, [setEditTitle, setTitle]);

    const queryClient = useQueryClient();

    const saveMutation = useMutation({
        mutationFn: async (session: UpdateSessionInput) => {
            const data = updateSessionSchema.parse(session);

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
            clearFormValues();
            queryClient.invalidateQueries({ queryKey: ['sessions', sessionId] });
            queryClient.invalidateQueries({ queryKey: ['sessions'] });
        },
    });

    if (!session) {
        return null;
    }

    return (
        <div>
            <Group gap="sm" grow={editTitle}>
                {editTitle ? (
                    <>
                        <TextInput
                            aria-label="Enter session title"
                            placeholder="Title"
                            size="md"
                            radius="lg"
                            value={title}
                            onChange={(event) => setTitle(event.currentTarget.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    saveMutation.mutate({
                                        ...session,
                                        title,
                                        startedAt: session.startedAt.toISOString(),
                                        endedAt: session.endedAt?.toISOString() ?? null,
                                    });
                                }
                            }}
                        />
                        <ActionIcon.Group>
                            <ActionIcon
                                variant="filled"
                                radius="md"
                                color="green"
                                aria-label="Save title"
                                onClick={() =>
                                    saveMutation.mutate({
                                        ...session,
                                        title,
                                        startedAt: session.startedAt.toISOString(),
                                        endedAt: session.endedAt?.toISOString() ?? null,
                                    })
                                }
                            >
                                <MdDone />
                            </ActionIcon>
                            <ActionIcon
                                variant="filled"
                                radius="md"
                                color="pink"
                                aria-label="Cancel edit title"
                                onClick={() => clearFormValues()}
                            >
                                <MdClear />
                            </ActionIcon>
                        </ActionIcon.Group>
                    </>
                ) : (
                    <>
                        <Title order={2}>{session?.title}</Title>
                        <ActionIcon
                            variant="transparent"
                            aria-label="Edit title"
                            onClick={() => setFormValues(session)}
                        >
                            <MdEdit />
                        </ActionIcon>
                    </>
                )}
            </Group>
            <Text size="md">{`${formatDateTime(session?.startedAt)}${session?.endedAt ? ` - ${formatDateTime(session?.endedAt)}` : ''}`}</Text>
        </div>
    );
}
