import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ImageBackground,
  Animated,
  Easing,
  Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyOTP } from '../services/authService';
import { useResponsiveStyles } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { verificationId, phone } = useLocalSearchParams<{ verificationId: string; phone: string }>();
  const styles = useResponsiveStyles();
  
  // Animation value for zooming effect
  const animatedScale = useRef(new Animated.Value(1)).current;

  // Create animation sequence for zoom in/out effect
  useEffect(() => {
    const startAnimation = () => {
      Animated.sequence([
        // Zoom in
        Animated.timing(animatedScale, {
          toValue: 1.15,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        // Zoom out
        Animated.timing(animatedScale, {
          toValue: 1,
          duration: 5000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ]).start(() => startAnimation()); // Restart animation when complete
    };

    startAnimation();
    
    return () => {
      // Clean up animation when component unmounts
      animatedScale.stopAnimation();
    };
  }, []);

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP');
      return;
    }
    
    try {
      await verifyOTP(verificationId, otp);
      router.replace('/'); // Or '/tabs'
    } catch (error) {
      console.error(error);
      Alert.alert('OTP verification failed');
    }
  };

  const handleSettings = () => {
    // Handle settings action
    Alert.alert('Settings', 'Settings menu would open here');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* Settings Icon */}
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color="#FFD700" />
        </TouchableOpacity>
        
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFD700" />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          {/* Game Image with Animation */}
          <View style={styles.gameImageContainer}>
            <Animated.View
              style={{
                transform: [{ scale: animatedScale }],
                overflow: 'hidden',
              }}
            >
              <Image 
                source={require('../assets/background.png')} 
                style={styles.gameImage} 
              />
            </Animated.View>
          </View>

          {/* OTP Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>Code sent to {phone}</Text>

            <View style={styles.otpContainer}>
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor="#aaa"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                style={styles.otpInput}
                maxLength={6}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}