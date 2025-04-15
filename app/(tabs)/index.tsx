// index.tsx
import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { styles } from '../../styles/index.styles';


const CasinoIndexPage: React.FC = () => {
  const router=useRouter();
const handleStart = () =>{
  router.push(('/(tabs)/Dashboard'));
}
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B4513" barStyle="light-content" />
      
      {/* Header with user info and balance */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>Avatar</Text>
          </View>
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>user_123</Text>
            <Text style={styles.userId}>ID: 12345678</Text>
          </View>
        </View>
        
        <View style={styles.balanceContainer}>
          <View style={styles.balancePill}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.balanceText}>1.28</Text>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.withdrawButton]}>
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.iconButtonGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <Text>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text>📋</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification banner */}
      <View style={styles.notificationBanner}>
        <Text style={styles.notificationText}>
          <Text style={styles.tealText}>5979435</Text>
          <Text style={styles.whiteText}> winning </Text>
          <Text style={styles.yellowText}>₹100 [Lucky Prize]</Text>
          <Text style={styles.whiteText}> in </Text>
          <Text style={styles.orangeText}>Daily Jackpot</Text>
        </Text>
      </View>

      {/* Main content */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Featured Game */}
        <View style={styles.gameCard}>
    <View style={styles.hotTag}>
      <Text style={styles.hotTagText}>HOT</Text>
    </View>
    <View style={styles.gameIcon}>
      <Text style={styles.gameIconText}>₹₹₹</Text>
    </View>
    <Text style={styles.gameName}>Money Coming</Text>

    <TouchableOpacity
      style={styles.playButton}
      onPress={handleStart}  // 
    >
      <Text style={styles.playButtonText}>PLAY NOW</Text>
    </TouchableOpacity>
  </View>
        
       
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navLabel}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🎁</Text>
          <Text style={styles.navLabel}>Promotions</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CasinoIndexPage;