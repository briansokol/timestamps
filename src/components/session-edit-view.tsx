'use client';

import { ActionIcon, Alert, Table, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { MdCheckCircle, MdClear, MdDelete, MdDone, MdEdit, MdError } from 'react-icons/md';
import { formatDateTime } from '@/utils/datetime';
import { Timestamp, TimestampList, updateTimestampSchema } from '@/validations/timestamps';

interface SessionEditViewProps {
    sessionId: string;
    timestamps: TimestampList | null | undefined;
}

export function SessionEditView({ timestamps, sessionId }: SessionEditViewProps) {
    const [editId, setEditId] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [createdAt, setCreatedAt] = useState<Date | null>(null);

    const setFormValues = useCallback((timestamp: Timestamp) => {
        setEditId(timestamp.id);
        setTitle(timestamp.title ?? '');
        setCreatedAt(new Date(timestamp.createdAt));
    }, []);

    const clearFormValues = useCallback(() => {
        setEditId(null);
        setTitle('');
        setCreatedAt(null);
    }, []);

    const queryClient = useQueryClient();

    const saveMutation = useMutation({
        mutationFn: async (timestamp: Timestamp) => {
            const data = updateTimestampSchema.parse({
                ...timestamp,
                createdAt: timestamp?.createdAt?.toISOString(),
            });

            return fetch(`/api/timestamp/${timestamp.id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to update timestamp: ' + res.statusText);
                }
                return res;
            });
        },
        onSuccess: () => {
            clearFormValues();
            queryClient.invalidateQueries({ queryKey: ['timestamps', sessionId] });
        },
    });

    const rows = useMemo(() => {
        return timestamps?.map((timestamp) => (
            <Table.Tr key={timestamp.id}>
                <Table.Td>
                    {editId === timestamp.id ? (
                        <TextInput
                            aria-label="Enter timestamp title"
                            placeholder="Title"
                            value={title}
                            onChange={(event) => setTitle(event.currentTarget.value)}
                        />
                    ) : (
                        timestamp.title
                    )}
                </Table.Td>
                <Table.Td>
                    {editId === timestamp.id ? (
                        <DateTimePicker
                            aria-label="Pick timestamp date and time"
                            withSeconds
                            valueFormat="MMM D, YYYY hh:mm:ss A"
                            placeholder="When?"
                            value={createdAt}
                            onChange={(date) => setCreatedAt(date as Date | null)}
                        />
                    ) : (
                        formatDateTime(timestamp.createdAt)
                    )}
                </Table.Td>
                <Table.Td>
                    <ActionIcon.Group>
                        {editId === timestamp.id ? (
                            <>
                                <ActionIcon
                                    variant="filled"
                                    radius="md"
                                    color="green"
                                    aria-label="Save"
                                    onClick={() =>
                                        saveMutation.mutate({
                                            id: timestamp.id,
                                            sessionId,
                                            title,
                                            createdAt: createdAt ?? new Date(),
                                        })
                                    }
                                >
                                    <MdDone />
                                </ActionIcon>
                                <ActionIcon
                                    variant="filled"
                                    radius="md"
                                    color="pink"
                                    aria-label="Cancel Edit"
                                    onClick={() => clearFormValues()}
                                >
                                    <MdClear />
                                </ActionIcon>
                            </>
                        ) : (
                            <>
                                <ActionIcon
                                    variant="light"
                                    radius="md"
                                    aria-label="Edit"
                                    disabled={editId !== null}
                                    onClick={() => setFormValues(timestamp)}
                                >
                                    <MdEdit />
                                </ActionIcon>
                                <ActionIcon
                                    variant="light"
                                    radius="md"
                                    color="red"
                                    aria-label="Delete"
                                    disabled={editId !== null}
                                >
                                    <MdDelete />
                                </ActionIcon>
                            </>
                        )}
                    </ActionIcon.Group>
                </Table.Td>
            </Table.Tr>
        ));
    }, [timestamps, editId, createdAt, title, clearFormValues, setFormValues, saveMutation, sessionId]);

    return (
        <>
            {saveMutation.isError ? (
                <Alert
                    variant="light"
                    color="red"
                    radius="md"
                    title="Error Saving Timestamp"
                    icon={<MdError />}
                    withCloseButton
                    onClose={() => saveMutation.reset()}
                >
                    Error: {saveMutation.error.message}
                </Alert>
            ) : null}
            {saveMutation.isSuccess ? (
                <Alert
                    variant="light"
                    color="green"
                    radius="md"
                    title="Success"
                    icon={<MdCheckCircle />}
                    withCloseButton
                    onClose={() => saveMutation.reset()}
                >
                    Timestamp has been updated!
                </Alert>
            ) : null}
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Timestamp</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </>
    );
}
