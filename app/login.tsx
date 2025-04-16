import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useRouter } from 'expo-router';

import { sendOTP } from '../services/authService';
import { auth } from '../firebase/firebaseConfig';

import { useAppContext } from '../contexts/AppContext';
import { useResponsiveStyles } from '../styles/theme';
import { translations } from '../localization/translations';
import { LanguageSelector } from '../components/LanguageSelector';
import { FooterIcons } from '../components/FooterIcons';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { language, playButtonSound } = useAppContext();
  const styles = useResponsiveStyles();
  const t = translations[language];

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const handleSettingsPress = () => {
    playButtonSound();
    router.push('/settings');
  };

  const handleContinue = async () => {
    playButtonSound();

    const fullPhoneNumber = '+91' + phoneNumber;

    if (phoneNumber.length !== 10 || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit Indian phone number.');
      return;
    }

    try {
      const verificationId = await sendOTP(fullPhoneNumber, recaptchaVerifier.current!);
      router.push({
        pathname: '/otp',
        params: {
          phone: fullPhoneNumber,
          verificationId,
        },
      });
    } catch (error: any) {
      console.error('OTP sending failed:', error);
      Alert.alert('Failed to send OTP', error.message || 'Please try again');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* 🔐 Important for Firebase phone auth */}
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification={true}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.settingsButton} onPress={handleSettingsPress}>
          <MaterialIcons name="settings" size={24} color="#FFD700" />
        </TouchableOpacity>
        
        <View style={styles.contentContainer}>
          <View style={styles.gameImageContainer}>
            <Image
              source={require('../assets/background.png')}
              style={styles.gameImage}
            />
          </View>
          <View style={styles.formContainer}>
            <LanguageSelector />
            <Text style={styles.title}>{t.login}</Text>
            
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder={t.phoneNumber}
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={10}
              />
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder={t.password}
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>{t.continueText}</Text>
            </TouchableOpacity>

          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;
