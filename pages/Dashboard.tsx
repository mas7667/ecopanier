import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import ItemCard from '../components/ItemCard';
import TipCard from '../components/TipCard';
import { dashboardStyles as styles } from '../styles/dashboardStyles';
import { DashboardProps } from '../types';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, inventory }) => {
  const { isDarkMode } = useAppContext();
  const [isModalVisible, setModalVisible] = useState(false);
  
  const urgentItems = inventory.filter(i => i.status === 'urgent').slice(0, 3);
  const urgentCount = inventory.filter(i => i.status === 'urgent').length;
  const soonCount = inventory.filter(i => i.status === 'soon').length;

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]} contentContainerStyle={styles.content}>
      <Header 
        appName="EcoPanier"
        onAddPress={() => setModalVisible(true)}
        onScanPress={() => onNavigate?.('scan')}
      />
      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <StatCard
          icon={<Ionicons name="alert-circle" size={28} color="#dc2626" />}
          value={soonCount}
          label="À consommer bientôt"
          backgroundColor="#fee2e2"
        />
        
        <StatCard
          icon={<Ionicons name="water" size={28} color="#00C8B4" />}
          value={inventory.length}
          label="Total aliments"
          backgroundColor="#ccf0ee"
        />
      </View>

      {/* Urgents Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkSectionTitle]}>Urgents ({urgentCount})</Text>
          <TouchableOpacity onPress={() => onNavigate('inventory')}>
            <Text style={styles.seeAllLink}>Tout voir</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {urgentItems.map((item, index) => (
            <ItemCard key={index} item={item} />
          ))}
          <View style={{ width: 10 }} />
        </ScrollView>
      </View>

      {/* Tip Section */}
      <TipCard
        title="ASTUCE"
        heading="Conservation optimale"
        text="Pour garder vos carottes croquantes plus longtemps, conservez-les dans un récipient d'eau au réfrigérateur."
        onReadMore={() => {}}
      />
    </ScrollView>
  );
};

export default Dashboard;