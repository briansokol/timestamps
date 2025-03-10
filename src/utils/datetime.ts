import { useMemo } from 'react';

export function useFormattedDateTime(date: Date): string {
    return useMemo(() => {
        return formatDateTime(date);
    }, [date]);
}

export function formatDateTime(date?: Date): string {
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

/**
 * Formats the time duration between two dates
 * @param startDate The start date
 * @param endDate The end date
 * @returns Formatted time difference as "mm:ss" if under 60 minutes, or "hh:mm:ss" if 60 minutes or more
 */
export function formatTimeDuration(startDate: Date, endDate: Date): string {
    // Calculate difference in milliseconds
    const diffMs = endDate.getTime() - startDate.getTime();

    // Convert to seconds
    const diffSeconds = Math.floor(diffMs / 1000);

    // Calculate hours, minutes and seconds
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);
    const seconds = diffSeconds % 60;

    // Format with leading zeros
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    // Return appropriate format based on duration
    if (hours > 0) {
        const formattedHours = hours.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}
