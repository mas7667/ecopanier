import React from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Section } from '../../layout';
import ItemCard from '../../../components/ItemCard';
import { InventoryItem } from '../../../types';
import { EmptyState } from '../../layout';
import { Button } from '../../ui';

interface UrgentItemsCarouselProps {
  items: InventoryItem[];
  onViewAll?: () => void;
  onItemPress?: (item: InventoryItem) => void;
}

export const UrgentItemsCarousel: React.FC<UrgentItemsCarouselProps> = ({
  items,
  onViewAll,
  onItemPress,
}) => {
  const urgentItems = items.filter(item => item.status === 'urgent').slice(0, 5);

  return (
    <Section
      title={`Urgents (${items.filter(item => item.status === 'urgent').length})`}
      headerRight={
        onViewAll && urgentItems.length > 0 ? (
          <Button
            title="Tout voir"
            onPress={onViewAll}
            variant="ghost"
            size="small"
          />
        ) : undefined
      }
    >
      {urgentItems.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {urgentItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.itemWrapper}
              onPress={onItemPress ? () => onItemPress(item) : undefined}
            >
              <ItemCard item={item} />
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <EmptyState
          icon="checkmark-circle-outline"
          title="Aucun produit urgent"
          message="Tous vos produits sont à consommer plus tard !"
          style={styles.emptyState}
        />
      )}
    </Section>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingRight: 16,
  },
  itemWrapper: {
    marginRight: 12,
    width: 160,
  },
  emptyState: {
    paddingVertical: 40,
  },
});
