import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { styles } from '../styles/gamescreen.styles';
const Sidebar = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const menuItems = [
    { id: 1, icon: '🏠', label: 'Exit to home' },
    { id: 2, icon: '❓', label: 'How to Play' },
    { id: 3, icon: '⚙️', label: 'Settings' }
  ];

  return (
    <View style={styles.sidebarContainer}>
      <TouchableOpacity
        style={[styles.sidebarItem, styles.closeButton]}
        onPress={onClose}
      >
        <Text style={styles.sidebarIcon}>❌</Text>
        <Text style={styles.sidebarLabel}>Menu</Text>
      </TouchableOpacity>
      {menuItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.sidebarItem}
          onPress={() => {
            onClose();
            Alert.alert(item.label, `You selected ${item.label}`);
          }}
        >
          <Text style={styles.sidebarIcon}>{item.icon}</Text>
          <Text style={styles.sidebarLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const HamburgerMenu = ({ onPress }) => (
  <TouchableOpacity style={styles.hamburgerButton} onPress={onPress}>
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
    <View style={styles.hamburgerLine} />
  </TouchableOpacity>
);

// const styles = StyleSheet.create({
//   sidebarContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     width: 200,
//     backgroundColor: 'rgba(0, 0, 0, 0.85)',
//     zIndex: 10,
//     padding: 20,
//   },
//   sidebarItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   closeButton: {
//     marginBottom: 20,
//   },
//   sidebarIcon: {
//     fontSize: 20,
//     marginRight: 15,
//     color: 'white',
//   },
//   sidebarLabel: {
//     color: 'white',
//     fontSize: 16,
//   },
//   hamburgerButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'space-around',
//     flexDirection: 'column',
//     padding: 10,
//   },
//   hamburgerLine: {
//     width: '100%',
//     height: 3,
//     backgroundColor: 'white',
//     borderRadius: 5,
//   },
// });

export { Sidebar, HamburgerMenu };