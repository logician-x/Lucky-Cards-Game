// index.tsx
import React, { useState, useEffect } from 'react';
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

const CasinoIndexPage: React.FC = () => {
  const router = useRouter();
  const window = Dimensions.get('window');
  const balanceValue = new Animated.Value(0);
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

  const handleStart = () => {
    router.push('/(tabs)/GameScreen');
  };
  const handleSettingsPress=()=>
  {
    router.push('/settings');
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B4513" barStyle="light-content" />
      
      {/* Header with logo, user info and balance */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableOpacity style={styles.avatar}>
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
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.withdrawButton]}
            activeOpacity={0.7}
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
    </SafeAreaView>
  );
};

export default CasinoIndexPage;