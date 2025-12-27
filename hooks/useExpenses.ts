// src/hooks/useExpenses.ts
// FIXED: Initialize DB before ANY queries
import { useCallback, useEffect, useState } from 'react';
import { Expense, NewExpenseInput, UpdateExpenseInput } from '../models/Expense';
import {
  deleteExpense,
  getExpensesByDate,
  getExpenseById,
  insertExpense,
  updateExpense,
} from '../database/expenseQueries';
import { initializeDatabase } from '../database/db';
import { useSelectedDate } from '../context/SelectedDateContext';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedDate } = useSelectedDate();

  // In useExpenses.ts
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Loading expenses...');
      await initializeDatabase(); // Make sure this is called first
      const data = await getExpensesByDate(selectedDate);
      console.log('Expenses loaded:', data);
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    void loadExpenses();
  }, [loadExpenses]);

  const refreshExpenses = useCallback(async () => {
    await loadExpenses();
  }, [loadExpenses]);

  const addExpense = useCallback(async (input: NewExpenseInput) => {
    try {
      console.log('Adding expense:', input);
      await insertExpense(input);
      await refreshExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }, [refreshExpenses]);

  const updateExpense = useCallback(
    async (input: UpdateExpenseInput) => {
      await initializeDatabase();
      await updateExpense(input);
      await refreshExpenses();
    },
    [refreshExpenses]
  );

  const deleteExpenseById = useCallback(
    async (id: number) => {
      await initializeDatabase();
      await deleteExpense(id);
      await refreshExpenses();
    },
    [refreshExpenses]
  );

  const getExpenseByIdHook = useCallback(async (id: number) => {
    await initializeDatabase();
    return await getExpenseById(id);
  }, []);

  return {
    expenses,
    loading,
    refreshExpenses,
    addExpense,
    updateExpense,
    deleteExpense: deleteExpenseById,
    getExpenseById: getExpenseByIdHook,
  };
}
