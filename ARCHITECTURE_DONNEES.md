# Architecture de Données - EcoManger

## 🎯 Vue d'ensemble

Application de gestion d'inventaire alimentaire avec génération de recettes intelligente.

---

## 📦 Modèles de Données Principaux

### 1. InventoryItem (Article d'inventaire)

```typescript
interface InventoryItem {
  // Identification
  id: string; // UUID unique
  barcode?: string; // Code-barres du produit

  // Informations produit
  name: string; // Nom du produit
  category: CategoryType; // Catégorie (enum strict)
  image: string; // URL de l'image

  // Quantité
  quantity: number; // Quantité disponible
  unit: UnitType; // Unité de mesure (enum)

  // Dates et statut
  expiryDate: string; // Date d'expiration (ISO format)
  daysUntilExpiry: number; // Calculé automatiquement
  status: ExpiryStatus; // urgent | soon | safe
  addedDate: string; // Date d'ajout au système

  // Métadonnées
  location?: StorageLocation; // Frigo, congélateur, placard
  nutritionalInfo?: NutritionalInfo; // Infos nutritionnelles
  notes?: string; // Notes utilisateur
}
```

### 2. Recipe (Recette)

```typescript
interface Recipe {
  // Identification
  id: string; // UUID ou ID externe (Spoonacular)
  source: "spoonacular" | "user" | "ai"; // Source de la recette

  // Informations de base
  name: string; // Titre de la recette
  description: string; // Description courte
  image?: string; // URL de l'image

  // Détails culinaires
  prepTime: number; // Temps en minutes
  cookTime?: number; // Temps de cuisson
  totalTime?: number; // Temps total
  servings: number; // Nombre de portions
  difficulty: DifficultyLevel; // Facile | Moyen | Difficile

  // Contenu
  ingredients: RecipeIngredient[]; // Liste structurée
  steps: RecipeStep[]; // Étapes numérotées

  // Compatibilité
  availableIngredients: number; // Ingrédients possédés
  totalIngredients: number; // Total requis
  compatibilityScore: number; // 0-100%

  // Classification
  tags: string[]; // végétarien, sans gluten, etc.
  cuisine?: string; // Type de cuisine
  mealType?: MealType[]; // petit-déj, déjeuner, dîner

  // Méta
  isSuggested: boolean; // Suggérée par l'IA
  isFavorite: boolean; // Marquée favorite
  rating?: number; // Note utilisateur (1-5)
  createdAt: string; // Date de création
  lastCooked?: string; // Dernière utilisation
}
```

### 3. RecipeIngredient (Ingrédient de recette)

```typescript
interface RecipeIngredient {
  id: string; // ID unique
  name: string; // Nom de l'ingrédient
  nameEn?: string; // Nom en anglais (pour API)
  quantity: number; // Quantité
  unit: UnitType; // Unité
  isAvailable: boolean; // Dispo dans inventaire
  inventoryItemId?: string; // Référence à l'inventaire
  isOptional: boolean; // Facultatif ou obligatoire
  substitutes?: string[]; // Substituts possibles
}
```

### 4. RecipeStep (Étape de recette)

```typescript
interface RecipeStep {
  id: string; // ID unique
  order: number; // Ordre d'exécution
  instruction: string; // Instruction détaillée
  duration?: number; // Durée de l'étape (min)
  temperature?: number; // Température si cuisson
  equipmentNeeded?: string[]; // Matériel requis
  imageUrl?: string; // Image illustrative
}
```

### 5. ShoppingListItem (Liste de courses)

```typescript
interface ShoppingListItem {
  id: string; // ID unique
  name: string; // Nom du produit
  quantity: number; // Quantité à acheter
  unit: UnitType; // Unité
  category: CategoryType; // Catégorie
  isPurchased: boolean; // Acheté ou non
  addedFrom: "manual" | "recipe" | "inventory"; // Source
  recipeId?: string; // Si ajouté depuis recette
  estimatedPrice?: number; // Prix estimé
  notes?: string; // Notes
  addedAt: string; // Date d'ajout
}
```

### 6. UserPreferences (Préférences utilisateur)

```typescript
interface UserPreferences {
  // Interface
  theme: "light" | "dark" | "auto";
  language: "fr" | "en";

  // Notifications
  notifications: NotificationSettings;

  // Alimentaire
  dietaryRestrictions: string[]; // végétarien, vegan, etc.
  allergies: string[]; // Allergies alimentaires
  dislikedIngredients: string[]; // Ingrédients non aimés

  // Suggestions
  recipeSuggestionsEnabled: boolean;
  autoSuggestRecipes: boolean;
  preferredCuisines: string[]; // Cuisines préférées

  // Inventaire
  defaultExpiryWarningDays: number; // Alerte X jours avant
  autoCalculateExpiry: boolean; // Calcul auto des dates
  storageLocations: StorageLocation[];
}
```

### 7. RecipeHistory (Historique recettes)

```typescript
interface RecipeHistory {
  id: string;
  recipeId: string;
  cookedAt: string; // Date de préparation
  rating?: number; // Note donnée (1-5)
  feedback?: string; // Commentaire
  modifications?: string; // Modifications apportées
  ingredientsUsed: string[]; // Ingrédients réellement utilisés
}
```

---

## 🔧 Types Auxiliaires

### Enums et Types

```typescript
// Catégories de produits
enum CategoryType {
  FRUITS = "Fruits",
  LEGUMES = "Légumes",
  VIANDES = "Viandes",
  POISSONS = "Poissons",
  PRODUITS_LAITIERS = "Produits laitiers",
  BOULANGERIE = "Boulangerie",
  CEREALES = "Céréales",
  CONDIMENTS = "Condiments",
  BOISSONS = "Boissons",
  SURGELES = "Surgelés",
  CONSERVES = "Conserves",
  AUTRES = "Autres",
}

// Unités de mesure
enum UnitType {
  KG = "kg",
  G = "g",
  L = "L",
  ML = "ml",
  UNITE = "unité",
  UNITES = "unités",
  TASSE = "tasse",
  CUILLERE_SOUPE = "c. à soupe",
  CUILLERE_CAFE = "c. à café",
  PINCEE = "pincée",
  TRANCHE = "tranche",
}

// Statut d'expiration
type ExpiryStatus = "urgent" | "soon" | "safe";

// Niveau de difficulté
type DifficultyLevel = "Facile" | "Moyen" | "Difficile";

// Type de repas
enum MealType {
  PETIT_DEJEUNER = "Petit-déjeuner",
  DEJEUNER = "Déjeuner",
  DINER = "Dîner",
  COLLATION = "Collation",
  DESSERT = "Dessert",
}

// Lieu de stockage
enum StorageLocation {
  FRIGO = "Réfrigérateur",
  CONGELATEUR = "Congélateur",
  PLACARD = "Placard",
  CAVE = "Cave",
  COMPTOIR = "Comptoir",
}

// Informations nutritionnelles
interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

// Paramètres de notifications
interface NotificationSettings {
  enabled: boolean;
  expiryWarnings: boolean;
  recipeSuggestions: boolean;
  shoppingReminders: boolean;
  dailySummary: boolean;
}
```

---

## 🏗️ Architecture Contextuelle

### AppContext (État global)

```typescript
interface AppContextType {
  // Thème et langue
  theme: "light" | "dark";
  language: "fr" | "en";

  // Données principales
  inventory: InventoryItem[];
  recipes: Recipe[];
  shoppingList: ShoppingListItem[];
  favoriteRecipes: string[]; // IDs des favoris
  recipeHistory: RecipeHistory[];

  // Préférences
  userPreferences: UserPreferences;

  // Actions inventaire
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // Actions recettes
  addRecipe: (recipe: Recipe) => void;
  toggleFavoriteRecipe: (id: string) => void;
  addRecipeToHistory: (history: RecipeHistory) => void;

  // Actions liste de courses
  addToShoppingList: (item: ShoppingListItem) => void;
  removeFromShoppingList: (id: string) => void;
  markAsPurchased: (id: string) => void;
  clearShoppingList: () => void;

  // Utilitaires
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: "fr" | "en") => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}
```

---

## 🔄 Flux de Données

### 1. Génération de Recettes

```
Inventaire → Traduction FR→EN → API Spoonacular → Transformation données → Affichage
```

### 2. Ajout à l'inventaire

```
Scan/Manuel → Validation → Calcul expiration → Ajout Context → Persistance locale
```

### 3. Création liste de courses

```
Recette sélectionnée → Analyse ingrédients manquants → Ajout shopping list → Groupement par catégorie
```

---

## 💾 Persistance des Données

### AsyncStorage Structure

```typescript
// Clés de stockage
const STORAGE_KEYS = {
  INVENTORY: "@ecomanger:inventory",
  RECIPES: "@ecomanger:recipes",
  SHOPPING_LIST: "@ecomanger:shopping_list",
  FAVORITES: "@ecomanger:favorites",
  HISTORY: "@ecomanger:recipe_history",
  PREFERENCES: "@ecomanger:preferences",
  USER_DATA: "@ecomanger:user_data",
};
```

---

## 🔌 Services API

### SpoonacularService

```typescript
interface SpoonacularService {
  // Recherche
  searchByIngredients(ingredients: string[]): Promise<Recipe[]>;
  searchByQuery(query: string): Promise<Recipe[]>;

  // Détails
  getRecipeById(id: number): Promise<RecipeDetails>;
  getRandomRecipes(count: number): Promise<Recipe[]>;

  // Nutritionnel
  getNutritionalInfo(recipeId: number): Promise<NutritionalInfo>;

  // Traduction
  translateIngredient(name: string): string;
}
```

---

## 📈 Optimisations Suggérées

### 1. Calculs Automatiques

- `daysUntilExpiry`: Calculé à partir de `expiryDate`
- `status`: Dérivé de `daysUntilExpiry`
- `compatibilityScore`: Basé sur `availableIngredients / totalIngredients`

### 2. Indexation

- Index par catégorie pour filtrage rapide
- Index par date d'expiration pour tri
- Cache des recettes fréquemment consultées

### 3. Validation

- Schémas Zod/Yup pour validation des données
- Vérification des dates cohérentes
- Validation des quantités positives

---

## 🎨 Améliorations Futures

1. **Base de données locale** (SQLite/Realm) pour meilleures performances
2. **Synchronisation cloud** pour multi-device
3. **Analytics** pour suggestions personnalisées
4. **OCR** pour extraction automatique d'infos produit
5. **Partage de recettes** entre utilisateurs
6. **Export PDF** des recettes et listes de courses

---

## 📝 Conventions de Nommage

- **Interfaces**: PascalCase (ex: `InventoryItem`)
- **Propriétés**: camelCase (ex: `expiryDate`)
- **Enums**: PascalCase avec valeurs UPPERCASE (ex: `CategoryType.FRUITS`)
- **Fonctions**: camelCase verbes d'action (ex: `addInventoryItem`)
- **Constantes**: SCREAMING_SNAKE_CASE (ex: `STORAGE_KEYS`)

---

## 🔒 Sécurité

- Pas de données sensibles en local (mots de passe, cartes bancaires)
- Validation stricte des entrées utilisateur
- Sanitization des données API externes
- Clés API en variables d'environnement (pas hardcodées)
