import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Badge, ProgressBar } from '../../ui';
import { useTheme } from '../../../hooks/useTheme';
import { Recipe } from '../../../types';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const { isDarkMode } = useTheme();
  
  const compatibility = recipe.totalIngredients
    ? Math.round((recipe.availableIngredients! / recipe.totalIngredients) * 100)
    : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'facile':
        return '#4CAF50';
      case 'moyen':
        return '#FF9800';
      case 'difficile':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Card variant="elevated" style={styles.card} padding={0} onPress={onPress}>
      {/* Image & Badge */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <View style={styles.badgeContainer}>
          <Badge
            label={`${recipe.availableIngredients}/${recipe.totalIngredients} ingrédients`}
            variant="info"
            size="small"
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]} numberOfLines={1}>
          {recipe.name}
        </Text>
        <Text style={[styles.description, isDarkMode && styles.descriptionDark]} numberOfLines={2}>
          {recipe.description}
        </Text>

        {/* Meta Information */}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={isDarkMode ? '#9ca3af' : '#666'} />
            <Text style={[styles.metaText, isDarkMode && styles.metaTextDark]}>
              {recipe.prepTime} min
            </Text>
          </View>
          {recipe.servings && (
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={14} color={isDarkMode ? '#9ca3af' : '#666'} />
              <Text style={[styles.metaText, isDarkMode && styles.metaTextDark]}>
                {recipe.servings} pers.
              </Text>
            </View>
          )}
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
            <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
          </View>
        </View>

        {/* Compatibility Progress */}
        <View style={styles.compatibilitySection}>
          <View style={styles.compatibilityHeader}>
            <Text style={[styles.compatibilityLabel, isDarkMode && styles.compatibilityLabelDark]}>
              Compatibilité
            </Text>
            <Text
              style={[
                styles.compatibilityValue,
                { color: compatibility > 50 ? '#4CAF50' : isDarkMode ? '#9ca3af' : '#666' },
              ]}
            >
              {compatibility}%
            </Text>
          </View>
          <ProgressBar progress={compatibility} height={6} color="#4CAF50" />
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <Ionicons name="heart-outline" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Voir la recette</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  titleDark: {
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  descriptionDark: {
    color: '#aaa',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  metaTextDark: {
    color: '#9ca3af',
  },
  difficultyBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  compatibilitySection: {
    marginBottom: 12,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  compatibilityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  compatibilityLabelDark: {
    color: '#aaa',
  },
  compatibilityValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
