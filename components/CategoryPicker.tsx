// src/components/CategoryPicker.tsx
// Uses @react-native-picker/picker with a "+ Add new category…" option [web:84][web:95]
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Category } from '../models/Expense';

interface CategoryPickerProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (value: string | null) => void;
  onAddCustomCategory: (name: string) => Promise<string | void>;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCustomCategory,
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const pickerValue = useMemo(() => {
    if (selectedCategory == null) return 'NONE';
    const exists = categories.some((c) => c.name === selectedCategory);
    return exists ? selectedCategory : 'NONE';
  }, [selectedCategory, categories]);

  const handleAddCustom = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    const name = await onAddCustomCategory(trimmed);
    if (name) {
      onSelectCategory(name);
      setNewCategoryName('');
      setIsAddingCustom(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={pickerValue}
          onValueChange={(value) => {
            if (value === 'NONE') {
              onSelectCategory(null);
              setIsAddingCustom(false);
            } else if (value === 'ADD_NEW') {
              setIsAddingCustom(true);
            } else {
              onSelectCategory(value);
              setIsAddingCustom(false);
            }
          }}
        >
          <Picker.Item label="None" value="NONE" />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
          ))}
          <Picker.Item label="+ Add new category…" value="ADD_NEW" />
        </Picker>
      </View>

      {isAddingCustom && (
        <View style={styles.customContainer}>
          <Text style={styles.customLabel}>New category name</Text>
          <TextInput
            style={styles.customInput}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            placeholder="e.g. Petrol"
          />
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrapper}>
              <Button title="Cancel" onPress={() => setIsAddingCustom(false)} />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Add" onPress={handleAddCustom} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 12 },
  label: {
    marginBottom: 4,
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
  },
  customContainer: {
    marginTop: 8,
  },
  customLabel: {
    marginBottom: 4,
    fontSize: 12,
    color: '#555',
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonWrapper: {
    marginLeft: 8,
  },
});
