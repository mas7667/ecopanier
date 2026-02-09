import { SPOONACULAR_API_KEY } from '@env'

const BASE_URL = 'https://api.spoonacular.com'

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
    const response = await fetch(
      `${BASE_URL}/recipes/findByIngredients?ingredients=${ingredients.join(',')}&number=3&apiKey=${SPOONACULAR_API_KEY}`
    )
    const data = await response.json()
    return data.map((r: any) => ({
      id: r.id,
      title: r.title,
      image: r.image,
      usedIngredients: r.usedIngredients.map((i: any) => i.name),
      missedIngredients: r.missedIngredients.map((i: any) => i.name),
    }))
  },

  // Rechercher par mot-clé
  async searchRecipes(query: string): Promise<Recipe[]> {
    const response = await fetch(
      `${BASE_URL}/recipes/complexSearch?query=${query}&number=10&apiKey=${SPOONACULAR_API_KEY}`
    )
    const data = await response.json()
    return data.results.map((r: any) => ({
      id: r.id,
      title: r.title,
      image: r.image,
    }))
  },

  // Obtenir les détails d'une recette
  async getRecipeById(id: number): Promise<RecipeDetails> {
    const response = await fetch(
      `${BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    )
    const r = await response.json()
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