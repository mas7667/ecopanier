import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ItemDetailModal from '../components/ItemDetailModal';
import Header from '../components/Header';
import { CATEGORIES } from '../constants';
import { InventoryItem, InventoryProps } from '../types';
import { useAppContext } from '../context/AppContext';

const Inventory: React.FC<InventoryProps> = ({ inventory, onAdd, onDelete }) => {
  const { isDarkMode } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [search, setSearch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // New Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(CATEGORIES[1]);
  const [newItemQuantity, setNewItemQuantity] = useState('1');

  const filteredItems = inventory.filter(item => {
    const matchesCategory = activeCategory === 'Toutes' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'urgent': return { color: '#dc2626', bg: '#fee2e2' };
      case 'soon': return { color: '#d97706', bg: '#fef3c7' };
      case 'safe': return { color: '#059669', bg: '#d1fae5' };
      default: return { color: '#9ca3af', bg: '#f3f4f6' };
    }
  };

  const handleAddItem = () => {
    if (!newItemName) {
      Alert.alert("Erreur", "Le nom est requis");
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: newItemCategory,
      quantity: parseFloat(newItemQuantity) || 1,
      unit: 'unité',
      expiryDate: '2025-01-30', // Mock default expiry
      daysUntilExpiry: 30,
      status: 'safe',
      image: 'https://picsum.photos/200', // Random placeholder
    };

    onAdd(newItem);
    setModalVisible(false);
    setNewItemName('');
    setNewItemQuantity('1');
  };

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const statusStyle = getStatusColor(item.status);
    return (
      <TouchableOpacity
        style={[styles.card, isDarkMode && styles.darkCard]}
        onPress={() => {
          setSelectedItem(item);
          setShowDetailModal(true);
        }}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={[styles.itemName, isDarkMode && styles.darkItemName]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.itemCategory, isDarkMode && styles.darkItemCategory]}>{item.category}</Text>
          <Text style={[styles.itemExpiry, isDarkMode && styles.darkItemExpiry]}>Exp: {item.expiryDate}</Text>
        </View>
        <View style={styles.rightContent}>
          <Text style={[styles.quantity, isDarkMode && styles.darkQuantity]}>{item.quantity} {item.unit}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Header appName="EcoManger" />
      <View style={[styles.headerContent, isDarkMode && styles.darkHeaderContent]}>
        <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
          <Ionicons name="search" size={20} color={isDarkMode ? '#6b7280' : '#9ca3af'} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
            placeholder="Rechercher..."
            placeholderTextColor={isDarkMode ? '#6b7280' : '#9ca3af'}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
             <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.categories}>
          <FlatList
            horizontal
            data={CATEGORIES}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setActiveCategory(item)}
                style={[
                  styles.categoryPill,
                  activeCategory === item && styles.categoryPillActive,
                  isDarkMode && styles.darkCategoryPill,
                  activeCategory === item && isDarkMode && styles.darkCategoryPillActive
                ]}
              >
                <Text style={[
                  styles.categoryText,
                  activeCategory === item && styles.categoryTextActive,
                  isDarkMode && styles.darkCategoryText,
                  activeCategory === item && isDarkMode && styles.darkCategoryTextActive
                ]}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
          />
        </View>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, isDarkMode && styles.darkListContent]}
        ListEmptyComponent={
          <Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>Aucun aliment trouvé</Text>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un produit</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom du produit</Text>
              <TextInput 
                style={styles.input} 
                value={newItemName}
                onChangeText={setNewItemName}
                placeholder="Ex: Pommes"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantité</Text>
              <TextInput 
                style={styles.input} 
                value={newItemQuantity}
                onChangeText={setNewItemQuantity}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>

             <View style={styles.inputGroup}>
              <Text style={styles.label}>Catégorie</Text>
              <View style={styles.categorySelect}>
                {CATEGORIES.slice(1, 5).map(cat => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.catOption, newItemCategory === cat && styles.catOptionActive]}
                    onPress={() => setNewItemCategory(cat)}
                  >
                    <Text style={[styles.catOptionText, newItemCategory === cat && styles.catOptionTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddItem}>
              <Text style={styles.submitBtnText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Item Detail Modal */}
      <ItemDetailModal
        visible={showDetailModal}
        item={selectedItem}
        onClose={() => setShowDetailModal(false)}
        onAddToShoppingList={(item) => {
          Alert.alert('Succès', `${item.name} ajouté à la liste d'épicerie`);
        }}
        onEdit={(item) => {
          Alert.alert('Édition', `Édition de ${item.name} (à implémenter)`);
        }}
        onDelete={(id) => {
          onDelete(id);
          Alert.alert('Succès', 'Article supprimé');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  headerContent: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  darkHeaderContent: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    gap: 8,
  },
  darkSearchContainer: {
    backgroundColor: '#374151',
  },
  searchIcon: {
    marginRight: 0,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#1f2937',
    fontSize: 14,
  },
  darkSearchInput: {
    color: '#fff',
  },
  addBtn: {
    backgroundColor: '#111827',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categories: {
    flexDirection: 'row',
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  darkCategoryPill: {
    backgroundColor: '#374151',
  },
  categoryPillActive: {
    backgroundColor: '#111827',
  },
  darkCategoryPillActive: {
    backgroundColor: '#00C8B4',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  darkCategoryText: {
    color: '#d1d5db',
  },
  categoryTextActive: {
    color: '#fff',
  },
  darkCategoryTextActive: {
    color: '#111827',
  },
  listContent: {
    padding: 16,
  },
  darkListContent: {
    backgroundColor: '#111827',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1f2937',
    shadowOpacity: 0.3,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  darkItemName: {
    color: '#fff',
  },
  itemCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  darkItemCategory: {
    color: '#d1d5db',
  },
  itemExpiry: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  darkItemExpiry: {
    color: '#9ca3af',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  darkQuantity: {
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
  },
  darkEmptyText: {
    color: '#6b7280',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  categorySelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  catOptionActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  catOptionText: {
    fontSize: 12,
    color: '#374151',
  },
  catOptionTextActive: {
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: '#00C8B4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  }
});

export default Inventory;