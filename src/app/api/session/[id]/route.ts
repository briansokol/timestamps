import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/utils/db';
import { eq } from 'drizzle-orm';
import { validateRequest } from '../../utils/validate';
import { updateSessionSchema } from '../../validations/sessions';

// Update a specific session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validate the request
  const validation = await validateRequest(request, updateSessionSchema);
  
  if (!validation.success) {
    return validation.response;
  }
  
  try {
    // The data is now validated and typed
    const { title, endedAt } = validation.data;
    
    // Prepare update object, only include fields that were provided
    const updateData: { title?: string; endedAt?: string } = {};
    if (title !== undefined) updateData.title = title;
    if (endedAt !== undefined) updateData.endedAt = endedAt;
    
    // Update the session in the database
    const updatedSessions = await db
      .update(schema.session)
      .set(updateData)
      .where(eq(schema.session.id, id))
      .returning();
    
    // If no session was found with the given id
    if (updatedSessions.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    // Return the updated session
    return NextResponse.json(updatedSessions[0]);
  } catch (error) {
    console.error(`Failed to update session with id ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
}

// Get a specific session
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const session = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.id, id));
    
    if (session.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(session[0]);
  } catch (error) {
    console.error(`Failed to get session with id ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}

// Delete a specific session
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const deletedSessions = await db
      .delete(schema.session)
      .where(eq(schema.session.id, id))
      .returning();
    
    if (deletedSessions.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, deleted: deletedSessions[0] });
  } catch (error) {
    console.error(`Failed to delete session with id ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}