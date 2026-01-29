import React, { createContext, useState, ReactNode } from 'react';

interface AppContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  return (
    <AppContext.Provider value={{ isDarkMode, setIsDarkMode, language, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
