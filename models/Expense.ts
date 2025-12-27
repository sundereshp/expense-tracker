// src/models/Expense.ts
export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string | null;
  paymentMethod: string | null;
}

export interface NewExpenseInput {
  title: string;
  amount: number;
  date: string;
  category: string | null;
  paymentMethod: string | null;
}

export interface UpdateExpenseInput extends Expense {}

export interface Category {
  id: number;
  name: string;
  isBuiltIn: number;
}
