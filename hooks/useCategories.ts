// src/hooks/useCategories.ts
import { useCallback, useEffect, useState } from 'react';
import { Category } from '../models/Expense';
import { getAllCategories, insertCustomCategory } from '../database/expenseQueries';
import { initializeDatabase } from '../database/db';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      await initializeDatabase();
      const data = await getAllCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const addCustomCategory = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      await insertCustomCategory(trimmed);
      await loadCategories();
      return trimmed;
    },
    [loadCategories]
  );

  return {
    categories,
    loading,
    addCustomCategory,
    reloadCategories: loadCategories,
  };
}
