import { eq, isNull } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/utils/db';
import { validateRequest } from '@/utils/validate';
import { createTimestampSchema } from '@/validations/timestamps';

// Create a new timestamp
export async function POST(request: NextRequest) {
    // Validate the request
    const validation = await validateRequest(request, createTimestampSchema);

    if (!validation.success) {
        return validation.response;
    }

    try {
        const { sessionId, title } = validation.data;
        let activeSessionId: string = '';

        if (sessionId) {
            // Verify that the session exists
            const session = await db.select().from(schema.session).where(eq(schema.session.id, sessionId.toString()));

            if (session.length === 0) {
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }

            activeSessionId = session[0].id;
        } else {
            // Search for active session
            const activeSession = await db.select().from(schema.session).where(isNull(schema.session.endedAt));

            if (activeSession.length > 0) {
                activeSessionId = activeSession[0].id;
            } else {
                // No active session found
                return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            }
        }

        // Insert the new timestamp
        const result = await db
            .insert(schema.timestamp)
            .values({
                sessionId: activeSessionId,
                title: title || undefined,
            })
            .returning();

        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Failed to create timestamp:', error);
        return NextResponse.json({ error: 'Failed to create timestamp' }, { status: 500 });
    }
}

// Get all timestamps
export async function GET() {
    try {
        const timestamps = await db.select().from(schema.timestamp);

        return NextResponse.json(timestamps);
    } catch (error) {
        console.error('Failed to get timestamps:', error);
        return NextResponse.json({ error: 'Failed to get timestamps' }, { status: 500 });
    }
}
