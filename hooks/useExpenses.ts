// src/hooks/useExpenses.ts
import { useCallback, useEffect, useState } from 'react';
import { Expense, NewExpenseInput, UpdateExpenseInput } from '../models/Expense';
import {
  deleteExpense as deleteExpenseQuery,
  getExpensesByDate,
  getExpenseById as getExpenseByIdQuery,
  insertExpense as insertExpenseQuery,
  updateExpense as updateExpenseQuery,
} from '../database/expenseQueries';
import { initializeDatabase } from '../database/db';
import { useSelectedDate } from '../context/SelectedDateContext';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedDate } = useSelectedDate();

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      await initializeDatabase();
      const data = await getExpensesByDate(selectedDate);
      setExpenses(data);
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

  const addExpense = useCallback(
    async (input: NewExpenseInput) => {
      await insertExpenseQuery(input);
      await refreshExpenses();
    },
    [refreshExpenses]
  );

  const updateExpense = useCallback(
    async (input: UpdateExpenseInput) => {
      await updateExpenseQuery(input);
      await refreshExpenses();
    },
    [refreshExpenses]
  );

  const deleteExpenseById = useCallback(
    async (id: number) => {
      await deleteExpenseQuery(id);
      await refreshExpenses();
    },
    [refreshExpenses]
  );

  const getExpenseById = useCallback(async (id: number) => {
    await initializeDatabase();
    return await getExpenseByIdQuery(id);
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
