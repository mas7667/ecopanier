import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../ui';
import { useTheme } from '../../../hooks/useTheme';

interface AIRecipeGeneratorProps {
  inventoryCount: number;
  onGenerate: () => void;
  loading?: boolean;
}

export const AIRecipeGenerator: React.FC<AIRecipeGeneratorProps> = ({
  inventoryCount,
  onGenerate,
  loading = false,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={24} color="#4CAF50" />
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>Chef IA</Text>
      </View>
      
      <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>
        Générez une recette unique basée sur vos {inventoryCount} ingrédients disponibles.
      </Text>
      
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onGenerate}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Ionicons name="restaurant-outline" size={18} color="#fff" />
            <Text style={styles.buttonText}>Générer une recette</Text>
          </>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  titleDark: {
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  descriptionDark: {
    color: '#aaa',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
