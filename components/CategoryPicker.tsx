// src/components/CategoryPicker.tsx
// FIXED: No hooks during render - use passed categories prop
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface CategoryPickerProps {
  categories: string[]; // Pass categories as prop instead of using hook
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onAddCustomCategory?: (name: string) => Promise<void>; // Optional
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onAddCustomCategory,
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCustom = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Category name is required');
      return;
    }
    
    if (onAddCustomCategory) {
      try {
        await onAddCustomCategory(newCategoryName.trim());
        setIsAddingCustom(false);
        setNewCategoryName('');
      } catch (error) {
        Alert.alert('Error', 'Failed to add category');
      }
    }
  };

  const pickerValue = selectedCategory && categories.includes(selectedCategory) 
    ? selectedCategory 
    : 'NONE';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={pickerValue}
          onValueChange={(value) => {
            if (value === 'ADD_NEW') {
              setIsAddingCustom(true);
            } else {
              onCategoryChange(value === 'NONE' ? null : value);
              setIsAddingCustom(false);
            }
          }}
        >
          <Picker.Item label="None" value="NONE" />
          {categories.map((category) => (
            <Picker.Item 
              key={category} 
              label={category} 
              value={category} 
            />
          ))}
          {onAddCustomCategory && <Picker.Item label="+ Add Custom" value="ADD_NEW" />}
        </Picker>
      </View>

      {isAddingCustom && (
        <View style={styles.customContainer}>
          <TextInput
            style={styles.customInput}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            placeholder="Enter custom category"
            autoFocus
          />
          <View style={styles.buttonRow}>
            <Button 
              title="Cancel" 
              onPress={() => {
                setIsAddingCustom(false);
                setNewCategoryName('');
              }} 
            />
            <Button title="Add" onPress={handleAddCustom} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  label: { marginBottom: 4, fontWeight: '500' },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  customContainer: { marginTop: 8, padding: 8, backgroundColor: '#f8f9fa', borderRadius: 8 },
  customInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end' },
});
