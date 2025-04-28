import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { styles } from '../styles/gamescreen.styles';

// How to Play modal content component
const HowToPlayContent = ({ onClose }) => (
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>How to Play</Text>
    <Text style={styles.modalText}>
      1. Navigate through the maze using swipe gestures.{'\n'}
      2. Collect all gems to unlock the exit.{'\n'}
      3. Avoid enemies and traps.{'\n'}
      4. Find power-ups to help your journey.{'\n'}
      5. Complete levels within the time limit for bonus points.
    </Text>
    <TouchableOpacity style={[styles.modalButton, styles.primaryButton]} onPress={onClose}>
      <Text style={[styles.modalButtonText, styles.primaryButtonText]}>Got it!</Text>
    </TouchableOpacity>
  </View>
);

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [howToPlayModalVisible, setHowToPlayModalVisible] = useState(false);
  
  // Reset modal visibility when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      setHowToPlayModalVisible(false);
    }
  }, [isOpen]);

  // If sidebar is not open, we should only render the modal if needed
  if (!isOpen && !howToPlayModalVisible) return null;

  const menuItems = [
    {
      id: 1,
      icon: '🏠',
      label: 'Exit to home',
      action: () => {
        onClose();
        // Delay navigation slightly to ensure onClose completes
        setTimeout(() => {
          router.push('/');
        }, 100);
      }
    },
    {
      id: 2,
      icon: '❓',
      label: 'How to Play',
      action: () => {
        setHowToPlayModalVisible(true);
      }
    },
    {
      id: 3,
      icon: '⚙️',
      label: 'Settings',
      action: () => {
        onClose();
        // Delay navigation slightly to ensure onClose completes
        setTimeout(() => {
          router.push('/settings');
        }, 100);
      }
    }
  ];

  const closeModal = () => {
    setHowToPlayModalVisible(false);
  };

  // Add local styles if any styles are missing from gamescreen.styles.js
  const localStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '80%',
      maxWidth: 400,
    },
    modalBox: {
      backgroundColor: '#222',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      position: 'relative',
    },
    closeModalButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeModalText: {
      color: '#999',
      fontSize: 20,
      fontWeight: 'bold',
    },
    // Add any other missing styles here
  });

  // Combine imported styles with local styles
  const combinedStyles = {
    ...styles,
    modalOverlay: styles.modalOverlay || localStyles.modalOverlay,
    modalContainer: styles.modalContainer || localStyles.modalContainer,
    modalBox: styles.modalBox || localStyles.modalBox,
    closeModalButton: styles.closeModalButton || localStyles.closeModalButton,
    closeModalText: styles.closeModalText || localStyles.closeModalText,
  };

  return (
    <>
      {isOpen && (
        <View style={combinedStyles.sidebarContainer}>
          <TouchableOpacity
            style={[combinedStyles.sidebarItem, combinedStyles.closeButton]}
            onPress={onClose}
          >
            <Text style={combinedStyles.sidebarIcon}>❌</Text>
            <Text style={combinedStyles.sidebarLabel}>Menu</Text>
          </TouchableOpacity>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={combinedStyles.sidebarItem}
              onPress={item.action}
            >
              <Text style={combinedStyles.sidebarIcon}>{item.icon}</Text>
              <Text style={combinedStyles.sidebarLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* How To Play Modal */}
      <Modal
        visible={howToPlayModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={combinedStyles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeModal}
        >
          <View style={combinedStyles.modalContainer}>
            <TouchableOpacity 
              activeOpacity={1} 
              style={combinedStyles.modalBox}
              onPress={(e) => {
                // Stop propagation to prevent closing when clicking inside modal
                e.stopPropagation();
              }}
            >
              <HowToPlayContent onClose={closeModal} />
              <TouchableOpacity style={combinedStyles.closeModalButton} onPress={closeModal}>
                <Text style={combinedStyles.closeModalText}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const HamburgerMenu = ({ onPress }) => (
  <TouchableOpacity style={styles.hamburgerButton} onPress={onPress}>
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
  </TouchableOpacity>
);

export { Sidebar, HamburgerMenu };