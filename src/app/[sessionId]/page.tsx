import { SessionView } from '@/components/session-view';

export default async function SessionsPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;

    return <SessionView sessionId={sessionId} />;
}
