import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/utils/db';
import { validateRequest } from '@/utils/validate';
import { updateSessionSchema } from '@/validations/sessions';

// Update a specific session
export async function PUT(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID cannot be empty' }, { status: 400 });
    }

    // Validate the request
    const validation = await validateRequest(request, updateSessionSchema);

    if (!validation.success) {
        return validation.response;
    }

    try {
        // The data is now validated and typed
        const updateData = validation.data;

        // Update the session in the database
        const updatedSessions = await db
            .update(schema.session)
            .set(updateData)
            .where(eq(schema.session.id, sessionId))
            .returning();

        // If no session was found with the given id
        if (updatedSessions.length === 0) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // Return the updated session
        return NextResponse.json(updatedSessions[0]);
    } catch (error) {
        console.error(`Failed to update session with id ${sessionId}:`, error);
        return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }
}

// Get a specific session
export async function GET(_request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID cannot be empty' }, { status: 400 });
    }

    try {
        const session = await db.select().from(schema.session).where(eq(schema.session.id, sessionId));

        if (session.length === 0) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        return NextResponse.json(session[0]);
    } catch (error) {
        console.error(`Failed to get session with id ${sessionId}:`, error);
        return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
    }
}

// Delete a specific session
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;

    try {
        const deletedSessions = await db.delete(schema.session).where(eq(schema.session.id, sessionId)).returning();

        if (deletedSessions.length === 0) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, deleted: deletedSessions[0] });
    } catch (error) {
        console.error(`Failed to delete session with id ${sessionId}:`, error);
        return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
    }
}
