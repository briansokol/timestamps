import { migrate } from 'drizzle-orm/libsql/migrator';
import { join } from 'path';
import { db, dbClient } from '@/utils/db';

// Main migration function
async function main() {
    // This will automatically run needed migrations on the database
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: join(process.cwd(), 'src/db/migrations') });
    console.log('Migrations complete!');

    dbClient.close();
    process.exit(0);
}

main().catch((err) => {
    console.error('Error during migration:', err);
    process.exit(1);
});
