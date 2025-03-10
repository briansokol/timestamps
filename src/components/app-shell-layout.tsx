'use client';

import { AppShell, Burger, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SessionListNav } from './session-list-nav';

interface AppShellLayoutProps {
    children: React.ReactNode;
}

export function AppShellLayout({ children }: Readonly<AppShellLayoutProps>) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Title order={1}>Timestamps</Title>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <SessionListNav />
            </AppShell.Navbar>
            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
}
