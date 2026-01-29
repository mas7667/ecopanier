import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { MOCK_RECIPES } from '../constants';
import { generateRecipeSuggestion } from '../services/geminiService';
import { RecipesProps, Recipe } from '../types';
import { useAppContext } from '../context/AppContext';

const Recipes: React.FC<RecipesProps> = ({ inventory }) => {
  const { isDarkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'suggested' | 'all'>('suggested');
  const [loadingAI, setLoadingAI] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
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
      // Check for API Key presence (simulate check)
      if (!process.env.API_KEY) {
        throw new Error("API Key missing");
      }
      const result = await generateRecipeSuggestion(inventory);
      const newRecipe: Recipe = {
        id: 'ai-' + Date.now(),
        name: result.name,
        description: result.description,
        prepTime: result.prepTime,
        difficulty: result.difficulty as any,
        ingredients: result.ingredientsUsed || [],
        steps: result.steps || [],
        image: 'https://picsum.photos/600/400?grayscale', // AI placeholder
        availableIngredients: 0,
        totalIngredients: 0,
        isSuggested: true
      };
      setGeneratedRecipe(newRecipe);
      setModalVisible(true);
    } catch (e) {
      console.log("AI Error or Key Missing", e);
      Alert.alert("Info", "La génération IA nécessite une clé API configurée. Mode démo actif.");
      
      // FALLBACK DEMO MOCK
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
        setGeneratedRecipe(demoRecipe);
        setModalVisible(true);
      }, 1500);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Header appName="EcoManger" />
      <ScrollView contentContainerStyle={[styles.content, isDarkMode && styles.darkContent]}>
        <View style={styles.header}>
          <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Recettes</Text>
          <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>Cuisinez avec ce que vous avez</Text>
        </View>

        {/* Tabs */}
        <View style={[styles.tabs, isDarkMode && styles.darkTabs]}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'suggested' && styles.tabActive, isDarkMode && styles.darkTab, activeTab === 'suggested' && isDarkMode && styles.darkTabActive]}
            onPress={() => setActiveTab('suggested')}
          >
            <Ionicons name="sparkles" size={14} color={activeTab === 'suggested' ? '#fff' : isDarkMode ? '#6b7280' : '#6b7280'} />
            <Text style={[styles.tabText, activeTab === 'suggested' && styles.tabTextActive, isDarkMode && styles.darkTabText, activeTab === 'suggested' && isDarkMode && styles.darkTabTextActive]}>Suggérées</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.tabActive, isDarkMode && styles.darkTab, activeTab === 'all' && isDarkMode && styles.darkTabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive, isDarkMode && styles.darkTabText, activeTab === 'all' && isDarkMode && styles.darkTabTextActive]}>Toutes</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'suggested' && (
          <View style={[styles.aiCard, isDarkMode && styles.darkAiCard]}>
            <View style={styles.aiHeader}>
               <Ionicons name="sparkles" size={20} color="#00C8B4" />
               <Text style={[styles.aiTitle, isDarkMode && styles.darkAiTitle]}>Chef IA</Text>
            </View>
            <Text style={[styles.aiDesc, isDarkMode && styles.darkAiDesc]}>Générez une recette unique basée sur vos {inventory.length} ingrédients disponibles.</Text>
            <TouchableOpacity 
              style={styles.aiButton}
              onPress={handleGenerateAI}
              disabled={loadingAI}
            >
              {loadingAI ? (
                 <ActivityIndicator color="#fff" size="small" />
              ) : (
                 <Text style={styles.aiButtonText}>Générer une recette</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Recipe List */}
        <View style={styles.list}>
          {displayedRecipes.map(recipe => {
             const compatibility = recipe.totalIngredients ? Math.round((recipe.availableIngredients! / recipe.totalIngredients) * 100) : 0;
             
             return (
              <View key={recipe.id} style={styles.card}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: recipe.image }} style={styles.image} />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{recipe.availableIngredients}/{recipe.totalIngredients} ingrédients</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={[styles.cardTitle, isDarkMode && styles.darkCardTitle]}>{recipe.name}</Text>
                  <Text style={[styles.cardDesc, isDarkMode && styles.darkCardDesc]} numberOfLines={2}>{recipe.description}</Text>

                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color={isDarkMode ? '#9ca3af' : '#9ca3af'} />
                      <Text style={[styles.metaText, isDarkMode && styles.darkMetaText]}>{recipe.prepTime} min</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="people-outline" size={14} color={isDarkMode ? '#9ca3af' : '#9ca3af'} />
                      <Text style={[styles.metaText, isDarkMode && styles.darkMetaText]}>{recipe.servings} pers.</Text>
                    </View>
                    <View style={[styles.difficultyBadge, isDarkMode && styles.darkDifficultyBadge]}>
                      <Text style={[styles.difficultyText, isDarkMode && styles.darkDifficultyText]}>{recipe.difficulty}</Text>
                    </View>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                       <Text style={[styles.progressLabel, isDarkMode && styles.darkProgressLabel]}>Compatibilité</Text>
                       <Text style={[styles.progressValue, isDarkMode && styles.darkProgressValue, { color: compatibility > 50 ? '#00C8B4' : isDarkMode ? '#9ca3af' : '#9ca3af' }]}>
                         {compatibility}%
                       </Text>
                    </View>
                    <View style={[styles.track, isDarkMode && styles.darkTrack]}>
                      <View style={[styles.bar, { width: `${compatibility}%` }]} />
                    </View>
                  </View>

                  <TouchableOpacity style={[styles.actionButton, isDarkMode && styles.darkActionButton]}>
                    <Ionicons name="heart" size={16} color="#fff" />
                    <Text style={styles.actionButtonText}>Voir la recette</Text>
                  </TouchableOpacity>
                </View>
              </View>
             );
          })}
        </View>
      </ScrollView>

      {/* Generated Recipe Modal */}
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <ScrollView>
             <Image source={{ uri: generatedRecipe?.image }} style={styles.modalImage} />
             <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
             </TouchableOpacity>

             <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{generatedRecipe?.name}</Text>
                  <View style={styles.modalMeta}>
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text style={styles.modalMetaText}>{generatedRecipe?.prepTime} min</Text>
                    <Text style={styles.dot}>•</Text>
                    <Ionicons name="restaurant" size={16} color="#6b7280" />
                    <Text style={styles.modalMetaText}>{generatedRecipe?.difficulty}</Text>
                  </View>
                </View>

                <Text style={styles.modalDesc}>{generatedRecipe?.description}</Text>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ingrédients</Text>
                  {generatedRecipe?.ingredients.map((ing, i) => (
                    <View key={i} style={styles.ingRow}>
                       <View style={styles.bullet} />
                       <Text style={styles.ingText}>{ing}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Étapes</Text>
                  {generatedRecipe?.steps?.map((step, i) => (
                    <View key={i} style={styles.stepRow}>
                       <View style={styles.stepNum}>
                         <Text style={styles.stepNumText}>{i + 1}</Text>
                       </View>
                       <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
             </View>
          </ScrollView>
        </View>
      </Modal>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  darkContent: {
    backgroundColor: '#111827',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  darkTitle: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  darkSubtitle: {
    color: '#d1d5db',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  darkTabs: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  darkTab: {
    backgroundColor: '#1f2937',
  },
  tabActive: {
    backgroundColor: '#111827',
  },
  darkTabActive: {
    backgroundColor: '#00C8B4',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  darkTabText: {
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#fff',
  },
  darkTabTextActive: {
    color: '#fff',
  },
  aiCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  darkAiCard: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065f46',
  },
  darkAiTitle: {
    color: '#00C8B4',
  },
  aiDesc: {
    fontSize: 13,
    color: '#047857',
    marginBottom: 16,
    lineHeight: 20,
  },
  darkAiDesc: {
    color: '#9ca3af',
  },
  aiButton: {
    backgroundColor: '#00C8B4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  list: {
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    height: 180,
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  cardBody: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  darkCardTitle: {
    color: '#fff',
  },
  cardDesc: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  darkCardDesc: {
    color: '#9ca3af',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  darkMetaText: {
    color: '#9ca3af',
  },
  difficultyBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  darkDifficultyBadge: {
    backgroundColor: '#374151',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4b5563',
  },
  darkDifficultyText: {
    color: '#d1d5db',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  darkProgressLabel: {
    color: '#6b7280',
  },
  progressValue: {
    fontSize: 10,
    fontWeight: '700',
  },
  darkProgressValue: {
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  darkTrack: {
    backgroundColor: '#374151',
  },
  bar: {
    height: '100%',
    backgroundColor: '#00C8B4',
    borderRadius: 3,
  },
  actionButton: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  darkActionButton: {
    backgroundColor: '#00C8B4',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#111827',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  modalContent: {
    padding: 24,
    marginTop: -24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalMetaText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  dot: {
    color: '#d1d5db',
  },
  modalDesc: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C8B4',
    marginRight: 12,
  },
  ingText: {
    fontSize: 16,
    color: '#374151',
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
});

export default Recipes;