import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export const sendOTP = async (phone: string, recaptchaVerifier: FirebaseRecaptchaVerifierModal) => {
  const phoneProvider = new PhoneAuthProvider(auth);
  const verificationId = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier);
  return verificationId;
};

export const verifyOTP = async (verificationId: string, otp: string) => {
  const credential = PhoneAuthProvider.credential(verificationId, otp);
  return await signInWithCredential(auth, credential);
};

export const getFirebaseAuth = () => auth;