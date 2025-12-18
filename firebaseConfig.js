import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace the values below with your specific Firebase keys
const firebaseConfig = {
  apiKey: "AIzaSyBlWuxf93t0f-LasSlx6uUABL3FOYdlfYA",
  authDomain: "adaptive-stressapp.firebaseapp.com",
  projectId: "adaptive-stressapp",
  storageBucket: "adaptive-stressapp.appspot.com",
  messagingSenderId: "99627827278",
  appId: "1:99627827278:android:14f8b93577fdc66876431f"
};

const app = initializeApp(firebaseConfig);

// This ensures the user stays logged in even after closing the app
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };