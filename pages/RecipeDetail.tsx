import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack }) => {
  const { isDarkMode } = useAppContext();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'facile':
        return '#22c55e';
      case 'moyen':
        return '#f59e0b';
      case 'difficile':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header avec image */}
      <View style={styles.imageContainer}>
        {recipe.image && (
          <Image source={{ uri: recipe.image }} style={styles.headerImage} />
        )}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.imageOverlay} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Titre et meta */}
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.darkTitle]}>
            {recipe.name}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={18} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Text style={[styles.metaText, isDarkMode && styles.darkMetaText]}>
                {recipe.prepTime} min
              </Text>
            </View>
            {recipe.servings && (
              <>
                <Text style={[styles.dot, isDarkMode && styles.darkDot]}>•</Text>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={18} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
                  <Text style={[styles.metaText, isDarkMode && styles.darkMetaText]}>
                    {recipe.servings} pers.
                  </Text>
                </View>
              </>
            )}
            <Text style={[styles.dot, isDarkMode && styles.darkDot]}>•</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
              <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
            </View>
          </View>

          {/* Compatibilité */}
          {recipe.totalIngredients && (
            <View style={[styles.compatibilityCard, isDarkMode && styles.darkCompatibilityCard]}>
              <View style={styles.compatibilityHeader}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={[styles.compatibilityText, isDarkMode && styles.darkCompatibilityText]}>
                  {recipe.availableIngredients} / {recipe.totalIngredients} ingrédients disponibles
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.round((recipe.availableIngredients! / recipe.totalIngredients) * 100)}%` }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>

        {/* Description */}
        {recipe.description && (
          <View style={styles.section}>
            <Text style={[styles.description, isDarkMode && styles.darkDescription]}>
              {recipe.description}
            </Text>
          </View>
        )}

        {/* Ingrédients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={22} color={isDarkMode ? '#fff' : '#111827'} />
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
              Ingrédients
            </Text>
          </View>
          <View style={[styles.ingredientsCard, isDarkMode && styles.darkIngredientsCard]}>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <View style={styles.bullet} />
                  <Text style={[styles.ingredientText, isDarkMode && styles.darkIngredientText]}>
                    {ingredient}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[styles.noDataText, isDarkMode && styles.darkNoDataText]}>
                Aucun ingrédient disponible
              </Text>
            )}
          </View>
        </View>

        {/* Étapes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="clipboard" size={22} color={isDarkMode ? '#fff' : '#111827'} />
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>
              Étapes
            </Text>
          </View>
          {recipe.steps && recipe.steps.length > 0 ? (
            recipe.steps.map((step, index) => (
              <View key={index} style={[styles.stepCard, isDarkMode && styles.darkStepCard]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={[styles.stepText, isDarkMode && styles.darkStepText]}>
                  {step}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.noDataText, isDarkMode && styles.darkNoDataText]}>
              Aucune étape disponible
            </Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  darkTitle: {
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
    color: '#6b7280',
  },
  darkMetaText: {
    color: '#9ca3af',
  },
  dot: {
    fontSize: 16,
    color: '#6b7280',
  },
  darkDot: {
    color: '#9ca3af',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  compatibilityCard: {
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  darkCompatibilityCard: {
    backgroundColor: '#14532d20',
    borderColor: '#22c55e40',
  },
  compatibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  compatibilityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803d',
  },
  darkCompatibilityText: {
    color: '#22c55e',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#d1d5db',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  darkSectionTitle: {
    color: '#fff',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
  },
  darkDescription: {
    color: '#9ca3af',
  },
  ingredientsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  darkIngredientsCard: {
    backgroundColor: '#1f2937',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 12,
    marginTop: 7,
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    lineHeight: 20,
  },
  darkIngredientText: {
    color: '#fff',
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  darkStepCard: {
    backgroundColor: '#1f2937',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#111827',
  },
  darkStepText: {
    color: '#fff',
  },
  noDataText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  darkNoDataText: {
    color: '#6b7280',
  },
});

export default RecipeDetail;
