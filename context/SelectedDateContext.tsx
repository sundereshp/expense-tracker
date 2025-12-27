import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectedDateContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

const SelectedDateContext = createContext<SelectedDateContextType | undefined>(undefined);

export function SelectedDateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  });

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateContext.Provider>
  );
}

export function useSelectedDate() {
  const context = useContext(SelectedDateContext);
  if (context === undefined) {
    throw new Error('useSelectedDate must be used within a SelectedDateProvider');
  }
  return context;
}