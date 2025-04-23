// components/NotificationBanner.tsx
import React, { useEffect } from 'react';
import { View, Text, Animated, Easing, Dimensions, StyleSheet } from 'react-native';

const NotificationBanner: React.FC = () => {
  const window = Dimensions.get('window');
  const notificationTranslateX = new Animated.Value(window.width * 0.3); // Start from right edge of banner
  
  useEffect(() => {
    // Notification banner animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(notificationTranslateX, {
          toValue: -(window.width * 0.9), // Move further to ensure text scrolls completely
          duration: 15000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(notificationTranslateX, {
          toValue: window.width * 0.3,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      // Clean up animation when component unmounts
      notificationTranslateX.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.bannerWrapper}>
      <View style={styles.notificationBanner}>
      <Text style={styles.soundIcon}>🔊 </Text>
        <Animated.View 
          style={[
            styles.notificationText, 
            { transform: [{ translateX: notificationTranslateX }] }
          ]}
        >
          
          <Text style={styles.tealText}>5979435</Text>
          <Text style={styles.whiteText}> winning </Text>
          <Text style={styles.yellowText}>₹100 [Lucky Prize]</Text>
          <Text style={styles.whiteText}> in </Text>
          <Text style={styles.orangeText}>Daily Jackpot</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  notificationBanner: {
    backgroundColor: 'rgba(51, 51, 51, 0.7)', // Transparent background
    height: 40,
    width: '60%', // Takes only 60% of screen width
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationText: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingHorizontal: 10,
    width: '300%' // Make it wide enough for long text
  },
  soundIcon: {
    fontSize: 16,
    marginRight: 5,
    color: '#FFF',
  },
  tealText: {
    color: '#40E0D0',
    fontWeight: 'bold',
    fontSize: 16
  },
  whiteText: {
    color: 'white',
    fontSize: 16
  },
  yellowText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16
  },
  orangeText: {
    color: '#FFA500',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default NotificationBanner;