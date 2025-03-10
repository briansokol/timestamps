'use client';

import { Text, ThemeIcon, Timeline } from '@mantine/core';
import { FaChevronDown, FaChevronUp, FaMinus } from 'react-icons/fa6';
import { formatDateTime } from '@/utils/datetime';
import { TimestampList } from '@/validations/timestamps';

interface SessionTimelineViewProps {
    timestamps: TimestampList | null | undefined;
}

export function SessionTimelineView({ timestamps }: SessionTimelineViewProps) {
    return (
        <Timeline bulletSize={35}>
            {timestamps?.map((timestamp, i) => (
                <Timeline.Item
                    key={timestamp.id}
                    title={timestamp?.title ?? 'Untitled'}
                    bullet={
                        <ThemeIcon radius="xl">
                            {i === 0 ? <FaChevronDown /> : i === timestamps.length - 1 ? <FaChevronUp /> : <FaMinus />}
                        </ThemeIcon>
                    }
                >
                    <Text c="dimmed" size="sm">
                        {formatDateTime(timestamp?.createdAt)}
                    </Text>
                </Timeline.Item>
            ))}
        </Timeline>
    );
}
