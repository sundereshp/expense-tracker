// app/(tabs)/_layout.tsx
// FIXED: Clean tabs layout - let tabs handle their own headers
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home' 
        }} 
      />
      <Tabs.Screen 
        name="calendar" 
        options={{ 
          title: 'Calendar' 
        }} 
      />
    </Tabs>
  );
}
