import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

const CATEGORIES = [
  { id: 'fruits', label: 'Fruits', icon: 'leaf' },
  { id: 'vegetables', label: 'Légumes', icon: 'nutrition' },
  { id: 'dairy', label: 'Produits laitiers', icon: 'water' },
  { id: 'meat', label: 'Viandes', icon: 'restaurant' },
  { id: 'fish', label: 'Poissons', icon: 'fish' },
  { id: 'bread', label: 'Pains & Viennoiseries', icon: 'pizza' },
  { id: 'frozen', label: 'Surgelés', icon: 'snow' },
  { id: 'other', label: 'Autres', icon: 'ellipsis-horizontal' },
] as const;

interface CategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
  label?: string;
  placeholder?: string;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Sélectionner une catégorie',
}) => {
  const { isDarkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const selectedCategory = CATEGORIES.find((cat) => cat.id === value);

  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.input,
          isDarkMode ? styles.inputDark : styles.inputLight,
        ]}
        onPress={() => setShowModal(true)}
      >
        {selectedCategory ? (
          <>
            <Ionicons
              name={selectedCategory.icon as any}
              size={20}
              color={isDarkMode ? '#4CAF50' : '#4CAF50'}
            />
            <Text style={[styles.inputText, isDarkMode && styles.inputTextDark]}>
              {selectedCategory.label}
            </Text>
          </>
        ) : (
          <>
            <Ionicons
              name="apps-outline"
              size={20}
              color={isDarkMode ? '#aaa' : '#999'}
            />
            <Text style={[styles.inputText, styles.placeholder]}>
              {placeholder}
            </Text>
          </>
        )}
        <Ionicons
          name="chevron-down"
          size={20}
          color={isDarkMode ? '#aaa' : '#666'}
          style={styles.chevron}
        />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              isDarkMode && styles.modalContentDark,
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.modalTitleDark]}>
                Choisir une catégorie
              </Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={isDarkMode ? '#fff' : '#333'}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.categoriesList}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    value === category.id && styles.categoryItemSelected,
                    isDarkMode && styles.categoryItemDark,
                  ]}
                  onPress={() => handleSelect(category.id)}
                >
                  <View
                    style={[
                      styles.categoryIcon,
                      value === category.id && styles.categoryIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={category.icon as any}
                      size={24}
                      color={value === category.id ? '#fff' : '#4CAF50'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      isDarkMode && styles.categoryLabelDark,
                      value === category.id && styles.categoryLabelSelected,
                    ]}
                  >
                    {category.label}
                  </Text>
                  {value === category.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  labelDark: {
    color: '#fff',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
  },
  inputLight: {
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
  },
  inputDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
  },
  inputText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  inputTextDark: {
    color: '#fff',
  },
  placeholder: {
    color: '#999',
  },
  chevron: {
    marginLeft: 'auto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalContentDark: {
    backgroundColor: '#1e1e1e',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalTitleDark: {
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  categoriesList: {
    padding: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  categoryItemDark: {
    backgroundColor: '#2a2a2a',
  },
  categoryItemSelected: {
    backgroundColor: '#e8f5e9',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIconSelected: {
    backgroundColor: '#4CAF50',
  },
  categoryLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  categoryLabelDark: {
    color: '#fff',
  },
  categoryLabelSelected: {
    fontWeight: '700',
    color: '#4CAF50',
  },
});
