import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useRouter } from 'expo-router';
import { sendOTP } from '../services/authService';
import { firebaseApp } from '../firebase/firebaseConfig';
import { useResponsiveStyles } from '../styles/theme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const router = useRouter();
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

  const handleNext = async () => {
    if (phone.length < 10 || password.length < 4) {
      alert('Please enter a valid phone number and password.');
      return;
    }

    try {
      const fullPhone = `+91${phone}`;
      const verificationId = await sendOTP(fullPhone, recaptchaVerifier.current!);
      router.push({
        pathname: '/otp',
        params: { verificationId, phone: fullPhone },
      });
    } catch (error) {
      console.error(error);
      alert('Failed to send OTP');
    }
  };

  const handleSettings = () => {
    // Handle settings action
    alert('Settings pressed');
  };

  return (
    <ImageBackground 
      source={require('../assets/background.jpg')} 
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseApp.options}
          attemptInvisibleVerification={true}
        />

        {/* Settings Icon */}
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color="#FFD700" />
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

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>BetMaster</Text>

            {/* Phone Input */}
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={[styles.input, styles.phoneInput]}
                maxLength={10}
              />
            </View>

            {/* Password Input */}
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}