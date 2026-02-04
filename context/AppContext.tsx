import React, { createContext, useState, ReactNode } from 'react';
import { InventoryItem } from '../types';

interface ShoppingListItem extends InventoryItem {
  addedFromInventory: boolean;
}

interface AppContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  shoppingList: ShoppingListItem[];
  addToShoppingList: (item: InventoryItem) => void;
  removeFromShoppingList: (id: string) => void;
  clearShoppingList: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  const addToShoppingList = (item: InventoryItem) => {
    // Vérifier si l'article n'est pas déjà dans la liste
    if (!shoppingList.find(shopItem => shopItem.id === item.id)) {
      setShoppingList([...shoppingList, { ...item, addedFromInventory: true }]);
    }
  };

  const removeFromShoppingList = (id: string) => {
    setShoppingList(shoppingList.filter(item => item.id !== id));
  };

  const clearShoppingList = () => {
    setShoppingList([]);
  };

  return (
    <AppContext.Provider value={{ 
      isDarkMode, 
      setIsDarkMode, 
      language, 
      setLanguage,
      shoppingList,
      addToShoppingList,
      removeFromShoppingList,
      clearShoppingList
    }}>
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
