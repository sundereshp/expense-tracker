// app/edit-expense.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text, Alert, ActivityIndicator, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useExpenses } from '../hooks/useExpenses';
import { Expense } from '../models/Expense';

const STATIC_CATEGORIES = ['Health', 'Groceries', 'Travel', 'Shopping', 'Food', 'Entertainment', 'Other'];

export default function EditExpenseScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getExpenseById, updateExpense, loading } = useExpenses();

  const [expense, setExpense] = useState<Expense | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const found = await getExpenseById(Number(id));
      if (!found) {
        Alert.alert('Error', 'Expense not found');
        router.back();
        return;
      }
      setExpense(found);
      setTitle(found.title);
      setAmount(found.amount.toString());
      setDate(new Date(found.date));
      setCategory(found.category);
      setPaymentMethod(found.paymentMethod || 'Cash');
    };
    void load();
  }, [id, getExpenseById, router]);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirmDate = (picked: Date) => {
    setDate(picked);
    hideDatePicker();
  };

  const onSave = async () => {
    if (!expense) return;
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Validation', 'Title and amount are required.');
      return;
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Validation', 'Amount must be a positive number.');
      return;
    }

    try {
      await updateExpense({
        ...expense,
        title: title.trim(),
        amount: numericAmount,
        date: date.toISOString().split('T')[0],
        category,
        paymentMethod,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update expense.');
    }
  };

  if (!expense || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Groceries" />
      
      <Text style={styles.label}>Amount *</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        placeholder="1000"
      />
      
      <Text style={styles.label}>Date</Text>
      <Pressable style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
      </Pressable>
      
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={category || STATIC_CATEGORIES[0]} onValueChange={setCategory} style={styles.picker}>
          {STATIC_CATEGORIES.map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      
      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={paymentMethod} onValueChange={setPaymentMethod} style={styles.picker}>
          <Picker.Item label="Cash" value="Cash" />
          <Picker.Item label="Debit Card" value="Debit Card" />
          <Picker.Item label="Credit Card" value="Credit Card" />
          <Picker.Item label="UPI" value="UPI" />
        </Picker>
      </View>
      
      <Button title="Save Changes" onPress={onSave} />
      
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={date}
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: 16 },
  label: { marginTop: 12, marginBottom: 4, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  dateButtonText: { fontSize: 14, color: '#333' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: { height: 44 },
});
