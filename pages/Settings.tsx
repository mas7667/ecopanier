import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SettingItem from '../components/SettingItem';
import PersonalInfo from './PersonalInfo';
import SecurityPrivacy from './SecurityPrivacy';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n/translations';

interface SettingsProps {
  isDarkMode?: boolean;
}

const Settings: React.FC<SettingsProps> = () => {
  const { isDarkMode, setIsDarkMode, language, setLanguage } = useAppContext();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState<'settings' | 'personalInfo' | 'securityPrivacy'>('settings');
  const t = translations[language];

  // Gérer la StatusBar
  React.useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    StatusBar.setBackgroundColor(isDarkMode ? '#1f2937' : '#f9fafb', true);
  }, [isDarkMode]);

  if (currentPage === 'personalInfo') {
    return <PersonalInfo onBack={() => setCurrentPage('settings')} />;
  }

  if (currentPage === 'securityPrivacy') {
    return <SecurityPrivacy onBack={() => setCurrentPage('settings')} />;
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Header appName="EcoManger" />
      
      <ScrollView
        style={[styles.scrollView, isDarkMode && styles.darkScrollView]}
        contentContainerStyle={styles.content}
      >
        {/* Account Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            {t.account}
          </Text>

          {/* Personal Info Button */}
          <TouchableOpacity
            style={[styles.sectionContent, isDarkMode && styles.darkSectionContent]}
            onPress={() => setCurrentPage('personalInfo')}
          >
            <View style={styles.accountButton}>
              <View style={styles.accountContent}>
                <Ionicons name="person" size={20} color="#00C8B4" />
                <View style={styles.accountText}>
                  <Text style={[styles.accountTitle, isDarkMode && styles.darkText]}>
                    {t.personalInfo}
                  </Text>
                  <Text style={[styles.accountDesc, isDarkMode && styles.darkAccountDesc]}>
                    {t.viewAndEditInfo}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            </View>
          </TouchableOpacity>

          {/* Security & Privacy Button */}
          <TouchableOpacity
            style={[styles.sectionContent, isDarkMode && styles.darkSectionContent, styles.separatedSection]}
            onPress={() => setCurrentPage('securityPrivacy')}
          >
            <View style={styles.accountButton}>
              <View style={styles.accountContent}>
                <Ionicons name="shield" size={20} color="#7c3aed" />
                <View style={styles.accountText}>
                  <Text style={[styles.accountTitle, isDarkMode && styles.darkText]}>
                    {t.securityAndPrivacy}
                  </Text>
                  <Text style={[styles.accountDesc, isDarkMode && styles.darkAccountDesc]}>
                    {t.manageSecuritySettings}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
            {t.preferences}
          </Text>
          <View style={[styles.sectionContent, isDarkMode && styles.darkSectionContent]}>
            <SettingItem
              icon={<Ionicons name="moon" size={20} color="#f59e0b" />}
              label={t.darkMode}
              value={isDarkMode}
              isToggle={true}
              onToggle={setIsDarkMode}
            />
            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
            
            {/* Language Selector */}
            <TouchableOpacity 
              style={styles.languageButton}
              onPress={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <View style={styles.languageContent}>
                <Ionicons name="globe" size={20} color="#3b82f6" />
                <View style={styles.languageText}>
                  <Text style={[styles.languageLabel, isDarkMode && styles.darkText]}>
                    {t.language}
                  </Text>
                  <Text style={[styles.languageValue, isDarkMode && styles.darkValue]}>
                    {language === 'fr' ? 'Français' : 'English'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDarkMode ? '#6b7280' : '#9ca3af'} />
            </TouchableOpacity>

            {/* Language Menu Dropdown */}
            {showLanguageMenu && (
              <View style={[styles.languageMenu, isDarkMode && styles.darkLanguageMenu]}>
                <TouchableOpacity
                  style={[styles.languageOption, language === 'fr' && styles.selectedLanguage]}
                  onPress={() => {
                    setLanguage('fr');
                    setShowLanguageMenu(false);
                  }}
                >
                  <Text style={[styles.languageOptionText, language === 'fr' && styles.selectedLanguageText]}>
                    Français
                  </Text>
                  {language === 'fr' && <Ionicons name="checkmark" size={16} color="#00C8B4" />}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.languageOption, language === 'en' && styles.selectedLanguage]}
                  onPress={() => {
                    setLanguage('en');
                    setShowLanguageMenu(false);
                  }}
                >
                  <Text style={[styles.languageOptionText, language === 'en' && styles.selectedLanguageText]}>
                    English
                  </Text>
                  {language === 'en' && <Ionicons name="checkmark" size={16} color="#00C8B4" />}
                </TouchableOpacity>
              </View>
            )}

            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />
            
            <SettingItem
              icon={<Ionicons name="notifications" size={20} color="#06b6d4" />}
              label={t.notifications}
              value={true}
              isToggle={true}
              onToggle={() => {}}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]}
        >
          <Ionicons name="log-out" size={20} color="#dc2626" />
          <Text style={[styles.logoutText, isDarkMode && styles.darkLogoutText]}>
            {t.logout}
          </Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={[styles.version, isDarkMode && styles.darkVersion]}>
          {t.version}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  darkScrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 80,
  },
  section: {
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  darkSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00C8B4',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  darkText: {
    color: '#00C8B4',
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  darkSectionContent: {
    backgroundColor: '#1f2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 0,
  },
  darkDivider: {
    backgroundColor: '#374151',
  },
  languageButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  languageText: {
    flex: 1,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  languageValue: {
    fontSize: 13,
    color: '#9ca3af',
  },
  darkValue: {
    color: '#9ca3af',
  },
  languageMenu: {
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
  },
  darkLanguageMenu: {
    backgroundColor: '#111827',
    borderTopColor: '#374151',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  selectedLanguage: {
    backgroundColor: '#f3f4f6',
  },
  languageOptionText: {
    fontSize: 13,
    color: '#6b7280',
  },
  selectedLanguageText: {
    color: '#00C8B4',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
  },
  darkLogoutButton: {
    backgroundColor: '#7f1d1d',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
  },
  darkLogoutText: {
    color: '#fca5a5',
  },
  version: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 20,
  },
  darkVersion: {
    color: '#6b7280',
  },
  accountButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  accountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  accountText: {
    flex: 1,
  },
  accountTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  accountDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  darkAccountDesc: {
    color: '#9ca3af',
  },
  separatedSection: {
    marginTop: 12,
  },
});

export default Settings;