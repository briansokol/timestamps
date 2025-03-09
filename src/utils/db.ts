import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import * as schema from '@/db/schema/schema';

export const DB_PATH = 'sqlite/database.sqlite';

export function getDbPath() {
    return join(process.cwd(), DB_PATH);
}

export function createDatabaseFile() {
    const dbPath = getDbPath();

    // Ensure all directories in the path exist
    const dbDir = dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    if (!fs.existsSync(dbPath)) {
        // Create an empty file if it doesn't exist
        fs.writeFileSync(dbPath, '');
    }
}

// ensure database file exists
createDatabaseFile();

// Create a database client
export const dbClient = createClient({
    url: `file:${getDbPath()}`,
});

// Create a Drizzle ORM instance
export const db = drizzle(dbClient, { schema });

// Export the schema for use in other files
export { schema };
