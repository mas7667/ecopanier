/**
 * Exemple de page Recipes utilisant les nouveaux composants réutilisables
 * 
 * Cette page démontre l'utilisation des composants recipes refactorisés
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import des composants réutilisables
import {
  Screen,
  Section,
  TabBar,
  AIRecipeGenerator,
  RecipeCard,
  RecipeModal,
} from '../components';

import { MOCK_RECIPES } from '../constants';
import { generateRecipeSuggestion } from '../services/geminiService';
import { RecipesProps, Recipe } from '../types';

const RecipesRefactored: React.FC<RecipesProps> = ({ inventory }) => {
  const [activeTab, setActiveTab] = useState<'suggested' | 'all'>('suggested');
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const displayedRecipes = activeTab === 'suggested' 
    ? MOCK_RECIPES.filter(r => r.isSuggested) 
    : MOCK_RECIPES;

  const handleGenerateAI = async () => {
    if (inventory.length === 0) {
      Alert.alert("Inventaire vide", "Ajoutez des ingrédients pour générer une recette.");
      return;
    }

    setLoadingAI(true);
    try {
      const result = await generateRecipeSuggestion(inventory);
      const newRecipe: Recipe = {
        id: 'ai-' + Date.now(),
        name: result.name,
        description: result.description,
        prepTime: result.prepTime,
        difficulty: result.difficulty as any,
        ingredients: result.ingredientsUsed || [],
        steps: result.steps || [],
        image: 'https://picsum.photos/600/400?grayscale',
        availableIngredients: 0,
        totalIngredients: 0,
        isSuggested: true
      };
      setSelectedRecipe(newRecipe);
      setModalVisible(true);
    } catch (e) {
      // Fallback demo
      setTimeout(() => {
        const demoRecipe: Recipe = {
          id: 'demo-1',
          name: "Poêlée 'Vide-Frigo'",
          description: "Une recette générée pour utiliser vos restes de " + inventory[0]?.name,
          prepTime: 20,
          difficulty: 'Facile',
          ingredients: [inventory[0]?.name || 'Légumes', 'Huile', 'Sel', 'Poivre'],
          steps: ['Couper tout', 'Cuire 20 min', 'Servir chaud'],
          image: 'https://picsum.photos/seed/demo/600/400',
          isSuggested: true
        };
        setSelectedRecipe(demoRecipe);
        setModalVisible(true);
      }, 1500);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <Screen title="Recettes" scrollable>
      <View style={styles.content}>
        <Section>
          {/* Tabs */}
          <TabBar
            tabs={[
              { 
                id: 'suggested', 
                label: 'Suggérées',
                icon: <Ionicons name="sparkles" size={14} color="#fff" />
              },
              { id: 'all', label: 'Toutes' }
            ]}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as 'suggested' | 'all')}
          />
        </Section>

        {/* AI Generator - Uniquement pour l'onglet suggérées */}
        {activeTab === 'suggested' && (
          <AIRecipeGenerator
            inventoryCount={inventory.length}
            onGenerate={handleGenerateAI}
            loading={loadingAI}
          />
        )}

        {/* Liste des recettes */}
        <Section>
          {displayedRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => {
                setSelectedRecipe(recipe);
                setModalVisible(true);
              }}
            />
          ))}
        </Section>
      </View>

      {/* Modal détail recette */}
      <RecipeModal
        visible={modalVisible}
        recipe={selectedRecipe}
        onClose={() => setModalVisible(false)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});

export default RecipesRefactored;
