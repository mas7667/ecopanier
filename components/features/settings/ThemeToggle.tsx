import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../ui';
import { useTheme } from '../../../hooks/useTheme';

interface ThemeToggleProps {
  onToggle?: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ onToggle }) => {
  const { isDarkMode, setIsDarkMode } = useTheme();

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    onToggle?.();
  };

  return (
    <Card variant="elevated">
      <TouchableOpacity
        style={styles.container}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.left}>
          <View
            style={[
              styles.iconContainer,
              isDarkMode ? styles.iconContainerDark : styles.iconContainerLight,
            ]}
          >
            <Ionicons
              name={isDarkMode ? 'moon' : 'sunny'}
              size={20}
              color={isDarkMode ? '#4CAF50' : '#4CAF50'}
            />
          </View>
          <View>
            <Text style={[styles.label, isDarkMode && styles.labelDark]}>
              Mode sombre
            </Text>
            <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
              {isDarkMode ? 'Activé' : 'Désactivé'}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.toggle,
            isDarkMode ? styles.toggleActive : styles.toggleInactive,
          ]}
        >
          <View
            style={[
              styles.toggleThumb,
              isDarkMode && styles.toggleThumbActive,
            ]}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerLight: {
    backgroundColor: '#fff3e0',
  },
  iconContainerDark: {
    backgroundColor: '#1e3a2e',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  labelDark: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  subtitleDark: {
    color: '#aaa',
  },
  toggle: {
    width: 52,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleInactive: {
    backgroundColor: '#d1d5db',
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
