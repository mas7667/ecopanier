// Mettez votre clé API Spoonacular ici
// Obtenez-la gratuitement sur : https://spoonacular.com/food-api/console#Dashboard
const SPOONACULAR_API_KEY = '78c0c1a904e849e18880f4b1f9198361'; // Remplacez par votre clé
const BASE_URL = 'https://api.spoonacular.com'

// Dictionnaire de traduction français -> anglais pour les ingrédients courants
const ingredientTranslations: { [key: string]: string } = {
  // Produits laitiers
  'lait': 'milk',
  'lait 2%': 'milk',
  'fromage': 'cheese',
  'beurre': 'butter',
  'yaourt': 'yogurt',
  'yogourt': 'yogurt',
  'crème': 'cream',
  
  // Viandes
  'poulet': 'chicken',
  'poulet entier': 'whole chicken',
  'boeuf': 'beef',
  'porc': 'pork',
  'agneau': 'lamb',
  'dinde': 'turkey',
  
  // Légumes
  'carottes': 'carrots',
  'tomates': 'tomatoes',
  'oignons': 'onions',
  'ail': 'garlic',
  'pommes de terre': 'potatoes',
  'salade': 'lettuce',
  'épinards': 'spinach',
  'brocoli': 'broccoli',
  'courgettes': 'zucchini',
  'poivrons': 'peppers',
  
  // Fruits
  'pommes': 'apples',
  'bananes': 'bananas',
  'oranges': 'oranges',
  'fraises': 'strawberries',
  'raisins': 'grapes',
  
  // Pain et céréales
  'pain': 'bread',
  'pain de blé entier': 'whole wheat bread',
  'riz': 'rice',
  'pâtes': 'pasta',
  'farine': 'flour',
  
  // Autres
  'oeufs': 'eggs',
  'œufs': 'eggs',
  'sucre': 'sugar',
  'sel': 'salt',
  'huile': 'oil',
};

// Fonction pour traduire un ingrédient en anglais
function translateIngredient(ingredient: string): string {
  const lowerIngredient = ingredient.toLowerCase().trim();
  return ingredientTranslations[lowerIngredient] || ingredient;
}

export interface Recipe {
  id: number
  title: string
  image: string
  readyInMinutes?: number
  servings?: number
  usedIngredients?: string[]
  missedIngredients?: string[]
}

export interface RecipeDetails extends Recipe {
  instructions: string
  ingredients: string[]
  summary: string
  sourceUrl?: string
  diets?: string[]
}

export const spoonacularService = {
  // Rechercher par ingrédients
  async searchByIngredients(ingredients: string[]): Promise<Recipe[]> {
    // Traduire les ingrédients en anglais
    const translatedIngredients = ingredients.map(ing => translateIngredient(ing));
    console.log('Ingrédients originaux:', ingredients);
    console.log('Ingrédients traduits:', translatedIngredients);
    
    const url = `${BASE_URL}/recipes/findByIngredients?ingredients=${translatedIngredients.join(',')}&number=3`;
    console.log('Spoonacular URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'x-api-key': SPOONACULAR_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spoonacular error response:', errorText);
      throw new Error(`Spoonacular API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Spoonacular raw response:', data);
    
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', typeof data, data);
      throw new Error('Invalid response format from Spoonacular API');
    }
    
    return data.map((r: any) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      usedIngredients: r.usedIngredients?.map((i: any) => i.name) || [],
      missedIngredients: r.missedIngredients?.map((i: any) => i.name) || [],
    }))
  },

  // Rechercher par mot-clé
  async searchRecipes(query: string): Promise<Recipe[]> {
    const url = `${BASE_URL}/recipes/complexSearch?query=${query}&number=10`;
    const response = await fetch(url, {
      headers: {
        'x-api-key': SPOONACULAR_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Spoonacular API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format from Spoonacular API');
    }
    
    return data.results.map((r: any) => ({
      id: r.id,
      title: r.title,
      image: r.image,
    }))
  },

  // Obtenir les détails d'une recette
  async getRecipeById(id: number): Promise<RecipeDetails> {
    const url = `${BASE_URL}/recipes/${id}/information`;
    const response = await fetch(url, {
      headers: {
        'x-api-key': SPOONACULAR_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Spoonacular API error: ${response.status}`);
    }
    
    const r = await response.json();
    
    return {
      id: r.id,
      title: r.title,
      image: r.image,
      readyInMinutes: r.readyInMinutes,
      servings: r.servings,
      instructions: r.instructions || '',
      ingredients: r.extendedIngredients?.map((i: any) => i.original) || [],
      summary: r.summary?.replace(/<[^>]*>/g, '') || '',
      sourceUrl: r.sourceUrl,
      diets: r.diets,
    }
  },

  // Recettes aléatoires
  async getRandomRecipes(number: number = 5): Promise<Recipe[]> {
    const response = await fetch(
      `${BASE_URL}/recipes/random?number=${number}&apiKey=${SPOONACULAR_API_KEY}`
    )
    const data = await response.json()
    return data.recipes.map((r: any) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      readyInMinutes: r.readyInMinutes,
      servings: r.servings,
    }))
  },
}