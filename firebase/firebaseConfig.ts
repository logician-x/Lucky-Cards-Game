
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


const firebaseConfig = {
  apiKey: 'AIzaSyBWUsfd3z7HQ9aHu-E3zohXDT9qFBrnApk',
  authDomain: 'surat-72b71.firebaseapp.com',
  projectId: 'surat-72b71',
  storageBucket: 'surat-72b71.firebasestorage.app',
  messagingSenderId: '221164267842',
  appId: '1:221164267842:web:babacd077988d971cc00db',
  measurementId: 'G-DS8FNJV716',
};


const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);


let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(firebaseApp);
}



if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebaseApp, auth, analytics };
