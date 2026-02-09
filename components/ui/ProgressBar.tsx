import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color = '#4CAF50',
  backgroundColor,
  showLabel = false,
  label,
  style,
}) => {
  const { isDarkMode } = useTheme();

  const clampedProgress = Math.max(0, Math.min(100, progress));
  const bgColor = backgroundColor || (isDarkMode ? '#333' : '#e0e0e0');

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          {label || `${Math.round(clampedProgress)}%`}
        </Text>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: bgColor,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  labelDark: {
    color: '#fff',
  },
  track: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
});
