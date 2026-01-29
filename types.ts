export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string; // ISO Date string YYYY-MM-DD
  daysUntilExpiry: number;
  image: string;
  status: 'urgent' | 'soon' | 'safe';
  barcode?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image?: string;
  prepTime: number; // minutes
  servings?: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  availableIngredients?: number;
  totalIngredients?: number;
  isSuggested?: boolean;
  ingredients: string[];
  steps?: string[];
}

export type ViewState = 'dashboard' | 'inventory' | 'recipes' | 'settings';

export interface UserSettings {
  notifications: boolean;
  recipeSuggestions: boolean;
  darkMode: boolean;
  language: string;
}

export interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  inventory: InventoryItem[];
}

export interface InventoryProps {
  inventory: InventoryItem[];
  onAdd: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export interface RecipesProps {
  inventory: InventoryItem[];
}
