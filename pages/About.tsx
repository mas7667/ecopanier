import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const About = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.cover}>
           <View style={styles.overlay} />
           <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#d1d5db" />
              </View>
           </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>Fily Sara KEITA</Text>
          <Text style={styles.role}>Développeur Mobile</Text>

          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <Ionicons name="card" size={20} color="#374151" />
              </View>
              <View>
                <Text style={styles.label}>ID Étudiant</Text>
                <Text style={styles.value}>202338710</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <Ionicons name="school" size={20} color="#374151" />
              </View>
              <View>
                <Text style={styles.label}>Cours</Text>
                <Text style={styles.value}>420-VC8-LP, groupe 1</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <Ionicons name="calendar" size={20} color="#374151" />
              </View>
              <View>
                <Text style={styles.label}>Session</Text>
                <Text style={styles.value}>Automne 2025</Text>
              </View>
            </View>
          </View>

          <View style={styles.aiBadge}>
            <Ionicons name="hardware-chip" size={16} color="#2563eb" />
            <Text style={styles.aiText}>J'ai tout 60% avec l'IA</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cover: {
    height: 120,
    backgroundColor: '#111827',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
  },
  
  avatarContainer: {
    position: 'absolute',
    bottom: -40,
    left: '50%',
    marginLeft: -40,
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 20,
    transform: [{rotate: '3deg'}]
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 24,
  },
  infoList: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 2,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  aiText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  }
});

export default About;