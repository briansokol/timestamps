import { useMemo } from 'react';

export function useFormattedDateTime(date: Date): string {
    return useMemo(() => {
        return formatDateTime(date);
    }, [date]);
}

export function formatDateTime(date: Date): string {
    if (!date) {
        return '';
    }

    return date.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });
}
