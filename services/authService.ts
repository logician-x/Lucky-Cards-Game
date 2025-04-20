// src/services/authService.ts
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { 
  PhoneAuthProvider, 
  signInWithCredential, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

// Get Firebase Auth instance - this is the function that's missing
export const getFirebaseAuth = () => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }
  return auth;
};

// Send OTP to user's phone
export const sendOTP = async (
  phoneNumber: string,
  recaptchaVerifier: FirebaseRecaptchaVerifierModal
): Promise<string> => {
  try {
    const auth = getFirebaseAuth();
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );
    return verificationId;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

// Verify OTP entered by user
export const confirmOTP = async (
  verificationId: string,
  otp: string
): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    await signInWithCredential(auth, credential);
  } catch (error) {
    console.error('Error confirming OTP:', error);
    throw error;
  }
};

// Sign out current user
export const signOutUser = async (): Promise<void> => {
  try {
    const auth = getFirebaseAuth();
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Listen to auth state changes
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};