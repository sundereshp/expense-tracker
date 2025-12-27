// src/database/db.ts
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('expenses.db');

let initialized = false;

export async function initializeDatabase(): Promise<void> {
    if (initialized) return;
  
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
  
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        category TEXT NULL
      );
  
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        is_built_in INTEGER NOT NULL DEFAULT 0
      );
    `);
  
    // seed built-in categories
    const builtInNames = ['Food', 'Rent', 'Bills', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Other'];
    for (const name of builtInNames) {
      await db.runAsync('INSERT OR IGNORE INTO categories (name, is_built_in) VALUES (?, 1)', [name]);
    }
  
    initialized = true;
  }