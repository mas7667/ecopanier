import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../hooks/useTheme';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Sélectionner une date',
  minimumDate,
  maximumDate,
}) => {
  const { isDarkMode } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, isDarkMode && styles.labelDark]}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        style={[
          styles.input,
          isDarkMode ? styles.inputDark : styles.inputLight,
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={isDarkMode ? '#aaa' : '#666'}
        />
        <Text
          style={[
            styles.inputText,
            isDarkMode && styles.inputTextDark,
            !value && styles.placeholder,
          ]}
        >
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        Platform.OS === 'ios' ? (
          <Modal
            transparent
            animationType="slide"
            visible={showPicker}
            onRequestClose={() => setShowPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View
                style={[
                  styles.modalContent,
                  isDarkMode && styles.modalContentDark,
                ]}
              >
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={styles.modalButton}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowPicker(false)}>
                    <Text style={[styles.modalButton, styles.modalButtonPrimary]}>
                      Confirmer
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={value || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleChange}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  textColor={isDarkMode ? '#fff' : '#000'}
                />
              </View>
            </View>
          </Modal>
        ) : (
          <DateTimePicker
            value={value || new Date()}
            mode="date"
            display="default"
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  labelDark: {
    color: '#fff',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
  },
  inputLight: {
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
  },
  inputDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
  },
  inputText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  inputTextDark: {
    color: '#fff',
  },
  placeholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  modalContentDark: {
    backgroundColor: '#1e1e1e',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalButton: {
    fontSize: 16,
    color: '#666',
  },
  modalButtonPrimary: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});
