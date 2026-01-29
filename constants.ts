import { InventoryItem, Recipe } from './types';

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Pain de blé entier',
    category: 'Boulangerie',
    quantity: 1,
    unit: 'unité',
    expiryDate: '2024-12-27',
    daysUntilExpiry: 1,
    status: 'urgent',
    image: 'https://picsum.photos/id/102/200/200', // Raspberry/Fruit placeholder
    barcode: '068826904016'
  },
  {
    id: '2',
    name: 'Pommes Gala',
    category: 'Fruits',
    quantity: 6,
    unit: 'unités',
    expiryDate: '2024-12-28',
    daysUntilExpiry: 2,
    status: 'urgent',
    image: 'https://picsum.photos/id/429/200/200', // Apple placeholder
  },
  {
    id: '3',
    name: 'Lait 2%',
    category: 'Produits laitiers',
    quantity: 1,
    unit: 'L',
    expiryDate: '2024-12-29',
    daysUntilExpiry: 3,
    status: 'urgent',
    image: 'https://picsum.photos/id/425/200/200',
    barcode: '06280000000'
  },
  {
    id: '4',
    name: 'Carottes',
    category: 'Légumes',
    quantity: 1,
    unit: 'kg',
    expiryDate: '2025-01-01',
    daysUntilExpiry: 6,
    status: 'soon',
    image: 'https://picsum.photos/id/292/200/200', // Veggies
  },
  {
    id: '5',
    name: 'Poulet entier',
    category: 'Viandes',
    quantity: 1.5,
    unit: 'kg',
    expiryDate: '2025-01-04',
    daysUntilExpiry: 9,
    status: 'safe',
    image: 'https://picsum.photos/id/608/200/200',
  },
  {
    id: '6',
    name: 'Yogourt grec',
    category: 'Produits laitiers',
    quantity: 4,
    unit: 'unités',
    expiryDate: '2025-01-09',
    daysUntilExpiry: 14,
    status: 'safe',
    image: 'https://picsum.photos/id/425/200/200',
    barcode: '05680000000'
  }
];

export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Poulet rôti aux carottes',
    description: 'Un classique savoureux et réconfortant avec des légumes rôtis.',
    image: 'https://picsum.photos/id/292/600/400',
    prepTime: 60,
    servings: 4,
    difficulty: 'Moyen',
    availableIngredients: 2,
    totalIngredients: 6,
    isSuggested: true,
    ingredients: ['Poulet', 'Carottes', 'Oignon', 'Huile', 'Thym', 'Sel']
  },
  {
    id: 'r2',
    name: 'Tartine au poulet et pommes',
    description: 'Combinaison savoureuse de sucré-salé sur pain grillé.',
    image: 'https://picsum.photos/id/1080/600/400', // Strawberries/Fruit logic
    prepTime: 15,
    servings: 2,
    difficulty: 'Facile',
    availableIngredients: 3,
    totalIngredients: 5,
    isSuggested: true,
    ingredients: ['Pain', 'Poulet', 'Pommes', 'Fromage', 'Miel']
  },
  {
    id: 'r3',
    name: 'Smoothie aux pommes et yogourt',
    description: 'Boisson rafraîchissante et nutritive pour bien commencer la journée.',
    image: 'https://picsum.photos/id/425/600/400',
    prepTime: 5,
    servings: 2,
    difficulty: 'Facile',
    availableIngredients: 3,
    totalIngredients: 5,
    isSuggested: true,
    ingredients: ['Pommes', 'Yogourt', 'Lait', 'Miel', 'Cannelle']
  }
];

export const CATEGORIES = ['Toutes', 'Fruits', 'Légumes', 'Viandes', 'Produits laitiers', 'Boulangerie', 'Épicerie'];
