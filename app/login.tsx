import React, { useState, useRef, useEffect } from 'react';

import 
{
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useRouter } from 'expo-router';

import { sendOTP, confirmOTP } from '../services/authService';
import { auth } from '../firebase/firebaseConfig';

import { useAppContext } from '../contexts/AppContext';
import { useResponsiveStyles } from '../hooks/useResponsiveStyles';
import { translations } from '../localization/translations';
import { LanguageSelector } from '../components/LanguageSelector';
import { FooterIcons } from '../components/FooterIcons';

export const login: React.FC = () => {
  const router = useRouter();
  const { language, theme, playButtonSound } = useAppContext();
  const styles = useResponsiveStyles();
  const t = translations[language];

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  
  const otpInputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus on first OTP input box when OTP is sent
  useEffect(() => {
    if (otpSent && otpInputRefs.current[0]) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [otpSent]);

  const handleSettingsPress = () => {
    playButtonSound();
    router.push('/settings');
  };

  const handleContinue = async () => {
    playButtonSound();

    if (!otpSent) {
      sendOTPToPhone();
    } else {
      verifyOTP();
    }
  };

  const sendOTPToPhone = async () => {
    const fullPhoneNumber = '+91' + phoneNumber;

    if (phoneNumber.length !== 10 || !/^[6-9]\d{9}$/.test(phoneNumber)) {
      Alert.alert('Not a valid Number', 'Please enter a valid 10-digit Indian phone number.');
      return;
    }

    try {
      const verId = await sendOTP(fullPhoneNumber, recaptchaVerifier.current!);
      setVerificationId(verId);
      setOtpSent(true);
      setResendTimer(30); // 30 seconds cooldown for resend
      
      // Show alert that OTP has been sent
      Alert.alert(
        'OTP Sent',
        `a  verification code has been sent to +91 ${phoneNumber}`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('OTP sending failed:', error);
      Alert.alert('Failed to send OTP', error.message || 'Please try again');
    }
  };

  const verifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await confirmOTP(verificationId, otpCode);
      Alert.alert(
        'Success',
        'Phone number verified successfully!',
        [{ text: 'Continue', onPress: () => router.push("/(tabs)") }]
      );
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      Alert.alert('Verification Failed', error.message || 'Please check your OTP and try again');
    }
  };

  const handleResendOTP = async () => 
  {
    if (resendTimer > 0) return;
    playButtonSound();
    const fullPhoneNumber = '+91' + phoneNumber;
    
    try {
      const verId = await sendOTP(fullPhoneNumber, recaptchaVerifier.current!);
      setVerificationId(verId);
      setResendTimer(30);
      Alert.alert('OTP Resent', 'A new verification code has been sent to your phone');
    } catch (error: any) {
      console.error('Resending OTP failed:', error);
      Alert.alert('Failed to resend OTP', error.message || 'Please try again');
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus to next input
    if (text && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (event: any, index: number) => {
    // Handle backspace to move to previous input
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackToLogin = () => {
    setOtpSent(false);
    setOtp(['', '', '', '', '', '']);
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
        
        <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.gameImageContainer}>
  <Image
    source={require('../assets/background.png')}
    style={styles.gameImage}
  />

  {/* New container for license/trademark images */}
  <View style={styles.licenseContainer}>
    <Image
      source={require('../assets/images/license1.png')}
      style={styles.licenseImage}
    />
    <Image
      source={require('../assets/images/license2.png')}
      style={styles.licenseImage}
    />
    <Image
      source={require('../assets/images/license3.png')}
      style={styles.licenseImage}
    />
  </View>
</View>

          <View style={styles.formContainer}>
            <LanguageSelector />

            <Text style={styles.title}>{otpSent ? t.verification || 'Verification' : t.login}</Text>

            {!otpSent ? (
              <>
                {/* Phone and Password fields - shown before OTP is sent */}
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
                  <Text style={styles.buttonText}>{t.continueText || 'Continue'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* OTP fields - shown after OTP is sent */}
                <View style={styles.otpWrapper}>
                  <Text style={styles.subtitle}>
                    {t.otpSentMessage || `Enter the 6-digit code sent to +91 ${phoneNumber}`}
                  </Text>
                  <View style={styles.otpBoxesContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={`otp-${index}`}
                        ref={(ref) => (otpInputRefs.current[index] = ref)}
                        style={styles.otpBox}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                      />
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.resendButton}
                    onPress={handleResendOTP}
                    disabled={resendTimer > 0}
                  >
                    <Text
                      style={[
                        styles.resendText,
                        resendTimer > 0 ? { opacity: 0.5 } : null,
                      ]}
                    >
                      {resendTimer > 0
                        ? `${t.resendIn || 'Resend in'} ${resendTimer}s`
                        : t.resendOTP || 'Resend OTP'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.otpButtonsContainer}>
                    <TouchableOpacity 
                      style={[styles.button, { marginTop: 20 }]} 
                      onPress={handleContinue}
                    >
                      <Text style={styles.buttonText}>{t.verify || 'Verify'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.textButton, { marginTop: 10 }]} 
                      onPress={handleBackToLogin}
                    >
                      <Text style={styles.textButtonText}>
                        {t.back|| 'Back to Login'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default login;