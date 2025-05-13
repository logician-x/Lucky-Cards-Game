// UserSidebar.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Animated, 
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { userSidebarStyles as styles } from '../styles/userSidebar.styles';

interface UserSidebarProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ visible, onClose, slideAnim }) => {
  const router = useRouter();
  const window = Dimensions.get('window');
  
  if (!visible) {
    return null;
  }

  const sidebarStyle = {
    transform: [
      { translateX: slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 0]
      })}
    ]
  };

  return (
    <View style={styles.container}>
      {/* Dark overlay */}
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Sidebar Content */}
      <Animated.View style={[styles.sidebar, sidebarStyle, { height: window.height }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={require('../assets/images/profile-placeholder.png')}
                style={styles.profileImage}
                defaultSource={require('../assets/images/profile-placeholder.png')}
              />
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfoContainer}>
              <View style={styles.vipBadge}>
                <Text style={styles.vipText}>VIP</Text>
              </View>
              <Text style={styles.username}>user_1661...</Text>
              <Text style={styles.userId}>ID:16613177</Text>
            </View>
          </View>

          {/* Account Balance Section */}
          <View style={styles.balanceSection}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Total Cash:</Text>
              <Text style={styles.balanceValue}>25.7</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Bonus:</Text>
              <Text style={styles.balanceValue}>9.9</Text>
            </View>
          </View>

          {/* Contact Section */}
          <View style={styles.contactSection}>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Mobile:</Text>
              <Text style={styles.contactValue}>+91 9049454429</Text>
            </View>
          </View>

          

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <View style={styles.logoutContent}>
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </View>
  );
 
};
 export default UserSidebar;
