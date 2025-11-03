'use client';

import { createTheme, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * Custom theme configuration with blue primary and green secondary colors
 * Designed for dark mode with WCAG AA accessibility compliance
 */
const theme = createTheme({
    primaryColor: 'blue',
    colors: {
        // Custom blue scale (primary) - optimized for dark backgrounds
        blue: [
            '#e6f2ff', // 0 - lightest (for text on dark backgrounds)
            '#b8ddff', // 1
            '#8ac8ff', // 2
            '#5cb3ff', // 3
            '#2e9eff', // 4 - primary shade for most uses
            '#0089ff', // 5 - base blue
            '#006ed6', // 6
            '#0053ad', // 7
            '#003884', // 8
            '#001d5b', // 9 - darkest
        ],
        // Custom green scale (secondary) - for success states and active sessions
        green: [
            '#e6fff2', // 0 - lightest
            '#b8ffdb', // 1
            '#8affc4', // 2
            '#5cffad', // 3
            '#2eff96', // 4 - primary green shade
            '#00ff7f', // 5 - base green
            '#00d66a', // 6
            '#00ad55', // 7
            '#008440', // 8
            '#005b2b', // 9 - darkest
        ],
        // Very dark midnight blue backgrounds - almost black
        midnight: [
            '#0a0e1a', // 0 - lighter shade (subtle midnight blue)
            '#070b14', // 1 - darker shade (almost pure black with blue tint)
            '#0d1221', // 2 - slightly lighter variant
            '#12172b', // 3
            '#171c35', // 4
            '#1c213f', // 5
            '#212649', // 6
            '#262b53', // 7
            '#2b305d', // 8
            '#303567', // 9 - lightest midnight
        ],
    },
});

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <MantineProvider theme={theme} defaultColorScheme="dark" forceColorScheme="dark">
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </MantineProvider>
    );
}
