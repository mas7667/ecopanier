import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  size = 'large',
  style,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size}
        color="#4CAF50"
        style={styles.spinner}
      />
      {message && (
        <Text style={[styles.message, isDarkMode && styles.messageDark]}>
          {message}
        </Text>
      )}
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
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  messageDark: {
    color: '#aaa',
  },
});
