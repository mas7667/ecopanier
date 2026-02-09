import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge } from '../../ui';
import { useTheme } from '../../../hooks/useTheme';
import { InventoryItem } from '../../../types';

interface InventoryCardProps {
  item: InventoryItem;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({
  item,
  onPress,
  onEdit,
  onDelete,
  showActions = false,
  compact = false,
}) => {
  const { isDarkMode } = useTheme();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'danger';
      case 'soon':
        return 'warning';
      case 'good':
        return 'success';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'urgent':
        return 'Urgent';
      case 'soon':
        return 'Bientôt';
      case 'good':
        return 'Bon';
      default:
        return status;
    }
  };

  if (compact) {
    return (
      <Card variant="elevated" onPress={onPress} style={styles.compactCard} padding={0}>
        <View style={styles.compactImageContainer}>
          <Image source={{ uri: item.image }} style={styles.compactImage} />
          {item.status === 'urgent' && (
            <View style={styles.urgentBadgeOverlay}>
              <Badge label="Urgent" variant="danger" size="small" />
            </View>
          )}
        </View>
        <View style={styles.compactContent}>
          <Text style={[styles.compactName, isDarkMode && styles.compactNameDark]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={item.status === 'urgent' ? '#f44336' : '#666'}
            />
            <Text
              style={[
                styles.compactDate,
                item.status === 'urgent' && styles.urgentDate,
                isDarkMode && styles.compactDateDark,
              ]}
            >
              {item.expiryDate}
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="elevated" onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.statusBadge}>
          <Badge
            label={getStatusLabel(item.status)}
            variant={getStatusVariant(item.status)}
            size="small"
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, isDarkMode && styles.nameDark]}>
          {item.name}
        </Text>
        <Text style={[styles.category, isDarkMode && styles.categoryDark]}>
          {item.category}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color={isDarkMode ? '#aaa' : '#666'} />
            <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
              {item.expiryDate}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cube-outline" size={16} color={isDarkMode ? '#aaa' : '#666'} />
            <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
              {item.quantity} {item.unit}
            </Text>
          </View>
        </View>

        {showActions && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                <Ionicons name="create-outline" size={20} color="#4CAF50" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <Ionicons name="trash-outline" size={20} color="#f44336" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  compactCard: {
    width: 160,
    marginRight: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
  },
  compactImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  compactImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  urgentBadgeOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  content: {
    padding: 16,
  },
  compactContent: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  nameDark: {
    color: '#fff',
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  compactNameDark: {
    color: '#fff',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  categoryDark: {
    color: '#aaa',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
  infoTextDark: {
    color: '#aaa',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactDate: {
    fontSize: 12,
    color: '#666',
  },
  compactDateDark: {
    color: '#aaa',
  },
  urgentDate: {
    color: '#f44336',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
