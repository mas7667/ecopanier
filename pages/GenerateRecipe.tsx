import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { InventoryItem, Recipe } from '../types';
import { spoonacularService } from '../services/SpoonacularService';
import { RecipeCard } from '../components/features/recipes/RecipeCard';
import RecipeDetail from './RecipeDetail';

interface GenerateRecipeProps {
  inventory: InventoryItem[];
  onBack: () => void;
  onRecipesGenerated?: (recipes: Recipe[]) => void;
}

const GenerateRecipe: React.FC<GenerateRecipeProps> = ({ inventory, onBack, onRecipesGenerated }) => {
  const { isDarkMode } = useAppContext();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Si une recette est sélectionnée, afficher la page de détail
  if (selectedRecipe) {
    return (
      <RecipeDetail 
        recipe={selectedRecipe} 
        onBack={() => setSelectedRecipe(null)} 
      />
    );
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems.length === inventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inventory.map(item => item.id));
    }
  };

  const handleGenerate = async () => {
    const selectedIngredients = inventory
      .filter(item => selectedItems.includes(item.id))
      .map(item => item.name);
    
    if (selectedIngredients.length === 0) {
      Alert.alert('Aucun ingrédient', 'Veuillez sélectionner au moins un ingrédient');
      return;
    }

    setIsGenerating(true);

    try {
      // Rechercher des recettes avec Spoonacular
      const spoonacularRecipes = await spoonacularService.searchByIngredients(selectedIngredients);

      console.log('Recettes Spoonacular (objets):', spoonacularRecipes);
      
      if (spoonacularRecipes.length === 0) {
        setIsGenerating(false);
        Alert.alert('Aucune recette', 'Aucune recette trouvée avec ces ingrédients');
        return;
      }

      // Afficher les recettes brutes en JSON pour debug
      console.log('Recettes Spoonacular (JSON brut):', JSON.stringify(spoonacularRecipes, null, 2));

      // Récupérer les détails des 3 premières recettes une par une
      const recipes: Recipe[] = [];
      
      for (const r of spoonacularRecipes.slice(0, 3)) {
        try {
          console.log(`Fetching details for recipe ${r.id}...`);
          const details = await spoonacularService.getRecipeById(r.id);
          console.log(`Details for ${r.id}:`, JSON.stringify(details, null, 2));
          
          recipes.push({
        id: `spoon-${r.id}`,
        name: details.title,
        description: details.summary,
        image: details.image,
        prepTime: details.readyInMinutes || 30,
        servings: details.servings,
        difficulty: 'Moyen' as const,
        ingredients: details.ingredients,
        steps: details.instructions ? details.instructions.split('\n').filter(s => s.trim()) : [],
        availableIngredients: r.usedIngredients?.length || 0,
        totalIngredients: (r.usedIngredients?.length || 0) + (r.missedIngredients?.length || 0),
        isSuggested: true,
          });
        } catch (detailError) {
          console.error(`Erreur pour la recette ${r.id}:`, detailError);
        }
      }

      setIsGenerating(false);
      
      // Stocker les recettes générées
      setGeneratedRecipes(recipes);
      
      // Retourner les recettes générées
      if (onRecipesGenerated) {
        onRecipesGenerated(recipes);
      }
      
      Alert.alert(
        'Recettes générées !',
        `${recipes.length} recette${recipes.length > 1 ? 's' : ''} trouvée${recipes.length > 1 ? 's' : ''}.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      setIsGenerating(false);
      console.error('Erreur lors de la génération:', error);
      Alert.alert(
        'Erreur',
        'Impossible de générer des recettes. Vérifiez votre connexion et réessayez.'
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return '#ef4444';
      case 'soon': return '#f59e0b';
      default: return '#22c55e';
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>Générer une recette</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Selection Header */}
      <View style={[styles.selectionHeader, isDarkMode && styles.darkSelectionHeader]}>
        <Text style={[styles.selectionText, isDarkMode && styles.darkSelectionText]}>
          {selectedItems.length} ingrédient{selectedItems.length > 1 ? 's' : ''} sélectionné{selectedItems.length > 1 ? 's' : ''}
        </Text>
        <TouchableOpacity onPress={selectAll}>
          <Text style={styles.selectAllText}>
            {selectedItems.length === inventory.length ? 'Tout désélectionner' : 'Tout sélectionner'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Empty State */}
      {inventory.length === 0 ? (
        <View style={styles.emptyContent}>
          <Ionicons name="basket-outline" size={80} color={isDarkMode ? '#374151' : '#e5e7eb'} />
          <Text style={[styles.emptyTitle, isDarkMode && styles.darkTitle]}>
            Inventaire vide
          </Text>
          <Text style={[styles.emptySubtitle, isDarkMode && styles.darkSubtitle]}>
            Ajoutez des ingrédients à votre inventaire pour générer des recettes
          </Text>
        </View>
      ) : generatedRecipes.length > 0 ? (
        /* Affichage des recettes générées */
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.recipesContent}>
          <View style={styles.recipesHeader}>
            <Ionicons name="sparkles" size={24} color="#22c55e" />
            <Text style={[styles.recipesTitle, isDarkMode && styles.darkTitle]}>
              Recettes trouvées
            </Text>
          </View>
          <Text style={[styles.recipesSubtitle, isDarkMode && styles.darkSubtitle]}>
            {generatedRecipes.length} recette{generatedRecipes.length > 1 ? 's' : ''} basée{generatedRecipes.length > 1 ? 's' : ''} sur vos ingrédients
          </Text>
          
          {generatedRecipes.map(recipe => (
            <View key={recipe.id} style={styles.recipeCardWrapper}>
              <RecipeCard 
                recipe={recipe} 
                onPress={() => setSelectedRecipe(recipe)}
              />
            </View>
          ))}

          <TouchableOpacity 
            style={[styles.newSearchButton, isDarkMode && styles.darkNewSearchButton]}
            onPress={() => {
              setGeneratedRecipes([]);
              setSelectedItems([]);
            }}
          >
            <Ionicons name="refresh" size={20} color={isDarkMode ? '#fff' : '#111827'} />
            <Text style={[styles.newSearchText, isDarkMode && styles.darkNewSearchText]}>
              Nouvelle recherche
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        /* Ingredients List - 2 colonnes */
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {inventory.map(item => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.itemCard,
                    isDarkMode && styles.darkItemCard,
                    isSelected && styles.selectedCard,
                    isSelected && isDarkMode && styles.darkSelectedCard,
                  ]}
                  onPress={() => toggleItemSelection(item.id)}
                  activeOpacity={0.7}
                >
                  {/* Checkbox en haut à droite */}
                  <View style={styles.checkboxContainer}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                  </View>
                  
                  {/* Ligne 1: Nom */}
                  <Text style={[styles.itemName, isDarkMode && styles.darkItemName]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  
                  {/* Ligne 2: Détails et Badge */}
                  <View style={styles.itemInfoRow}>
                    <Text style={[styles.itemDetails, isDarkMode && styles.darkItemDetails]} numberOfLines={1}>
                      {item.quantity} {item.unit}
                    </Text>

                    {/* Badge de statut */}
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.daysUntilExpiry}j
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* Generate Button */}
      {inventory.length > 0 && generatedRecipes.length === 0 && (
        <View style={[styles.footer, isDarkMode && styles.darkFooter]}>
          <TouchableOpacity
            style={[
              styles.generateButton,
              (selectedItems.length === 0 || isGenerating) && styles.generateButtonDisabled,
            ]}
            onPress={handleGenerate}
            disabled={selectedItems.length === 0 || isGenerating}
          >
            {isGenerating ? (
              <>
                <ActivityIndicator color="#fff" />
                <Text style={styles.generateButtonText}>Génération en cours...</Text>
              </>
            ) : (
              <>
                <Ionicons name="sparkles" size={20} color="#fff" />
                <Text style={styles.generateButtonText}>Générer des recettes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  darkHeader: {
    borderBottomColor: '#374151',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  darkHeaderTitle: {
    color: '#fff',
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  darkSelectionHeader: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  selectionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  darkSelectionText: {
    color: '#9ca3af',
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  recipesContent: {
    padding: 16,
  },
  recipesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  recipesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  recipesSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  recipeCardWrapper: {
    marginBottom: 16,
  },
  newSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  darkNewSearchButton: {
    backgroundColor: '#374151',
  },
  newSearchText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  darkNewSearchText: {
    color: '#fff',
  },
  itemCard: {
    width: '48.5%',
    marginBottom: 12,
    marginHorizontal: '0.75%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  checkboxContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  darkItemCard: {
    backgroundColor: '#1f2937',
  },
  selectedCard: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  darkSelectedCard: {
    backgroundColor: '#14532d20',
    borderColor: '#22c55e',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    marginBottom: 10,
    marginTop: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  darkItemName: {
    color: '#fff',
  },
  itemInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemDetails: {
    fontSize: 13,
    color: '#6b7280',
  },
  darkItemDetails: {
    color: '#9ca3af',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 24,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  darkTitle: {
    color: '#fff',
  },
  darkSubtitle: {
    color: '#9ca3af',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  darkFooter: {
    backgroundColor: '#1f2937',
    borderTopColor: '#374151',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default GenerateRecipe;
