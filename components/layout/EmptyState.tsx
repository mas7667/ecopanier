import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  action?: React.ReactNode;
  illustration?: any;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  action,
  illustration,
  style,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {illustration ? (
        <Image source={illustration} style={styles.illustration} />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={80}
          color={isDarkMode ? '#666' : '#ccc'}
          style={styles.icon}
        />
      ) : null}

      <Text style={[styles.title, isDarkMode && styles.titleDark]}>
        {title}
      </Text>

      {message && (
        <Text style={[styles.message, isDarkMode && styles.messageDark]}>
          {message}
        </Text>
      )}

      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleDark: {
    color: '#fff',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  messageDark: {
    color: '#aaa',
  },
  action: {
    marginTop: 16,
  },
});
