import React, { ReactNode } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  maxHeight?: DimensionValue;
  containerStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  showCloseButton = true,
  maxHeight = '80%',
  containerStyle,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              isDarkMode ? styles.modalContentDark : styles.modalContentLight,
              { maxHeight },
              containerStyle,
            ]}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && (
                  <Text style={[styles.title, isDarkMode && styles.titleDark]}>
                    {title}
                  </Text>
                )}
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={isDarkMode ? '#fff' : '#333'}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Body */}
            <ScrollView
              style={styles.body}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            {/* Footer */}
            {footer && (
              <View style={styles.footer}>
                {footer}
              </View>
            )}
          </View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
  },
  modalContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContentLight: {
    backgroundColor: '#fff',
  },
  modalContentDark: {
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  titleDark: {
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  body: {
    padding: 20,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
