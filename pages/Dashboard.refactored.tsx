/**
 * Exemple de page Dashboard utilisant les nouveaux composants réutilisables
 * 
 * Cette page démontre comment utiliser les composants de la nouvelle architecture
 * pour créer une interface cohérente et maintenable.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import des composants réutilisables
import {
  Screen,
  Section,
  QuickStats,
  UrgentItemsCarousel,
  TipCard,
} from '../components';

import { DashboardProps } from '../types';
import { useTheme } from '../hooks';

const DashboardRefactored: React.FC<DashboardProps> = ({ onNavigate, inventory }) => {
  const { isDarkMode } = useTheme();
  
  // Calculs des statistiques
  const urgentCount = inventory.filter(i => i.status === 'urgent').length;
  const soonCount = inventory.filter(i => i.status === 'soon').length;

  return (
    <Screen title="EcoPanier" scrollable>
      <View style={styles.content}>
        {/* Section Stats - Utilise QuickStats */}
        <Section>
          <View style={styles.statsRow}>
            <QuickStats
              icon={<Ionicons name="alert-circle" size={28} color="#dc2626" />}
              value={soonCount}
              label="À consommer bientôt"
              backgroundColor="#fee2e2"
              onPress={() => onNavigate('inventory')}
            />
            
            <View style={styles.spacer} />
            
            <QuickStats
              icon={<Ionicons name="water" size={28} color="#00C8B4" />}
              value={inventory.length}
              label="Total aliments"
              backgroundColor="#ccf0ee"
              onPress={() => onNavigate('inventory')}
            />
          </View>
        </Section>

        {/* Section Urgents - Utilise UrgentItemsCarousel */}
        <UrgentItemsCarousel
          items={inventory}
          onViewAll={() => onNavigate('inventory')}
          onItemPress={(item) => console.log('Item pressed:', item.name)}
        />

        {/* Section Astuce - Utilise TipCard (existant, à améliorer) */}
        <Section>
          <TipCard
            title="ASTUCE"
            heading="Conservation optimale"
            text="Pour garder vos carottes croquantes plus longtemps, conservez-les dans un récipient d'eau au réfrigérateur."
            onReadMore={() => console.log('Read more')}
          />
        </Section>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  spacer: {
    width: 12,
  },
});

export default DashboardRefactored;
