/**
 * Index centralisé pour tous les composants réutilisables
 * Permet des imports simplifiés depuis n'importe où dans l'application
 * 
 * @example
 * import { Button, Card, RecipeCard } from '@/components';
 */

// ============================================================================
// UI Components - Composants atomiques réutilisables
// ============================================================================
export {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Input,
  Modal,
  ProgressBar,
  Switch,
} from './ui';

// ============================================================================
// Layout Components - Structure et navigation
// ============================================================================
export {
  EmptyState,
  LoadingState,
  Screen,
  Section,
  TabBar,
} from './layout';

export type { Tab } from './layout';

// ============================================================================
// Feature Components - Composants métier
// ============================================================================

// Dashboard
export {
  QuickStats,
  UrgentItemsCarousel,
} from './features/dashboard';

// Recipes
export {
  AIRecipeGenerator,
  RecipeCard,
  RecipeModal,
} from './features/recipes';

// Settings
export {
  SettingGroup,
  ThemeToggle,
} from './features/settings';

// Inventory
export {
  InventoryCard,
} from './features/inventory';

// ============================================================================
// Form Components - Composants de formulaire
// ============================================================================
export {
  CategoryPicker,
  DatePicker,
  FormField,
} from './forms';

// ============================================================================
// Legacy Components (À migrer progressivement)
// ============================================================================
export { default as Header } from './Header';
export { default as ItemCard } from './ItemCard';
export { default as ItemDetailModal } from './ItemDetailModal';
export { default as ItemEditModal } from './ItemEditModal';
export { default as LanguageSelector } from './LanguageSelector';
export { default as Navbar } from './Navbar';
export { default as SettingItem } from './SettingItem';
export { default as StatCard } from './StatCard';
export { default as TipCard } from './TipCard';
