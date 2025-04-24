// components/NotificationBanner.tsx
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Animated, 
  Easing, 
  Dimensions, 
  StyleSheet, 
  Image,
  TouchableOpacity
} from 'react-native';

interface NotificationMessage {
  id?: string;
  action?: string;
  amount?: string;
  game?: string;
}

interface NotificationBannerProps {
  visible?: boolean;
  message?: NotificationMessage;
  duration?: number;
  position?: 'top' | 'bottom';
  onClose?: () => void;
  autoHide?: boolean;
  autoHideDuration?: number;
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
  position = 'top',
  onClose,
  autoHide = false,
  autoHideDuration = 5000
}) => {
  const window = Dimensions.get('window');
  const notificationTranslateX = useRef(new Animated.Value(window.width * 0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(visible);
  const animationLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Handle visibility changes from props
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [visible, opacityAnim]);

  // Set up auto-hide if enabled
  useEffect(() => {
    if (isVisible && autoHide) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          setIsVisible(false);
        }
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, autoHideDuration, onClose]);

  // Set up animation
  useEffect(() => {
    if (isVisible) {
      // Reset the value to ensure animation starts correctly
      notificationTranslateX.setValue(window.width * 0.3);
      
      // Create animation loop
      animationLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(notificationTranslateX, {
            toValue: -(window.width * 0.8),
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
      
      // Start animation
      animationLoopRef.current.start();

      return () => {
        if (animationLoopRef.current) {
          animationLoopRef.current.stop();
        }
      };
    }
  }, [isVisible, window.width, duration, notificationTranslateX]);

  // If component is not visible, don't render anything
  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        styles.bannerContainer, 
        position === 'bottom' ? { bottom: 20 } : { top: 40 },
        { opacity: opacityAnim }
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.bannerWrapper} pointerEvents="box-none">
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
          
          {onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 10,
    pointerEvents: 'box-none',
  },
  bannerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    pointerEvents: 'box-none',
  },
  notificationBanner: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: 24,
    width: '60%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 0.1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    left: 8,
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
    fontSize: 14
  },
  whiteText: {
    color: 'white',
    fontSize: 14
  },
  yellowText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 14
  },
  orangeText: {
    color: '#FFA500',
    fontWeight: 'bold',
    fontSize: 14
  },
  soundIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    zIndex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
    textAlign: 'center',
  }
});

export default NotificationBanner;