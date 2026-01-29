import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n/translations';

interface SecurityPrivacyProps {
  onBack: () => void;
}

const SecurityPrivacy: React.FC<SecurityPrivacyProps> = ({ onBack }) => {
  const { isDarkMode, language } = useAppContext();
  const t = translations[language];
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(false);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
          {t.securityAndPrivacy}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* SECURITY SECTION */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield" size={20} color="#00C8B4" />
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              {t.security}
            </Text>
          </View>

          <View style={[styles.card, isDarkMode && styles.darkCard]}>
            {/* Password Change */}
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
                  {t.passwordChange}
                </Text>
                <Text style={[styles.settingDesc, isDarkMode && styles.darkSettingDesc]}>
                  {t.passwordChangeDesc}
                </Text>
              </View>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>{t.change}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

            {/* Two Factor */}
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
                  {t.twoFactor}
                </Text>
                <Text style={[styles.settingDesc, isDarkMode && styles.darkSettingDesc]}>
                  {t.twoFactorDesc}
                </Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: '#e5e7eb', true: '#86efac' }}
                thumbColor={twoFactorEnabled ? '#10b981' : '#9ca3af'}
              />
            </View>

            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

            {/* Active Sessions */}
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
                  {t.activeSessions}
                </Text>
                <Text style={[styles.settingDesc, isDarkMode && styles.darkSettingDesc]}>
                  {t.activeSessionsDesc}
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.viewLink}>{t.view}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* PRIVACY SECTION */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text" size={20} color="#7c3aed" />
            <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>
              {t.privacy}
            </Text>
          </View>

          <View style={[styles.card, isDarkMode && styles.darkCard]}>
            {/* Data Collection */}
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
                  {t.dataCollection}
                </Text>
                <Text style={[styles.settingDesc, isDarkMode && styles.darkSettingDesc]}>
                  {t.dataCollectionDesc}
                </Text>
              </View>
              <Switch
                value={dataCollection}
                onValueChange={setDataCollection}
                trackColor={{ false: '#e5e7eb', true: '#86efac' }}
                thumbColor={dataCollection ? '#10b981' : '#9ca3af'}
              />
            </View>

            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

            {/* Share Analytics */}
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
                  {t.shareAnalytics}
                </Text>
                <Text style={[styles.settingDesc, isDarkMode && styles.darkSettingDesc]}>
                  {t.shareAnalyticsDesc}
                </Text>
              </View>
              <Switch
                value={shareAnalytics}
                onValueChange={setShareAnalytics}
                trackColor={{ false: '#e5e7eb', true: '#86efac' }}
                thumbColor={shareAnalytics ? '#10b981' : '#9ca3af'}
              />
            </View>

            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

            {/* Download Data */}
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, isDarkMode && styles.darkText]}>
                  {t.downloadData}
                </Text>
                <Text style={[styles.settingDesc, isDarkMode && styles.darkSettingDesc]}>
                  {t.downloadDataDesc}
                </Text>
              </View>
              <TouchableOpacity style={styles.downloadBtn}>
                <Text style={styles.downloadBtnText}>{t.download}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* WARNING SECTION */}
        <View style={[styles.warningBox, isDarkMode && styles.darkWarningBox]}>
          <Ionicons name="alert-circle" size={20} color="#dc2626" />
          <View style={styles.warningContent}>
            <Text style={[styles.warningTitle, isDarkMode && styles.darkText]}>
              {t.dangerZone}
            </Text>
            <Text style={[styles.warningDesc, isDarkMode && styles.darkWarningDesc]}>
              {t.deleteAccountWarning}
            </Text>
          </View>
        </View>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => Alert.alert(t.confirm, t.deleteAccountConfirm)}
        >
          <Text style={styles.deleteBtnText}>{t.deleteAccount}</Text>
        </TouchableOpacity>

        {/* Privacy Policy Link */}
        <TouchableOpacity style={styles.linkSection}>
          <Text style={[styles.linkText, isDarkMode && styles.darkLinkText]}>
            {t.privacyPolicy}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkSection}>
          <Text style={[styles.linkText, isDarkMode && styles.darkLinkText]}>
            {t.termsOfService}
          </Text>
        </TouchableOpacity>
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
  darkText: {
    color: '#fff',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: '#1f2937',
    shadowOpacity: 0.3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    color: '#9ca3af',
  },
  darkSettingDesc: {
    color: '#9ca3af',
  },
  actionBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  viewLink: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  darkDivider: {
    backgroundColor: '#374151',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
    gap: 12,
    marginBottom: 16,
  },
  darkWarningBox: {
    backgroundColor: '#7f1d1d',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 4,
  },
  warningDesc: {
    fontSize: 12,
    color: '#991b1b',
  },
  darkWarningDesc: {
    color: '#fca5a5',
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  deleteBtnText: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },
  linkSection: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  darkLinkText: {
    color: '#60a5fa',
  },
});

export default SecurityPrivacy;
