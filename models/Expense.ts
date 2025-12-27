// src/models/Expense.ts
export type BuiltInCategory =
  | 'Food'
  | 'Rent'
  | 'Bills'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Health'
  | 'Other';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string | null;
}

export interface NewExpenseInput {
  title: string;
  amount: number;
  date: string;
  category: string | null;
}

export interface UpdateExpenseInput extends Expense {}

export interface Category {
  id: number;
  name: string;
  isBuiltIn: number;
}
