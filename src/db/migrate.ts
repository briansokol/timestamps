import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';
import { join } from 'path';
import fs from 'fs';

// Ensure database file exists
const dbPath = join(process.cwd(), 'database.sqlite');
if (!fs.existsSync(dbPath)) {
  // Create an empty file if it doesn't exist
  fs.writeFileSync(dbPath, '');
}

// Main migration function
async function main() {
  const client = createClient({
    url: `file:${dbPath}`,
  });

  const db = drizzle(client);

  // This will automatically run needed migrations on the database
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: join(process.cwd(), 'src/db/migrations') });
  console.log('Migrations complete!');

  client.close();
  process.exit(0);
}

main().catch((err) => {
  console.error('Error during migration:', err);
  process.exit(1);
});