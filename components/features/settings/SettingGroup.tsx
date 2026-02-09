import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../ui';
import { useTheme } from '../../../hooks/useTheme';

interface SettingItemData {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  showArrow?: boolean;
  onPress?: () => void;
}

interface SettingGroupProps {
  title?: string;
  items: SettingItemData[];
  style?: ViewStyle;
}

export const SettingGroup: React.FC<SettingGroupProps> = ({
  title,
  items,
  style,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {title && (
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          {title}
        </Text>
      )}
      <Card padding={0} variant="elevated">
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.item,
              index < items.length - 1 && styles.itemBorder,
              isDarkMode && index < items.length - 1 && styles.itemBorderDark,
            ]}
            onPress={item.onPress}
            disabled={!item.onPress}
            activeOpacity={item.onPress ? 0.7 : 1}
          >
            <View style={styles.itemLeft}>
              <View
                style={[
                  styles.iconContainer,
                  isDarkMode ? styles.iconContainerDark : styles.iconContainerLight,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isDarkMode ? '#4CAF50' : '#4CAF50'}
                />
              </View>
              <Text style={[styles.label, isDarkMode && styles.labelDark]}>
                {item.label}
              </Text>
            </View>
            <View style={styles.itemRight}>
              {item.value && (
                <Text style={[styles.value, isDarkMode && styles.valueDark]}>
                  {item.value}
                </Text>
              )}
              {item.showArrow && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDarkMode ? '#666' : '#999'}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  titleDark: {
    color: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemBorderDark: {
    borderBottomColor: '#333',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerLight: {
    backgroundColor: '#f0f9ff',
  },
  iconContainerDark: {
    backgroundColor: '#1e3a2e',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  labelDark: {
    color: '#fff',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
  valueDark: {
    color: '#aaa',
  },
});
