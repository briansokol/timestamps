'use client';

import { AppShell, Burger, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SessionListNav } from './session-list-nav';

interface AppShellLayoutProps {
    children: React.ReactNode;
}

/**
 * Main application shell layout with header, navbar, and content area
 * Header and navbar use solid dark blue background (#001d5b)
 * Main content area has radial gradient background
 */
export function AppShellLayout({ children }: Readonly<AppShellLayoutProps>) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header style={{ backgroundColor: 'var(--mantine-color-midnight-2)' }}>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Title order={1}>Timestamps</Title>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md" style={{ backgroundColor: 'var(--mantine-color-midnight-2)' }}>
                <SessionListNav />
            </AppShell.Navbar>
            <AppShell.Main
                style={{
                    background: 'var(--mantine-color-midnight-1)',
                }}
            >
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
