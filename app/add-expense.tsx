// app/add-expense.tsx
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text, Alert, Pressable, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useExpenses } from '../hooks/useExpenses';
import { CategoryPicker } from '../components/CategoryPicker';
import { useCategories } from '../hooks/useCategories';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { addExpense, loading: isSaving } = useExpenses();
  const { categories, addCustomCategory, loading: isLoadingCategories } = useCategories();
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirmDate = (picked: Date) => {
    setDate(picked);
    hideDatePicker();
  };

  const onSave = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Validation', 'Title and amount are required.');
      return;
    }

    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        Alert.alert('Validation', 'Please enter a valid amount');
        return;
      }

      await addExpense({
        title: title.trim(),
        amount: numericAmount,
        date: date.toISOString().split('T')[0],
        category,
        paymentMethod,
      });
      router.back();
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  const handleAddCustomCategory = async (name: string): Promise<void> => {
    try {
      await addCustomCategory(name);
      setCategory(name);
      // Remove the return statement since we're not using the returned value
    } catch (error) {
      console.error('Error adding custom category:', error);
      Alert.alert('Error', 'Failed to add custom category. Please try again.');
      throw error; // Re-throw to let the CategoryPicker handle the error
    }
  };

  if (isLoadingCategories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Groceries"
      />
      
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
      
      <CategoryPicker
        categories={categories.map(cat => cat.name)}
        selectedCategory={category}
        onCategoryChange={setCategory}
        onAddCustomCategory={handleAddCustomCategory}
      />
      
      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={setPaymentMethod}
          style={styles.picker}
        >
          <Picker.Item label="Cash" value="Cash" />
          <Picker.Item label="Debit Card" value="Debit Card" />
          <Picker.Item label="Credit Card" value="Credit Card" />
          <Picker.Item label="UPI" value="UPI" />
        </Picker>
      </View>
      
      <Button 
        title={isSaving ? 'Saving...' : 'Add Expense'} 
        onPress={onSave} 
        disabled={isSaving}
      />
      
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  container: { 
    flex: 1, 
    padding: 16 
  },
  label: { 
    marginTop: 12, 
    marginBottom: 4, 
    fontWeight: '500' 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  dateButtonText: {
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: { 
    height: 44 
  },
});
