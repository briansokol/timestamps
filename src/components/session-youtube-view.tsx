'use client';

import { Button, Code, CopyButton, Stack } from '@mantine/core';
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
        } else {
            return null;
        }
    }, [timestamps]);

    return (
        <Stack align="stretch" justify="center" gap="md">
            {formattedTimestampsArray != null && (
                <CopyButton value={formattedTimestampsArray.join('\n')}>
                    {({ copied, copy }) => (
                        <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    )}
                </CopyButton>
            )}
            <Code block>{formattedTimestampsArray?.join('\n')}</Code>
        </Stack>
    );
}
