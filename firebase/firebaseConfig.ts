// firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// ✅ Add these imports for compat support
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA3Z3fsY-1k3diVSpb66RMgg3sjqNBlKdE',
  authDomain: 'surat-632c7.firebaseapp.com',
  projectId: 'surat-632c7',
  storageBucket: 'surat-632c7.appspot.com', // 🔧 typo fix: changed from firebasestorage.app
  messagingSenderId: '300902053741',
  appId: '1:300902053741:web:76260e08d858c054898c64',
  measurementId: 'G-NGM0HQJRSW',
};

// ✅ Initialize both modular and compat Firebase apps
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

// ✅ Initialize compat app (needed for expo-firebase-recaptcha)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebaseApp, auth };
