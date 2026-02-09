import React, { ReactNode } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type IconButtonSize = 'small' | 'medium' | 'large';
type IconButtonVariant = 'default' | 'primary' | 'danger';

interface IconButtonProps {
  icon: ReactNode;
  onPress: () => void;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
  disabled = false,
  style,
}) => {
  const { isDarkMode } = useTheme();

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32 };
      case 'medium':
        return { width: 40, height: 40 };
      case 'large':
        return { width: 48, height: 48 };
      default:
        return { width: 40, height: 40 };
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDarkMode ? '#4CAF50' : '#4CAF50',
        };
      case 'danger':
        return {
          backgroundColor: isDarkMode ? '#c62828' : '#f44336',
        };
      case 'default':
      default:
        return {
          backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyle(),
        getVariantStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
