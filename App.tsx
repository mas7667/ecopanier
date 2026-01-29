import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import Settings from './pages/Settings';
import { appStyles as styles } from './styles/appStyles';
import { ViewState, InventoryItem } from './types';
import { MOCK_INVENTORY } from './constants';

const AppContent: React.FC = () => {
  const { isDarkMode } = useAppContext();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);

  const handleAddItem = (item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
  };

  const handleDeleteItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={(view) => setCurrentView(view)} 
            inventory={inventory}
          />
        );
      case 'inventory':
        return (
          <Inventory 
            inventory={inventory} 
            onAdd={handleAddItem} 
            onDelete={handleDeleteItem} 
          />
        );
      case 'recipes':
        return (
          <Recipes 
            inventory={inventory} 
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return (
          <Dashboard 
            onNavigate={(view) => setCurrentView(view)} 
            inventory={inventory}
          />
        );
    }
  };

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#111827' : '#f9fafb'} 
        translucent={false}
      />
      <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#111827' }]}>
        <View style={styles.content}>
          {renderView()}
        </View>
        <Navbar currentView={currentView} onChangeView={setCurrentView} />
      </SafeAreaView>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;