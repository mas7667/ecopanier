import React, { ReactNode } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...textInputProps
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          isDarkMode ? styles.inputContainerDark : styles.inputContainerLight,
          error && styles.inputContainerError,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            isDarkMode && styles.inputDark,
            style,
          ]}
          placeholderTextColor={isDarkMode ? '#888' : '#999'}
          {...textInputProps}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  labelDark: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  inputContainerLight: {
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
  },
  inputContainerDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
  },
  inputContainerError: {
    borderColor: '#f44336',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  inputDark: {
    color: '#fff',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  error: {
    fontSize: 12,
    color: '#f44336',
    marginTop: 4,
  },
});
