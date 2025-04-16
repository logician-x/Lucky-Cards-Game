import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

/**
 * Sends an OTP to the given phone number using Firebase PhoneAuth.
 * @param phone - Full phone number (e.g., +919123456789)
 * @param recaptchaVerifier - FirebaseRecaptchaVerifierModal ref
 * @returns Firebase verification ID used for OTP verification
 */
export const sendOTP = async (
  phone: string,
  recaptchaVerifier: FirebaseRecaptchaVerifierModal
): Promise<string> => {
  try {
    const phoneProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier);
    return verificationId;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

/**
 * Verifies the OTP using the verification ID from sendOTP.
 * @param verificationId - ID received from Firebase after sending OTP
 * @param otp - 6-digit OTP code entered by the user
 */
export const verifyOTP = async (verificationId: string, otp: string) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    return await signInWithCredential(auth, credential);
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

/**
 * Returns the Firebase auth instance (if needed elsewhere).
 */
export const getFirebaseAuth = () => auth;
