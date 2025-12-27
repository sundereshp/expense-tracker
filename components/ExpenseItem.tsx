// src/components/ExpenseItem.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GestureHandlerRootView, RectButton, Swipeable } from 'react-native-gesture-handler';
import { Expense } from '../models/Expense';

interface ExpenseItemProps {
  expense: Expense;
  onPress: () => void;
  onDelete: () => Promise<void>;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onPress, onDelete }) => {
  const renderRightActions = () => (
    <RectButton style={styles.deleteButton} onPress={onDelete}>
      <Text style={styles.deleteText}>Delete</Text>
    </RectButton>
  );

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions}>
        <Pressable onPress={onPress} style={styles.container}>
          <View style={styles.row}>
            <Text style={styles.title}>{expense.title}</Text>
            <Text style={styles.amount}>₹{expense.amount.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.category}>{expense.category ?? 'Uncategorized'}</Text>
          </View>
        </Pressable>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  category: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginVertical: 1,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});
