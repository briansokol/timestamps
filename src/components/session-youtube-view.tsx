'use client';

import { Button, Code, Stack } from '@mantine/core';
import { useMemo, useRef } from 'react';
import { formatTimeDuration } from '@/utils/datetime';
import { TimestampList } from '@/validations/timestamps';

interface SessionYouTubeViewProps {
    timestamps: TimestampList | null | undefined;
}

export function SessionYouTubeView({ timestamps }: SessionYouTubeViewProps) {
    const codeRef = useRef<HTMLDivElement>(null);

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

    const handleSelectText = () => {
        if (codeRef.current) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(codeRef.current);
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
    };

    return (
        <Stack align="stretch" justify="center" gap="md">
            {formattedTimestampsArray != null && (
                <Button onClick={handleSelectText}>Select Text</Button>
            )}
            <Code block fz="md" ref={codeRef}>
                {formattedTimestampsArray?.join('\n')}
            </Code>
        </Stack>
    );
}
