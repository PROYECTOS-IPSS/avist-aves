import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { migrateDatabase } from './migrations';

export const DATABASE_NAME = 'avistaves.db';

let databasePromise: Promise<SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLiteDatabase> {
  databasePromise ??= openDatabaseAsync(DATABASE_NAME)
    .then(async (database) => {
      await migrateDatabase(database);
      return database;
    })
    .catch((error: unknown) => {
      databasePromise = null;
      throw error;
    });

  return databasePromise;
}
