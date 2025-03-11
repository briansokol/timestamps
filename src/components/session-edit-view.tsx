'use client';

import { ActionIcon, Table, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useCallback, useMemo, useState } from 'react';
import { MdClear, MdDelete, MdDone, MdEdit } from 'react-icons/md';
import { formatDateTime } from '@/utils/datetime';
import { Timestamp, TimestampList } from '@/validations/timestamps';

interface SessionEditViewProps {
    timestamps: TimestampList | null | undefined;
}

export function SessionEditView({ timestamps }: SessionEditViewProps) {
    const [editId, setEditId] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [createdAt, setCreatedAt] = useState<Date | null>(null);

    const setFormValues = useCallback((timestamp: Timestamp) => {
        setEditId(timestamp.id);
        setTitle(timestamp.title ?? '');
        setCreatedAt(timestamp.createdAt);
    }, []);

    const clearFormValues = useCallback(() => {
        setEditId(null);
        setTitle('');
        setCreatedAt(null);
    }, []);

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
                            onChange={(date) => setCreatedAt(date)}
                        />
                    ) : (
                        formatDateTime(timestamp.createdAt)
                    )}
                </Table.Td>
                <Table.Td>
                    <ActionIcon.Group>
                        {editId === timestamp.id ? (
                            <>
                                <ActionIcon variant="filled" radius="md" color="green" aria-label="Save">
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
    }, [timestamps, editId, createdAt, title, clearFormValues, setFormValues]);

    return (
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
    );
}
