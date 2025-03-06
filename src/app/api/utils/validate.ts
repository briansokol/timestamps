import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates the request body against a Zod schema
 * @param request The Next.js request object
 * @param schema The Zod schema to validate against
 * @returns The validated data or a NextResponse with error details
 */
export async function validateRequest<T extends z.ZodType>(
  request: NextRequest,
  schema: T
): Promise<{ success: true; data: z.infer<T> } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Validation error', details: error.format() },
          { status: 400 }
        ),
      };
    }
    
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      ),
    };
  }
}