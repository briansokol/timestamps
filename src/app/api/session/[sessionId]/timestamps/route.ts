import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/utils/db';

// Get all timestamps by sessionId
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params;

        const timestamps = await db
            .select()
            .from(schema.timestamp)
            .where(eq(schema.timestamp.sessionId, sessionId))
            .orderBy(schema.timestamp.createdAt);

        return NextResponse.json(timestamps);
    } catch (error) {
        console.error('Failed to get timestamps:', error);
        return NextResponse.json({ error: 'Failed to get timestamps' }, { status: 500 });
    }
}
