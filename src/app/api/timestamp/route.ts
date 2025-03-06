import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/utils/db';
import { validateRequest } from '../utils/validate';
import { createTimestampSchema } from '../validations/timestamps';
import { eq } from 'drizzle-orm';

// Create a new timestamp
export async function POST(request: NextRequest) {
  // Validate the request
  const validation = await validateRequest(request, createTimestampSchema);
  
  if (!validation.success) {
    return validation.response;
  }
  
  try {
    const { sessionId, title } = validation.data;
    
    // Verify that the session exists
    const session = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.id, sessionId.toString()));
    
    if (session.length === 0) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    // Insert the new timestamp
    const result = await db.insert(schema.timestamp).values({
      sessionId,
      title: title || undefined,
    }).returning();
    
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create timestamp:', error);
    return NextResponse.json(
      { error: 'Failed to create timestamp' },
      { status: 500 }
    );
  }
}

// Get all timestamps or filter by sessionId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    let timestamps;
    
    // Filter by sessionId if provided
    if (sessionId) {
      timestamps = await db
        .select()
        .from(schema.timestamp)
        .where(eq(schema.timestamp.sessionId, parseInt(sessionId, 10)));
    } else {
      timestamps = await db.select().from(schema.timestamp);
    }
    
    return NextResponse.json(timestamps);
  } catch (error) {
    console.error('Failed to get timestamps:', error);
    return NextResponse.json(
      { error: 'Failed to get timestamps' },
      { status: 500 }
    );
  }
}