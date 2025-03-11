import { SessionView } from '@/components/session-view';

interface SessionsPageProps {
    params: Promise<{ sessionId: string }>;
}

export default async function SessionsPage({ params }: Readonly<SessionsPageProps>) {
    const { sessionId } = await params;

    return <SessionView sessionId={sessionId} />;
}
