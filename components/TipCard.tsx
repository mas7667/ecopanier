import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TipCardProps {
  title: string;
  heading: string;
  text: string;
  onReadMore?: () => void;
}

const TipCard: React.FC<TipCardProps> = ({ title, heading, text, onReadMore }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity onPress={onReadMore}>
        <Text style={styles.link}>Lire l'article ›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
    marginBottom: 12,
  },
  link: {
    fontSize: 14,
    color: '#00C8B4',
    fontWeight: '600',
  },
});

export default TipCard;
