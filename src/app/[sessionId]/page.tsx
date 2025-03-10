import { SessionTimelineView } from '@/components/session-timeline-view';

export default async function SessionsPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;
    console.log('sessionId: ', sessionId);

    return <SessionTimelineView sessionId={sessionId} />;
}
