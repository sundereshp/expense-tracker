// app/add-expense.tsx
// UPDATED: Added payment method picker
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text, Alert, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useExpenses } from '../hooks/useExpenses';
import { useSelectedDate } from '../context/SelectedDateContext';

const PAYMENT_METHODS = ['Cash', 'Debit Card', 'Credit Card', 'UPI'];

export default function AddExpenseScreen() {
  const router = useRouter();
  const { addExpense } = useExpenses();
  const { selectedDate } = useSelectedDate();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date(selectedDate));
  const [category, setCategory] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>('Cash');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const onSave = async () => {
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
      await addExpense({
        title: title.trim(),
        amount: numericAmount,
        date: date.toISOString().split('T')[0],
        category: category || null,
        paymentMethod: paymentMethod || null,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save expense.');
    }
  };

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirmDate = (picked: Date) => {
    setDate(picked);
    hideDatePicker();
  };

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
      <Pressable onPress={showDatePicker} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={date}
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
      />

      <Text style={styles.label}>Category (optional)</Text>
      <TextInput
        style={styles.input}
        value={category ?? ''}
        onChangeText={(text) => setCategory(text.trim() || null)}
        placeholder="Food, Rent, etc."
      />

      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        >
          <Picker.Item label="Cash" value="Cash" />
          <Picker.Item label="Debit Card" value="Debit Card" />
          <Picker.Item label="Credit Card" value="Credit Card" />
          <Picker.Item label="UPI" value="UPI" />
        </Picker>
      </View>

      <Button title="Save" onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
});
