// UserSidebar.tsx
import React,{useState} from 'react';
import { 
  View, 
  Modal,
  Text, 
  ImageSourcePropType,
  TouchableOpacity, 
  Image, 
  Animated, 
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { userSidebarStyles as styles } from '../styles/userSidebar.styles';
import { getAuth, signOut } from 'firebase/auth';
interface UserSidebarProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

const avatarOptions = [
  require('../assets/avatars/avatar1.png'),
  require('../assets/avatars/avatar2.png'),
  require('../assets/avatars/avatar3.jpg'),
  require('../assets/avatars/avatar4.jpg'),
];
const UserSidebar: React.FC<UserSidebarProps> = ({ visible, onClose, slideAnim }) => {
  const router = useRouter();
  const window = Dimensions.get('window');
  const [profileImage, setProfileImage] = useState(avatarOptions[0]);
  const [selectedAvatar, setSelectedAvatar] = useState<ImageSourcePropType | null>(null);
  const [modalVisible, setModalVisible] = useState(false);



  const sidebarStyle = {
    transform: [
      {
        translateX: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-300, 0],
        }),
      },
    ],
  };

  const handleAvatarSelect = (image: ImageSourcePropType) => {
    setProfileImage(image);
    setModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
     <View style={[styles.container, { display: visible ? 'flex' : 'none' }]}>
      {/* Dark overlay */}
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>
        Select Your Avatar
      </Text>
      
      <View style={styles.avatarGrid}>
        {avatarOptions.map((img, index) => (
          <TouchableOpacity
  key={index}
  onPress={() => {
    setProfileImage(img);       // Immediately set avatar
    setModalVisible(false);     // Close modal
  }}
  style={[
    styles.avatarButton,
    profileImage === img && styles.avatarImage,  // Highlight selected avatar
  ]}
>
  <Image source={img} style={styles.avatarImage} />
</TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={() => setModalVisible(false)}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>
            CANCEL
          </Text>
        </TouchableOpacity>
        
       
      </View>
    </View>
  </View>
</Modal>
      {/* Sidebar Content */}
      <Animated.View style={[styles.sidebar, sidebarStyle, { height: window.height }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* User Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={profileImage}
              style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
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
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
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
