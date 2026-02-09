import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SectionProps {
  title?: string;
  children: ReactNode;
  headerRight?: ReactNode;
  spacing?: number;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  headerRight,
  spacing = 16,
  style,
  titleStyle,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: spacing }, style]}>
      {(title || headerRight) && (
        <View style={styles.header}>
          {title && (
            <Text
              style={[
                styles.title,
                isDarkMode && styles.titleDark,
                titleStyle,
              ]}
            >
              {title}
            </Text>
          )}
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  headerRight: {
    marginLeft: 12,
  },
  content: {
    // Content container
  },
});
