// firebase/firebaseConfig.ts

// ✅ Modular imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// ✅ Compat imports (needed for expo-firebase-recaptcha)
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// ✅ Your new Firebase project config
const firebaseConfig = {
  apiKey: 'AIzaSyBWUsfd3z7HQ9aHu-E3zohXDT9qFBrnApk',
  authDomain: 'surat-72b71.firebaseapp.com',
  projectId: 'surat-72b71',
  storageBucket: 'surat-72b71.firebasestorage.app',
  messagingSenderId: '221164267842',
  appId: '1:221164267842:web:babacd077988d971cc00db',
  measurementId: 'G-DS8FNJV716',
};

// ✅ Initialize modular app
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// ✅ Optionally initialize analytics (only works in web environments)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(firebaseApp);
}

// ✅ Initialize compat app (required for expo-firebase-recaptcha)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebaseApp, auth, analytics };
