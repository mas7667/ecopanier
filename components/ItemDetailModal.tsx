import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InventoryItem } from '../types';
import { useAppContext } from '../context/AppContext';

interface ItemDetailModalProps {
  visible: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onAddToShoppingList?: (item: InventoryItem) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  visible,
  item,
  onClose,
  onAddToShoppingList,
  onEdit,
  onDelete,
}) => {
  const { addToShoppingList } = useAppContext();
  
  if (!item) return null;

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'urgent':
        return { bg: '#fee2e2', text: '#dc2626', label: 'Urgent' };
      case 'soon':
        return { bg: '#fef3c7', text: '#d97706', label: 'Bientôt' };
      case 'safe':
        return { bg: '#d1fae5', text: '#059669', label: 'Sûr' };
      default:
        return { bg: '#f3f4f6', text: '#6b7280', label: 'Unknown' };
    }
  };

  const statusStyle = getStatusColor(item.status);
  const daysLeft = item.daysUntilExpiry;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Détails de l'article</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Image */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View
                style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
              >
                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                  {statusStyle.label}
                </Text>
              </View>
            </View>

            {/* Article Name */}
            <Text style={styles.articleName}>{item.name}</Text>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Catégorie</Text>
                <Text style={styles.detailValue}>{item.category}</Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Quantité</Text>
                <Text style={styles.detailValue}>
                  {item.quantity} {item.unit}
                </Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Date d'expiration</Text>
                <Text style={styles.detailValue}>{item.expiryDate}</Text>
              </View>

              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>Jours restants</Text>
                <Text
                  style={[
                    styles.detailValue,
                    daysLeft <= 3 && styles.urgentText,
                  ]}
                >
                  {daysLeft > 0 ? `${daysLeft} jours` : 'Expiré'}
                </Text>
              </View>
            </View>

            {/* Warning if expiring soon */}
            {daysLeft <= 3 && daysLeft > 0 && (
              <View style={styles.warningBox}>
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text style={styles.warningText}>
                  Cet article expire bientôt !
                </Text>
              </View>
            )}

            {daysLeft <= 0 && (
              <View style={[styles.warningBox, styles.expiredBox]}>
                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                <Text style={styles.warningText}>Cet article est expiré</Text>
              </View>
            )}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={() => {
                addToShoppingList(item);
                if (onAddToShoppingList) onAddToShoppingList(item);
                onClose();
              }}
            >
              <Ionicons name="cart" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Ajouter à la liste</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => {
                onEdit(item);
                onClose();
              }}
            >
              <Ionicons name="create-outline" size={20} color="#3b82f6" />
              <Text style={[styles.buttonText, styles.editText]}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={() => {
                onDelete(item.id);
                onClose();
              }}
            >
              <Ionicons name="trash" size={20} color="#dc2626" />
              <Text style={[styles.buttonText, styles.deleteText]}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  articleName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  detailCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  urgentText: {
    color: '#dc2626',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  expiredBox: {
    backgroundColor: '#fee2e2',
  },
  warningText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    paddingHorizontal: 20,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButton: {
    backgroundColor: '#00C8B4',
  },
  editButton: {
    backgroundColor: '#dbeafe',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  editText: {
    color: '#3b82f6',
  },
  deleteText: {
    color: '#dc2626',
  },
});

export default ItemDetailModal;
