import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from '../../ui';
import { useTheme } from '../../../hooks/useTheme';
import { Recipe } from '../../../types';

interface RecipeModalProps {
  visible: boolean;
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  visible,
  recipe,
  onClose,
}) => {
  const { isDarkMode } = useTheme();

  if (!recipe) return null;

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      showCloseButton={false}
      maxHeight="100%"
      containerStyle={styles.modalContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Meta */}
          <Text style={[styles.title, isDarkMode && styles.titleDark]}>
            {recipe.name}
          </Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={[styles.metaText, isDarkMode && styles.metaTextDark]}>
                {recipe.prepTime} min
              </Text>
            </View>
            {recipe.servings && (
              <>
                <Text style={[styles.dot, isDarkMode && styles.dotDark]}>•</Text>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={18} color="#666" />
                  <Text style={[styles.metaText, isDarkMode && styles.metaTextDark]}>
                    {recipe.servings} pers.
                  </Text>
                </View>
              </>
            )}
            <Text style={[styles.dot, isDarkMode && styles.dotDark]}>•</Text>
            <View style={styles.metaItem}>
              <Ionicons name="restaurant-outline" size={18} color="#666" />
              <Text style={[styles.metaText, isDarkMode && styles.metaTextDark]}>
                {recipe.difficulty}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
            {recipe.description}
          </Text>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
              Ingrédients
            </Text>
            {recipe.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientRow}>
                <View style={styles.bullet} />
                <Text style={[styles.ingredientText, isDarkMode && styles.ingredientTextDark]}>
                  {ingredient}
                </Text>
              </View>
            ))}
          </View>

          {/* Steps Section */}
          {recipe.steps && recipe.steps.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
                Étapes
              </Text>
              {recipe.steps.map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, isDarkMode && styles.stepTextDark]}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 0,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  titleDark: {
    color: '#fff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  metaTextDark: {
    color: '#aaa',
  },
  dot: {
    fontSize: 14,
    color: '#666',
  },
  dotDark: {
    color: '#aaa',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  descriptionDark: {
    color: '#aaa',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  sectionTitleDark: {
    color: '#fff',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  ingredientTextDark: {
    color: '#fff',
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  stepTextDark: {
    color: '#fff',
  },
});
