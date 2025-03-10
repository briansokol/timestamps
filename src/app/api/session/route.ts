import { desc, isNull, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/utils/db';
import { validateRequest } from '@/utils/validate';
import { createSessionSchema } from '@/validations/sessions';

export async function POST(request: NextRequest) {
    // Validate the request using our validation utility
    const validation = await validateRequest(request, createSessionSchema);

    if (!validation.success) {
        return validation.response;
    }

    try {
        // The data is now validated and typed
        const { title } = validation.data;

        // First, find and close any open sessions
        await db
            .update(schema.session)
            .set({
                endedAt: new Date().toISOString(),
            })
            .where(isNull(schema.session.endedAt));

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

// Get all sessions with pagination
export async function GET(request: NextRequest) {
    try {
        // Get pagination parameters from query string
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');

        // Validate pagination parameters
        const validPage = page > 0 ? page : 1;
        const validPageSize = pageSize > 0 && pageSize <= 100 ? pageSize : 10;

        // Calculate offset
        const offset = (validPage - 1) * validPageSize;

        // Get total count for pagination metadata
        const countResult = await db.select({ count: sql<number>`count(*)` }).from(schema.session);
        const totalCount = countResult[0].count;

        // Get paginated sessions
        const sessions = await db
            .select()
            .from(schema.session)
            .orderBy(desc(schema.session.startedAt))
            .limit(validPageSize)
            .offset(offset);

        // Return sessions with pagination metadata
        return NextResponse.json({
            data: sessions,
            pagination: {
                page: validPage,
                pageSize: validPageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / validPageSize),
            },
        });
    } catch (error) {
        console.error('Failed to get sessions:', error);
        return NextResponse.json({ error: 'Failed to get sessions' }, { status: 500 });
    }
}
