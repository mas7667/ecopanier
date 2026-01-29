import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  backgroundColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, backgroundColor }) => {
  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default StatCard;
