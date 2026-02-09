import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const { isDarkMode } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[`button_${size}`],
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Styles par variante
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#4CAF50',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: isDarkMode ? '#444' : '#e0e0e0',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: '#f44336',
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: isDarkMode ? '#4CAF50' : '#4CAF50',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.text,
      ...styles[`text_${size}`],
    };

    // Couleur du texte selon variante
    switch (variant) {
      case 'primary':
      case 'danger':
        return { ...baseTextStyle, color: '#fff' };
      case 'secondary':
        return { ...baseTextStyle, color: isDarkMode ? '#fff' : '#333' };
      case 'outline':
      case 'ghost':
        return { ...baseTextStyle, color: isDarkMode ? '#4CAF50' : '#4CAF50' };
      default:
        return baseTextStyle;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#fff' : '#4CAF50'}
          size={size === 'small' ? 'small' : 'large'}
        />
      ) : (
        <>
          {icon && icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: 8,
  },
  button_small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  button_medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  button_large: {
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  text: {
    fontWeight: '600',
  },
  text_small: {
    fontSize: 12,
  },
  text_medium: {
    fontSize: 14,
  },
  text_large: {
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
