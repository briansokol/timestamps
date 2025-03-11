import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/utils/db';
import { validateRequest } from '@/utils/validate';
import { updateTimestampSchema } from '@/validations/timestamps';

// Get a specific timestamp by ID
export async function GET(_request: NextRequest, { params }: { params: Promise<{ timestampId: string }> }) {
    const { timestampId } = await params;

    try {
        const timestamp = await db.select().from(schema.timestamp).where(eq(schema.timestamp.id, timestampId));

        if (timestamp.length === 0) {
            return NextResponse.json({ error: 'Timestamp not found' }, { status: 404 });
        }

        return NextResponse.json(timestamp[0]);
    } catch (error) {
        console.error(`Failed to get timestamp with id ${timestampId}:`, error);
        return NextResponse.json({ error: 'Failed to get timestamp' }, { status: 500 });
    }
}

// Update a specific timestamp
export async function PUT(request: NextRequest, { params }: { params: Promise<{ timestampId: string }> }) {
    const { timestampId } = await params;

    // Validate the request
    const validation = await validateRequest(request, updateTimestampSchema);

    if (!validation.success) {
        return validation.response;
    }

    try {
        // The data is now validated and typed
        const updatedData = validation.data;

        // Update the timestamp in the database
        const updatedTimestamps = await db
            .update(schema.timestamp)
            .set(updatedData)
            .where(eq(schema.timestamp.id, timestampId))
            .returning();

        // If no timestamp was found with the given id
        if (updatedTimestamps.length === 0) {
            return NextResponse.json({ error: 'Timestamp not found' }, { status: 404 });
        }

        // Return the updated timestamp
        return NextResponse.json(updatedTimestamps[0]);
    } catch (error) {
        console.error(`Failed to update timestamp with id ${timestampId}:`, error);
        return NextResponse.json({ error: 'Failed to update timestamp' }, { status: 500 });
    }
}

// Delete a specific timestamp
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ timestampId: string }> }) {
    const { timestampId } = await params;

    try {
        const deletedTimestamps = await db
            .delete(schema.timestamp)
            .where(eq(schema.timestamp.id, timestampId))
            .returning();

        if (deletedTimestamps.length === 0) {
            return NextResponse.json({ error: 'Timestamp not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            deleted: deletedTimestamps[0],
        });
    } catch (error) {
        console.error(`Failed to delete timestamp with id ${timestampId}:`, error);
        return NextResponse.json({ error: 'Failed to delete timestamp' }, { status: 500 });
    }
}
