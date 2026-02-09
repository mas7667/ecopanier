import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * Hook personnalisé pour accéder au thème de l'application
 * @returns isDarkMode et setIsDarkMode depuis AppContext
 */
export const useTheme = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useTheme must be used within AppProvider');
  }
  
  return {
    isDarkMode: context.isDarkMode,
    setIsDarkMode: context.setIsDarkMode,
  };
};
