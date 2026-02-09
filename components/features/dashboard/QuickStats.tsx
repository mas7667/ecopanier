import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Card } from '../../ui';
import { useTheme } from '../../../hooks/useTheme';

interface StatCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  backgroundColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  style?: ViewStyle;
  onPress?: () => void;
}

export const QuickStats: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  backgroundColor,
  trend,
  style,
  onPress,
}) => {
  const { isDarkMode } = useTheme();

  const cardStyle = StyleSheet.flatten([
    styles.card,
    backgroundColor && !isDarkMode && { backgroundColor },
    style,
  ]);

  return (
    <Card
      variant="elevated"
      onPress={onPress}
      style={cardStyle}
      padding={16}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.content}>
        <Text style={[styles.value, isDarkMode && styles.valueDark]}>
          {value}
        </Text>
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          {label}
        </Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Text
              style={[
                styles.trend,
                trend.isPositive ? styles.trendPositive : styles.trendNegative,
              ]}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 120,
  },
  iconContainer: {
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  valueDark: {
    color: '#fff',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  labelDark: {
    color: '#aaa',
  },
  trendContainer: {
    marginTop: 8,
  },
  trend: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendPositive: {
    color: '#4CAF50',
  },
  trendNegative: {
    color: '#f44336',
  },
});
