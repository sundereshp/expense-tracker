// src/database/expenseQueries.ts
import { db } from './db';
import { Expense, NewExpenseInput, UpdateExpenseInput } from '../models/Expense';
import { Category } from '../models/Expense';
export async function getExpensesByDate(date: string): Promise<Expense[]> {
  const rows = await db.getAllAsync<Expense>(
    'SELECT id, title, amount, date, category FROM expenses WHERE date = ? ORDER BY id DESC',
    [date]
  );
  return rows;
}

export async function getAllExpenses(): Promise<Expense[]> {
  const rows = await db.getAllAsync<Expense>(
    'SELECT id, title, amount, date, category FROM expenses ORDER BY date DESC, id DESC'
  );
  return rows;
}

export async function getExpenseById(id: number): Promise<Expense | null> {
  const rows = await db.getAllAsync<Expense>(
    'SELECT id, title, amount, date, category FROM expenses WHERE id = ? LIMIT 1',
    [id]
  );
  return rows.length === 0 ? null : rows[0];
}

export async function insertExpense(input: NewExpenseInput): Promise<void> {
  await db.runAsync(
    'INSERT INTO expenses (title, amount, date, category) VALUES (?, ?, ?, ?)',
    [input.title, input.amount, input.date, input.category]
  );
}

export async function updateExpense(input: UpdateExpenseInput): Promise<void> {
  await db.runAsync(
    'UPDATE expenses SET title = ?, amount = ?, date = ?, category = ? WHERE id = ?',
    [input.title, input.amount, input.date, input.category, input.id]
  );
}

export async function deleteExpense(id: number): Promise<void> {
  await db.runAsync('DELETE FROM expenses WHERE id = ?', [id]);
}
// ADD after existing exports:
export async function getAllCategories(): Promise<Category[]> {
  const rows = await db.getAllAsync<Category>(
    'SELECT id, name, is_built_in as isBuiltIn FROM categories ORDER BY is_built_in DESC, name ASC'
  );
  return rows;
}

export async function insertCustomCategory(name: string): Promise<void> {
  await db.runAsync(
    'INSERT OR IGNORE INTO categories (name, is_built_in) VALUES (?, 0)',
    [name]
  );
}