import { NextResponse } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { GET } from './route';

// Mock NextResponse
vi.mock('next/server', () => ({
    NextResponse: {
        json: vi.fn(() => ({ status: 200, json: { status: 'ok' } })),
    },
}));

describe('GET', () => {
    it('should return status ok', async () => {
        const response = await GET();
        expect(NextResponse.json).toHaveBeenCalledWith({ status: 'ok' }, { status: 200 });
        expect(response.status).toBe(200);
        expect(response.json).toEqual({ status: 'ok' });
    });
});
