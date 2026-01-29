import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { translations } from '../i18n/translations';

interface PersonalInfoProps {
  onBack: () => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ onBack }) => {
  const { isDarkMode, language } = useAppContext();
  const t = translations[language];
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('Jean Dupont');
  const [email, setEmail] = useState('jean@example.com');
  const [phone, setPhone] = useState('+33 6 12 34 56 78');

  const handleSave = () => {
    Alert.alert('Succès', 'Vos informations ont été mises à jour');
    setIsEditing(false);
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#111827'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
          {t.personalInfo}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Avatar Section */}
        <View style={[styles.avatarSection, isDarkMode && styles.darkAvatarSection]}>
          <View style={[styles.avatar, isDarkMode && styles.darkAvatar]}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={[styles.profileName, isDarkMode && styles.darkText]}>Jean Dupont</Text>
          <Text style={[styles.profileEmail, isDarkMode && styles.darkProfileEmail]}>jean@example.com</Text>
        </View>

        {/* Info Cards */}
        <View style={[styles.section, isDarkMode && styles.darkSection]}>
          <View style={[styles.card, isDarkMode && styles.darkCard]}>
            {/* Full Name */}
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Ionicons name="person" size={20} color="#00C8B4" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
                  {t.fullName}
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder={t.fullName}
                  />
                ) : (
                  <Text style={[styles.value, isDarkMode && styles.darkValue]}>
                    {fullName}
                  </Text>
                )}
              </View>
            </View>

            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

            {/* Email */}
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Ionicons name="mail" size={20} color="#3b82f6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
                  {t.email}
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    value={email}
                    onChangeText={setEmail}
                    placeholder={t.email}
                    keyboardType="email-address"
                  />
                ) : (
                  <Text style={[styles.value, isDarkMode && styles.darkValue]}>
                    {email}
                  </Text>
                )}
              </View>
            </View>

            <View style={[styles.divider, isDarkMode && styles.darkDivider]} />

            {/* Phone */}
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Ionicons name="call" size={20} color="#f59e0b" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
                  {t.phone}
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, isDarkMode && styles.darkInput]}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder={t.phone}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={[styles.value, isDarkMode && styles.darkValue]}>
                    {phone}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Action Button */}
        {isEditing ? (
          <TouchableOpacity
            style={[styles.saveButton, isDarkMode && styles.darkSaveButton]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark" size={18} color={isDarkMode ? '#111827' : '#fff'} />
            <Text style={[styles.saveButtonText, isDarkMode && styles.darkSaveButtonText]}>
              {t.saveChanges}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.editButton, isDarkMode && styles.darkEditButton]}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.editButtonText}>
              {t.editProfile}
            </Text>
          </TouchableOpacity>
        )}

        {/* Info Section */}
        <View style={[styles.infoBox, isDarkMode && styles.darkInfoBox]}>
          <Text style={[styles.infoBoxTitle, isDarkMode && styles.darkText]}>
            {t.accountInfo}
          </Text>
          <Text style={[styles.infoBoxDesc, isDarkMode && styles.darkInfoBoxDesc]}>
            {t.accountInfoDesc}
          </Text>
        </View>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  darkAvatarSection: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00C8B4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  darkAvatar: {
    backgroundColor: '#00C8B4',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    color: '#9ca3af',
  },
  darkProfileEmail: {
    color: '#9ca3af',
  },
  section: {
    marginBottom: 20,
  },
  darkSection: {
    backgroundColor: '#111827',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconWrapper: {
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
  darkLabel: {
    color: '#9ca3af',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  darkValue: {
    color: '#fff',
  },
  input: {
    fontSize: 15,
    color: '#111827',
    borderBottomWidth: 2,
    borderBottomColor: '#00C8B4',
    paddingVertical: 4,
  },
  darkInput: {
    color: '#fff',
    borderBottomColor: '#00C8B4',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  darkDivider: {
    backgroundColor: '#374151',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00C8B4',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  darkEditButton: {
    backgroundColor: '#00C8B4',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  darkSaveButton: {
    backgroundColor: '#10b981',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  darkSaveButtonText: {
    color: '#111827',
  },
  infoBox: {
    backgroundColor: '#f3f4f6',
    borderLeftWidth: 4,
    borderLeftColor: '#00C8B4',
    padding: 12,
    borderRadius: 8,
  },
  darkInfoBox: {
    backgroundColor: '#1f2937',
    borderLeftColor: '#00C8B4',
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  infoBoxDesc: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  darkInfoBoxDesc: {
    color: '#d1d5db',
  },
});

export default PersonalInfo;
