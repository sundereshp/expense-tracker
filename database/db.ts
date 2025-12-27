// src/database/db.ts
// UPDATED: Added categories table with DROP for development
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('expenses.db');

let initialized = false;

export async function initializeDatabase(): Promise<void> {
  if (initialized) return;

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    DROP TABLE IF EXISTS expenses;
    DROP TABLE IF EXISTS categories;

    CREATE TABLE expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT NULL,
      paymentMethod TEXT NULL
    );

    CREATE TABLE categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      is_built_in INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Seed built-in categories
  const builtInCategories = [
    'Health', 'Groceries', 'Travel', 'Shopping', 'Food', 'Entertainment', 'Other'
  ];
  
  for (const name of builtInCategories) {
    await db.runAsync(
      'INSERT OR IGNORE INTO categories (name, is_built_in) VALUES (?, 1)',
      [name]
    );
  }

  initialized = true;
}
