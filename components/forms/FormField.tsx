import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
  helperText?: string;
  style?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  required = false,
  helperText,
  style,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>
      {children}
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
      {helperText && !error && (
        <Text style={[styles.helperText, isDarkMode && styles.helperTextDark]}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  labelDark: {
    color: '#fff',
  },
  required: {
    color: '#f44336',
  },
  error: {
    fontSize: 12,
    color: '#f44336',
    marginTop: 6,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  helperTextDark: {
    color: '#aaa',
  },
});
