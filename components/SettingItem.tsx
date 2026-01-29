import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | boolean;
  onToggle?: (value: boolean) => void;
  isToggle?: boolean;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  onToggle,
  isToggle = false,
  onPress,
}) => {
  return (
    <View style={styles.item}>
      <View style={styles.left}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.right}>
        {isToggle ? (
          <Switch
            value={typeof value === 'boolean' ? value : false}
            onValueChange={onToggle}
            thumbColor={typeof value === 'boolean' && value ? '#00C8B4' : '#d1d5db'}
            trackColor={{ false: '#e5e7eb', true: '#ccf0ee' }}
          />
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  right: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default SettingItem;
