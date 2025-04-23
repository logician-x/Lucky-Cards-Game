// components/NotificationBanner.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Easing, Dimensions, StyleSheet, Image } from 'react-native';

interface NotificationBannerProps {
  visible?: boolean;
  message?: {
    id?: string;
    action?: string;
    amount?: string;
    game?: string;
  };
  duration?: number;
  position?: 'top' | 'bottom';
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  visible = true,
  message = {
    id: '5979435',
    action: 'winning',
    amount: '₹100 [Lucky Prize]',
    game: 'Daily Jackpot'
  },
  duration = 15000,
  position = 'top'
}) => {
  const window = Dimensions.get('window');
  const notificationTranslateX = new Animated.Value(window.width * 0.3);
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  useEffect(() => {
    if (isVisible) {
      // Notification banner animation
      const animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(notificationTranslateX, {
            toValue: -(window.width * 0.9),
            duration: duration,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
          Animated.timing(notificationTranslateX, {
            toValue: window.width * 0.3,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
      
      animationLoop.start();

      return () => {
        animationLoop.stop();
        notificationTranslateX.setValue(window.width * 0.3);
      };
    }
  }, [isVisible, window.width, duration]);

  if (!isVisible) return null;

  return (
    <View style={[styles.bannerContainer, position === 'bottom' && styles.bottomPosition]}>
      <View style={styles.bannerWrapper}>
        <View style={styles.notificationBanner}>
          {/* Sound icon positioned at the start */}
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/images/sound.png')}
              style={styles.soundIcon}
            />
          </View>
          
          <Animated.View
            style={[
              styles.notificationText,
              { transform: [{ translateX: notificationTranslateX }] }
            ]}
          >
            <Text style={styles.tealText}>{message.id}</Text>
            <Text style={styles.whiteText}> {message.action} </Text>
            <Text style={styles.yellowText}>{message.amount}</Text>
            <Text style={styles.whiteText}> in </Text>
            <Text style={styles.orangeText}>{message.game}</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 10,
  },
  
  bottomPosition: {
    bottom: 20,
  },
  bannerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  notificationBanner: {
    backgroundColor: 'rgba(222, 217, 217, 0.2)',
    height: 30,
    width: '60%',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    left: 10,
    zIndex: 10,
    height: '100%',
    justifyContent: 'center',
  },
  notificationText: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    paddingHorizontal: 10,
    width: '300%',
    left: 45, // Adjusted to leave space for the icon
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
  soundIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    zIndex: 1,
  },
  orangeText: {
    color: '#FFA500',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default NotificationBanner;