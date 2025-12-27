// app/_layout.tsx
// FIXED: Proper root stack + SelectedDateProvider placement
import { Stack } from 'expo-router';
import { SelectedDateProvider } from '../context/SelectedDateContext';

export default function RootLayout() {
  return (
    <SelectedDateProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-expense" options={{ title: 'Add Expense' }} />
        <Stack.Screen name="edit-expense" options={{ title: 'Edit Expense' }} />
      </Stack>
    </SelectedDateProvider>
  );
}
