'use client';

import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <MantineProvider forceColorScheme="dark">
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </MantineProvider>
    );
}
