import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  spacing?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  spacing = 16,
  style,
}) => {
  const { isDarkMode } = useTheme();

  const dividerStyle: ViewStyle = {
    backgroundColor: isDarkMode ? '#444' : '#e0e0e0',
    ...(orientation === 'horizontal'
      ? {
          height: thickness,
          marginVertical: spacing,
        }
      : {
          width: thickness,
          marginHorizontal: spacing,
        }),
  };

  return <View style={[dividerStyle, style]} />;
};
