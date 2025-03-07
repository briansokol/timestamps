import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/utils/db';
import { validateRequest } from '../utils/validate';
import { createSessionSchema } from '../validations/sessions';

export async function POST(request: NextRequest) {
    // Validate the request using our validation utility
    const validation = await validateRequest(request, createSessionSchema);

    if (!validation.success) {
        return validation.response;
    }

    try {
        // The data is now validated and typed
        const { title } = validation.data;

        // Insert the new session into the database
        const result = await db
            .insert(schema.session)
            .values({
                title: title || undefined, // If title is not provided, use the default
            })
            .returning();

        // Return the created session
        return NextResponse.json(result[0], { status: 201 });
    } catch (error) {
        console.error('Failed to create session:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}

// Get all sessions
export async function GET() {
    try {
        const sessions = await db.select().from(schema.session);
        return NextResponse.json(sessions);
    } catch (error) {
        console.error('Failed to get sessions:', error);
        return NextResponse.json({ error: 'Failed to get sessions' }, { status: 500 });
    }
}
