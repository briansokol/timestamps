import { db, dbClient, schema } from '@/utils/db';
import { nanoid } from 'nanoid';

/**
 * Generate a random integer between min (inclusive) and max (inclusive)
 */
function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random date within the past N days
 */
function randomPastDate(daysAgo: number): Date {
    const now = new Date();
    const millisecondsAgo = daysAgo * 24 * 60 * 60 * 1000;
    const randomOffset = Math.random() * millisecondsAgo;
    return new Date(now.getTime() - randomOffset);
}

/**
 * Add random minutes to a date (between 1 and maxMinutes)
 */
function addRandomMinutes(date: Date, maxMinutes: number): Date {
    const minutes = randomInt(1, maxMinutes);
    return new Date(date.getTime() + minutes * 60 * 1000);
}

/**
 * Generate random timestamp titles (50% chance of having a title)
 */
function randomTimestampTitle(): string | null {
    if (Math.random() < 0.5) {
        return null;
    }

    const titles = [
        'Highlight',
        'Important moment',
        'Funny part',
        'Key discussion',
        'Technical issue',
        'Achievement unlocked',
        'Epic fail',
        'Good quote',
        'Recap point',
        'Transition',
        'Break time',
        'Guest arrival',
        'Demo starts',
        'Q&A session',
        'Final thoughts',
    ];

    return titles[randomInt(0, titles.length - 1)];
}

/**
 * Generate random session title
 */
function randomSessionTitle(index: number): string {
    const prefixes = [
        'Test Stream',
        'Gaming Session',
        'Live Coding',
        'Tutorial',
        'Podcast Episode',
        'Workshop',
        'Presentation',
        'Discussion',
        'Review Session',
        'Practice Run',
    ];

    return `${prefixes[randomInt(0, prefixes.length - 1)]} ${index + 1}`;
}

/**
 * Main seed function
 */
async function seed() {
    console.log('Starting database seed...');

    const sessionsToCreate = 10;

    for (let i = 0; i < sessionsToCreate; i++) {
        // Create session
        const sessionId = nanoid();
        const startedAt = randomPastDate(30); // Within past 30 days
        const hasEnded = Math.random() < 0.6; // 60% chance session has ended
        const endedAt = hasEnded
            ? addRandomMinutes(startedAt, randomInt(30, 180)) // 30 min to 3 hours
            : null;

        await db.insert(schema.session).values({
            id: sessionId,
            title: randomSessionTitle(i),
            startedAt: startedAt.toISOString(),
            endedAt: endedAt?.toISOString() ?? null,
        });

        console.log(`Created session ${i + 1}/${sessionsToCreate}: ${sessionId}`);

        // Create timestamps for this session
        const timestampCount = randomInt(3, 15);
        let currentTime = startedAt;

        for (let j = 0; j < timestampCount; j++) {
            // Each timestamp is 1-30 minutes after the previous
            currentTime = addRandomMinutes(currentTime, 30);

            // Don't create timestamps after session ended
            if (endedAt && currentTime > endedAt) {
                break;
            }

            await db.insert(schema.timestamp).values({
                id: nanoid(),
                sessionId: sessionId,
                title: randomTimestampTitle(),
                createdAt: currentTime.toISOString(),
            });
        }

        console.log(`  Added ${timestampCount} timestamps`);
    }

    console.log('Database seed complete!');

    dbClient.close();
    process.exit(0);
}

seed().catch((err) => {
    console.error('Error during seed:', err);
    process.exit(1);
});
