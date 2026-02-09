import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  selected = false,
  icon,
  style,
  textStyle,
}) => {
  const { isDarkMode } = useTheme();

  const chipStyle: ViewStyle = {
    ...styles.chip,
    backgroundColor: selected
      ? '#4CAF50'
      : isDarkMode
      ? '#333'
      : '#f5f5f5',
  };

  const chipTextStyle: TextStyle = {
    ...styles.text,
    color: selected
      ? '#fff'
      : isDarkMode
      ? '#fff'
      : '#333',
  };

  return (
    <TouchableOpacity
      style={[chipStyle, style]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      {icon && icon}
      <Text style={[chipTextStyle, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
