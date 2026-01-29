import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { translations } from '../i18n/translations';
import { useAppContext } from '../context/AppContext';

interface LanguageSelectorProps {
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onClose }) => {
  const { language, setLanguage } = useAppContext();
  const t = translations[language];

  const languages = [
    { code: 'fr' as const, label: 'Français' },
    { code: 'en' as const, label: 'English' },
  ];

  const handleSelectLanguage = (code: 'fr' | 'en') => {
    setLanguage(code);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.language}</Text>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              language === item.code && styles.selectedOption,
            ]}
            onPress={() => handleSelectLanguage(item.code)}
          >
            <Text
              style={[
                styles.optionText,
                language === item.code && styles.selectedText,
              ]}
            >
              {item.label}
            </Text>
            {language === item.code && <View style={styles.checkmark} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00C8B4',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9fafb',
  },
  selectedOption: {
    backgroundColor: '#ccf0ee',
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  selectedText: {
    color: '#00C8B4',
    fontWeight: '600',
  },
  checkmark: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00C8B4',
  },
});

export default LanguageSelector;
