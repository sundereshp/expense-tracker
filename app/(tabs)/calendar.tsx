// app/(tabs)/calendar.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, Button, Pressable } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelectedDate } from '../../context/SelectedDateContext';

export default function CalendarScreen() {
  const router = useRouter();
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date(selectedDate));

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    setSelectedDate(dateString);
    setTempDate(date);
    hideDatePicker();
    // Navigate back to home tab
    router.replace('/(tabs)');
  };

  const handleCancel = () => {
    setTempDate(new Date(selectedDate));
    hideDatePicker();
  };

  const currentDateDisplay = new Date(selectedDate).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date</Text>
      
      <View style={styles.currentDateContainer}>
        <Text style={styles.currentDateLabel}>Currently viewing:</Text>
        <Text style={styles.currentDate}>{currentDateDisplay}</Text>
      </View>
      
      <Pressable style={styles.dateButton} onPress={showDatePicker}>
        <Text style={styles.dateButtonText}>Choose Date</Text>
      </Pressable>
      
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={tempDate}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        maximumDate={new Date()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  currentDateContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  currentDateLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  currentDate: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
  dateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
