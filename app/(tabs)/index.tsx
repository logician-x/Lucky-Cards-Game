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
  Image,
  Alert
} from 'react-native';
import { styles } from '../../styles/index.styles';
import NotificationBanner from '../../components/NotificationBanner';
import UserSidebar from '../../components/userSideBar';

const CasinoIndexPage: React.FC = () => {
  const router = useRouter();
  const window = Dimensions.get('window');
  const balanceValue = new Animated.Value(0);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [balance, setBalance] = useState('1.28');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const balanceAnimation = balanceValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0', balance]
  });

  useEffect(() => {
    // Balance count-up animation
    Animated.timing(balanceValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [balance]);

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
    try {
      router.push('/(tabs)/GameScreen');
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Navigation Error", "Could not navigate to game screen. Please try again.");
    }
  };
  
  const handleSettingsPress = () => {
    try {
      // Use the correct path format matching your folder structure
      router.push('/settings');
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Navigation Error", "Could not navigate to settings. Please try again.");
    }
  };
  
  const handleAddMoney = () => {
    try {
      // Use the correct path format matching your folder structure
      router.push('/(tabs)/AddMoneyScreen');
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Navigation Error", "Could not navigate to Add Money screen. Please try again.");
    }
  };
  
  const handleWithdraw = () => {
    try {
      // Use the correct path format matching your folder structure
      router.push('/');
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Navigation Error", "Could not navigate to Withdraw screen. Please try again.");
    }
  };

  // Listen for wallet balance changes
  useEffect(() => {
    // In a real app, you would have a function to fetch the updated balance
    const checkForBalanceUpdates = () => {
      // This would typically be an API call to check for balance updates
    };
    
    const intervalId = setInterval(checkForBalanceUpdates, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

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
            onPress={handleAddMoney}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.withdrawButton]}
            activeOpacity={0.7}
            onPress={handleWithdraw}
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
          <TouchableOpacity style={styles.iconButton}>
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
    </SafeAreaView>
  );
};

export default CasinoIndexPage;