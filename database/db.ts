import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('expenses.db');

let initialized = false;

export async function initializeDatabase(): Promise<void> {
    if (initialized) {
        console.log('Database already initialized');
        return;
    }

    console.log('Initializing database...');

    try {
        // Check if table exists
        const tableInfo = await db.getAllAsync<{ name: string }>(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='expenses'
        `);
        const tableExists = tableInfo.length > 0;

        if (!tableExists) {
            console.log('Creating expenses table...');
            await db.execAsync(`
                CREATE TABLE expenses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    amount REAL NOT NULL,
                    date TEXT NOT NULL,
                    category TEXT NULL,
                    paymentMethod TEXT NULL
                );
            `);
        }

        initialized = true;
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}