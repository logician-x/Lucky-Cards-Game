import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  SafeAreaView,         
  TouchableOpacity, 
  ScrollView,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
  Platform,
  Image
} from 'react-native';
import { styles } from '../../styles/index.styles';
import NotificationBanner from '../../components/NotificationBanner';
import UserSidebar from '../../components/userSideBar';
import NotePad from '../../components/NotePad';
import PaymentForm from '../../components/PaymentForm';

const CasinoIndexPage: React.FC = () => {
  const router = useRouter();
  const window = Dimensions.get('window');
  const balanceValue = new Animated.Value(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // New state variables for the added components
  const [notepadVisible, setNotepadVisible] = useState(false);
  const [addFundsVisible, setAddFundsVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);

  const balanceAnimation = balanceValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0', '1.28']
  });

  useEffect(() => {
    // Balance count-up animation
    Animated.timing(balanceValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, []);

  // Open sidebar animation
  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  };
  
  const handleAdd=()=>
  {
    router.push('/(tabs)/AddMoneyScreen');
  }
  // Close sidebar animation
  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      setSidebarVisible(false);
    });
  };

  const handleStart = () => {
    router.push('/(tabs)/GameScreen');
  };
  
  const handleSettingsPress = () => {
    console.log("Settings button pressed");
    router.push("/settings");
  };
  
  // Handlers for new functionality
  const openNotepad = () => {
    setNotepadVisible(true);
  };
  
  const openAddFunds = () => {
    setAddFundsVisible(true);
  };
  
  const openWithdraw = () => {
    setWithdrawVisible(true);
  };
 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B4513" barStyle="light-content" />
      
      {/* Header with logo, user info and balance */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity 
            style={styles.avatar}
            onPress={openSidebar}
          >
            <Text style={styles.avatarText}>JD</Text>
          </TouchableOpacity>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>user_123</Text>
            <Text style={styles.userId}>ID: 12345678</Text>
          </View>
        </View>
        
        <View style={styles.balanceContainer}>
          <TouchableOpacity 
            style={styles.balancePill}
            activeOpacity={0.8}
          >
            <Text style={styles.currencySymbol}>₹</Text>
            <Animated.Text style={styles.balanceText}>
              {balanceAnimation}
            </Animated.Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, {backgroundColor: '#4CAF50'}]}
            activeOpacity={0.7}
            onPress={handleAdd}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.withdrawButton]}
            activeOpacity={0.7}
            onPress={openWithdraw}
          >
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.iconButtonGroup}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleSettingsPress}
          >
            <Text style={{fontSize: 18}}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={openNotepad}
          >
            <Text style={{fontSize: 18}}>📋</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Main content */}
      <View style={styles.backgroundContainer}>
        {/* Notification banner component */}
        <NotificationBanner />
        <ScrollView contentContainerStyle={styles.mainContent}>
          {/* Logo/Featured Game */}
          <TouchableOpacity
            onPress={handleStart}
            activeOpacity={0.9}
          >
            <View>
              <View style={styles.hotTag}>
                <Text style={styles.hotTagText}>HOT 🔥</Text>
              </View>

              {/* Game image as logo */}
              <Image
                source={require('../../assets/background.png')}
                style={styles.gameIconImage}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        </ScrollView>      
      </View>
      
      {/* Bottom navigation */}
      <View style={[
        styles.bottomNav, 
        Platform.OS === 'ios' && {paddingBottom: 20} // Add extra padding for iOS
      ]}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Text style={styles.navIcon}>🎁</Text>
          <Text style={styles.navLabel}>Promotions</Text>
        </TouchableOpacity>
      </View>
      
      {/* User Sidebar */}
      <UserSidebar 
        visible={sidebarVisible} 
        onClose={closeSidebar} 
        slideAnim={slideAnim}
      />
      
      {/* Notepad Modal */}
      <NotePad 
        visible={notepadVisible}
        onClose={() => setNotepadVisible(false)}
      />
      
      {/* Add Funds Modal */}
      <PaymentForm
        visible={addFundsVisible}
        onClose={() => setAddFundsVisible(false)}
        type="add"
      />
      
      {/* Withdraw Modal */}
      <PaymentForm
        visible={withdrawVisible}
        onClose={() => setWithdrawVisible(false)}
        type="withdraw"
      />
    </SafeAreaView>
  );
};

export default CasinoIndexPage;