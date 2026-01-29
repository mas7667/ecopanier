import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n/translations';

interface AccountSettingsProps {
  onBack: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onBack }) => {
  const { isDarkMode, language } = useAppContext();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'personal' | 'security' | 'privacy'>('personal');

  const renderPersonalInfo = () => (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
        {t.personalInfo}
      </Text>
      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.infoGroup}>
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={20} color="#00C8B4" />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>
              {t.fullName}
            </Text>
            <Text style={[styles.value, isDarkMode && styles.darkValue]}>
              Jean Dupont
            </Text>
          </View>
        </View>

        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

        <View style={styles.infoGroup}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={20} color="#3b82f6" />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>
              {t.email}
            </Text>
            <Text style={[styles.value, isDarkMode && styles.darkValue]}>
              jean@example.com
            </Text>
          </View>
        </View>

        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

        <View style={styles.infoGroup}>
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={20} color="#f59e0b" />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.label, isDarkMode && styles.darkText]}>
              {t.phone}
            </Text>
            <Text style={[styles.value, isDarkMode && styles.darkValue]}>
              +33 6 12 34 56 78
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={[styles.button, isDarkMode && styles.darkButton]}>
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>
          {t.editProfile}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSecurity = () => (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
        {t.securitySettings}
      </Text>

      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.securityItem}>
          <View>
            <Text style={[styles.securityTitle, isDarkMode && styles.darkText]}>
              {t.passwordChange}
            </Text>
            <Text style={[styles.securityDesc, isDarkMode && styles.darkSecurityDesc]}>
              {t.passwordChangeDesc}
            </Text>
          </View>
          <TouchableOpacity style={styles.securityBtn}>
            <Text style={styles.securityBtnText}>{t.change}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

        <View style={styles.securityItem}>
          <View>
            <Text style={[styles.securityTitle, isDarkMode && styles.darkText]}>
              {t.twoFactor}
            </Text>
            <Text style={[styles.securityDesc, isDarkMode && styles.darkSecurityDesc]}>
              {t.twoFactorDesc}
            </Text>
          </View>
          <TouchableOpacity style={[styles.toggleBtn, { backgroundColor: '#10b981' }]}>
            <Text style={styles.toggleText}>✓</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

        <View style={styles.securityItem}>
          <View>
            <Text style={[styles.securityTitle, isDarkMode && styles.darkText]}>
              {t.activeSessions}
            </Text>
            <Text style={[styles.securityDesc, isDarkMode && styles.darkSecurityDesc]}>
              {t.activeSessionsDesc}
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.link}>{t.view}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPrivacy = () => (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
        {t.privacySettings}
      </Text>

      <View style={[styles.card, isDarkMode && styles.darkCard]}>
        <View style={styles.privacyItem}>
          <View>
            <Text style={[styles.privacyTitle, isDarkMode && styles.darkText]}>
              {t.dataCollection}
            </Text>
            <Text style={[styles.privacyDesc, isDarkMode && styles.darkPrivacyDesc]}>
              {t.dataCollectionDesc}
            </Text>
          </View>
          <TouchableOpacity style={styles.toggleBtn}>
            <Text style={styles.toggleText}>✓</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

        <View style={styles.privacyItem}>
          <View>
            <Text style={[styles.privacyTitle, isDarkMode && styles.darkText]}>
              {t.shareAnalytics}
            </Text>
            <Text style={[styles.privacyDesc, isDarkMode && styles.darkPrivacyDesc]}>
              {t.shareAnalyticsDesc}
            </Text>
          </View>
          <TouchableOpacity style={styles.toggleBtn}>
            <Text style={styles.toggleText}></Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

        <View style={styles.privacyItem}>
          <View>
            <Text style={[styles.privacyTitle, isDarkMode && styles.darkText]}>
              {t.downloadData}
            </Text>
            <Text style={[styles.privacyDesc, isDarkMode && styles.darkPrivacyDesc]}>
              {t.downloadDataDesc}
            </Text>
          </View>
          <TouchableOpacity style={styles.downloadBtn}>
            <Text style={styles.downloadBtnText}>{t.download}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

        <TouchableOpacity style={styles.dangerBtn}>
          <Text style={styles.dangerBtnText}>{t.deleteAccount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
          {t.account}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, isDarkMode && styles.darkTabsContainer]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'personal' && styles.tabActive]}
          onPress={() => setActiveTab('personal')}
        >
          <Text style={[styles.tabText, activeTab === 'personal' && styles.tabTextActive]}>
            {t.personalShort}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'security' && styles.tabActive]}
          onPress={() => setActiveTab('security')}
        >
          <Text style={[styles.tabText, activeTab === 'security' && styles.tabTextActive]}>
            {t.securityShort}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'privacy' && styles.tabActive]}
          onPress={() => setActiveTab('privacy')}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.tabTextActive]}>
            {t.privacyShort}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'personal' && renderPersonalInfo()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'privacy' && renderPrivacy()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  darkHeader: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
  },
  darkTabsContainer: {
    backgroundColor: '#1f2937',
    borderBottomColor: '#374151',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#00C8B4',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#00C8B4',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  darkSection: {
    backgroundColor: '#111827',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  darkText: {
    color: '#fff',
  },
  darkValue: {
    color: '#d1d5db',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1f2937',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  darkDivider: {
    backgroundColor: '#374151',
  },
  button: {
    backgroundColor: '#00C8B4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  darkButton: {
    backgroundColor: '#00C8B4',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  darkButtonText: {
    color: '#111827',
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  securityDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  darkSecurityDesc: {
    color: '#9ca3af',
  },
  securityBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  securityBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  link: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  privacyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  privacyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  privacyDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  darkPrivacyDesc: {
    color: '#9ca3af',
  },
  downloadBtn: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  downloadBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dangerBtn: {
    backgroundColor: '#fee2e2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  dangerBtnText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default AccountSettings;
