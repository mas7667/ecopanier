import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import Header from '../Header';

interface ScreenProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerRight?: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  title,
  showBackButton = false,
  onBackPress,
  headerRight,
  scrollable = true,
  style,
}) => {
  const { isDarkMode } = useTheme();

  const content = (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' },
        style,
      ]}
    >
      {title && (
        <Header
          appName={title}
          onAddPress={showBackButton ? onBackPress : undefined}
          onScanPress={undefined}
        />
      )}
      {scrollable ? (
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </View>
  );

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
