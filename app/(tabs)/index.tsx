// app/(tabs)/index.tsx
// ADDED: + FAB button for adding new expense
import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useExpenses } from '../../hooks/useExpenses';
import { useSelectedDate } from '../../context/SelectedDateContext';
import { ExpenseItem } from '../../components/ExpenseItem';
import { initializeDatabase } from '../../database/db';

export default function HomeScreen() {
  const router = useRouter();
  const { expenses, loading, refreshExpenses, deleteExpense } = useExpenses();
  const { selectedDate } = useSelectedDate();

  // In useFocusEffect, ensure DB is ready:
  useFocusEffect(
    useCallback(() => {
      // Initialize DB first
      initializeDatabase().then(() => {
        void refreshExpenses();
      });
    }, [refreshExpenses])
  );

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const headerTitle = isToday
    ? 'Today'
    : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{headerTitle}</Text>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExpenseItem
            expense={item}
            onPress={() => router.push(`/edit-expense?id=${item.id}`)}
            onDelete={async () => await deleteExpense(item.id)}
          />
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshExpenses} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No expenses for {headerTitle.toLowerCase()}.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* FAB - Add New Expense */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/add-expense')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    padding: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 56,
  },
});
