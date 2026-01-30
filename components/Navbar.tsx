import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n/translations';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onChangeView }) => {
  const { isDarkMode, language } = useAppContext();
  const t = translations[language];

  const navItems: Array<{ id: ViewState; label: string; icon: string }> = [
    { id: 'dashboard', label: t.home, icon: 'home' },
    { id: 'inventory', label: t.inventory, icon: 'list' },
    { id: 'scan', label: t.scan, icon: 'barcode-outline' },
    { id: 'recipes', label: t.recipes, icon: 'restaurant' },
    { id: 'settings', label: t.settings, icon: 'settings' },
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.content}>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onChangeView(item.id)}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                 <Ionicons name={item.icon as any} size={24} color={isActive ? '#00C8B4' : '#9ca3af'} />
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  darkContainer: {
    backgroundColor: '#1f2937',
    borderTopColor: '#374151',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    marginBottom: 4,
    padding: 6,
    borderRadius: 12,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(0, 200, 180, 0.1)',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9ca3af',
  },
  activeLabel: {
    color: '#00C8B4',
    fontWeight: '700',
  },
});

export default Navbar;