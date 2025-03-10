'use client';

import { Code } from '@mantine/core';
import { useMemo } from 'react';
import { formatTimeDuration } from '@/utils/datetime';
import { TimestampList } from '@/validations/timestamps';

interface SessionYouTubeViewProps {
    timestamps: TimestampList | null | undefined;
}

export function SessionYouTubeView({ timestamps }: SessionYouTubeViewProps) {
    const formattedTimestampsArray = useMemo(() => {
        if (Array.isArray(timestamps)) {
            return timestamps.map(
                (timestamp) =>
                    `${formatTimeDuration(timestamps[0].createdAt, timestamp.createdAt)} ${timestamp.title ?? ''}`
            );
        }
    }, [timestamps]);

    return <Code block>{formattedTimestampsArray?.join('\n')}</Code>;
}
