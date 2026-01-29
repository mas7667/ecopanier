import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  appName?: string;
  onAddPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ appName = 'EcoManger', onAddPress }) => {
  const { isDarkMode } = useAppContext();

  return (
    <View style={[styles.header, isDarkMode && styles.darkHeader]}>
      <View style={styles.headerLeft}>
        <View style={[styles.logo, isDarkMode && styles.darkLogo]}>
          <Ionicons name="leaf" size={24} color="#00C8B4" />
        </View>
        <Text style={[styles.appName, isDarkMode && styles.darkAppName]}>{appName}</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={[styles.addButton, isDarkMode && styles.darkAddButton]} onPress={onAddPress}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, isDarkMode && styles.darkAddButton]} onPress={onAddPress}>
          <Ionicons name="barcode-outline" size={24} color="#00C8B4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  darkHeader: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Header right section
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#e0f7f4',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkLogo: {
    backgroundColor: '#0d6e68',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  darkAppName: {
    color: '#fff',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkAddButton: {
    backgroundColor: '#374151',
  },
  addButtonText: {
    color: '#00C8B4',
    fontSize: 28,
    fontWeight: '600',
  },
});

export default Header;
