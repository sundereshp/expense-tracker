// src/hooks/useExpenses.ts
import { useCallback, useEffect, useState } from 'react';
import { Expense, NewExpenseInput, UpdateExpenseInput } from '../models/Expense';
import {
  deleteExpense,
  getExpensesByDate,
  getExpenseById as dbGetExpenseById,
  insertExpense as dbInsertExpense,
  updateExpense as dbUpdateExpense,
} from '../database/expenseQueries';
import { initializeDatabase } from '../database/db';
import { useSelectedDate } from '../context/SelectedDateContext';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedDate } = useSelectedDate();

  // Initialize database and load expenses on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        await loadExpenses();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    void init();
  }, []);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExpensesByDate(selectedDate);
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const refreshExpenses = useCallback(async () => {
    await loadExpenses();
  }, [loadExpenses]);

  const addExpense = useCallback(async (input: NewExpenseInput) => {
    try {
      await dbInsertExpense(input);
      await loadExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }, [loadExpenses]);

  const updateExpense = useCallback(async (input: UpdateExpenseInput) => {
    try {
      await dbUpdateExpense(input);
      await loadExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }, [loadExpenses]);

  const deleteExpenseById = useCallback(async (id: number) => {
    try {
      await deleteExpense(id);
      await refreshExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }, [refreshExpenses]);

  const getExpenseById = useCallback(async (id: number) => {
    try {
      return await dbGetExpenseById(id);
    } catch (error) {
      console.error('Error getting expense by id:', error);
      throw error;
    }
  }, []);

  return {
    expenses,
    loading,
    refreshExpenses,
    addExpense,
    updateExpense,
    deleteExpense: deleteExpenseById,
    getExpenseById,
  };
}
