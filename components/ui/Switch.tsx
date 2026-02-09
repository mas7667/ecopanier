import React from 'react';
import { Switch as RNSwitch, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  label,
  disabled = false,
  style,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          {label}
        </Text>
      )}
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: isDarkMode ? '#555' : '#d1d1d1',
          true: '#81c784',
        }}
        thumbColor={value ? '#4CAF50' : '#f4f3f4'}
        ios_backgroundColor={isDarkMode ? '#555' : '#d1d1d1'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  labelDark: {
    color: '#fff',
  },
});
