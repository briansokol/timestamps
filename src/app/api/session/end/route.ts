import { isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db, schema } from '@/utils/db';

export async function POST() {
    try {
        const result = await db
            .update(schema.session)
            .set({
                endedAt: new Date().toISOString(),
            })
            .where(isNull(schema.session.endedAt))
            .returning();

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Failed to update session:', error);
        return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }
}
