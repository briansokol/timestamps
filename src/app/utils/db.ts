import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../../db/schema/schema';
import { join } from 'node:path';
import fs from 'node:fs';

// Ensure database file exists
const dbPath = join(process.cwd(), 'database.sqlite');
if (!fs.existsSync(dbPath)) {
  // Create an empty file if it doesn't exist
  fs.writeFileSync(dbPath, '');
}

// Create a database client
const client = createClient({
  url: `file:${dbPath}`,
});

// Create a Drizzle ORM instance
export const db = drizzle(client, { schema });

// Export the schema for use in other files
export { schema };