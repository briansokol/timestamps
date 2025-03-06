import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/utils/db';
import { eq } from 'drizzle-orm';
import { validateRequest } from '../../utils/validate';
import { updateTimestampSchema } from '../../validations/timestamps';

// Get a specific timestamp by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const timestamp = await db
      .select()
      .from(schema.timestamp)
      .where(eq(schema.timestamp.id, id));
    
    if (timestamp.length === 0) {
      return NextResponse.json(
        { error: 'Timestamp not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(timestamp[0]);
  } catch (error) {
    console.error(`Failed to get timestamp with id ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to get timestamp' },
      { status: 500 }
    );
  }
}

// Update a specific timestamp
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validate the request
  const validation = await validateRequest(request, updateTimestampSchema);
  
  if (!validation.success) {
    return validation.response;
  }
  
  try {
    // The data is now validated and typed
    const { title } = validation.data;
    
    // Prepare update object
    const updateData: { title?: string } = {};
    if (title !== undefined) updateData.title = title;
    
    // Update the timestamp in the database
    const updatedTimestamps = await db
      .update(schema.timestamp)
      .set(updateData)
      .where(eq(schema.timestamp.id, id))
      .returning();
    
    // If no timestamp was found with the given id
    if (updatedTimestamps.length === 0) {
      return NextResponse.json(
        { error: 'Timestamp not found' },
        { status: 404 }
      );
    }
    
    // Return the updated timestamp
    return NextResponse.json(updatedTimestamps[0]);
  } catch (error) {
    console.error(`Failed to update timestamp with id ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update timestamp' },
      { status: 500 }
    );
  }
}

// Delete a specific timestamp
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const deletedTimestamps = await db
      .delete(schema.timestamp)
      .where(eq(schema.timestamp.id, id))
      .returning();
    
    if (deletedTimestamps.length === 0) {
      return NextResponse.json(
        { error: 'Timestamp not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      deleted: deletedTimestamps[0] 
    });
  } catch (error) {
    console.error(`Failed to delete timestamp with id ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete timestamp' },
      { status: 500 }
    );
  }
}