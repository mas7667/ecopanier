import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InventoryItem } from '../types';

interface ItemCardProps {
  item: InventoryItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
        {item.status === 'urgent' && (
          <View style={styles.urgentBadge}>
            <Text style={styles.badgeText}>Urgent</Text>
          </View>
        )}
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.dateContainer}>
        <Ionicons name="alert-circle" size={14} color="#dc2626" />
        <Text style={styles.date}>{item.expiryDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  urgentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fecaca',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#dc2626',
    fontWeight: '600',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    padding: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
});

export default ItemCard;
