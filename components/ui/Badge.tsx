import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label: string | number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'medium',
  icon,
  style,
  textStyle,
}) => {
  const { isDarkMode } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: isDarkMode ? '#2e7d32' : '#4CAF50',
        };
      case 'warning':
        return {
          backgroundColor: isDarkMode ? '#f57c00' : '#FF9800',
        };
      case 'danger':
        return {
          backgroundColor: isDarkMode ? '#c62828' : '#f44336',
        };
      case 'info':
        return {
          backgroundColor: isDarkMode ? '#1976d2' : '#2196F3',
        };
      case 'neutral':
        return {
          backgroundColor: isDarkMode ? '#424242' : '#9e9e9e',
        };
      default:
        return {};
    }
  };

  const getSizeStyle = (): ViewStyle & TextStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 2,
          paddingHorizontal: 6,
          fontSize: 10,
        };
      case 'medium':
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: 12,
        };
      case 'large':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 14,
        };
      default:
        return {};
    }
  };

  return (
    <View
      style={[
        styles.badge,
        getVariantStyle(),
        {
          paddingVertical: getSizeStyle().paddingVertical,
          paddingHorizontal: getSizeStyle().paddingHorizontal,
        },
        style,
      ]}
    >
      {icon && icon}
      <Text
        style={[
          styles.text,
          { fontSize: getSizeStyle().fontSize },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 4,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});
