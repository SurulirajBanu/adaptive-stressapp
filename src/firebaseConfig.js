/**
 * firebaseConfig.js — Firebase initialisation and service exports.
 *
 * Exports:
 *   auth     — Firebase Auth instance (AsyncStorage persistence, survives restarts)
 *   db       — Firestore instance (long-polling enabled for React Native compatibility)
 *   database — Firebase Realtime Database instance
 *
 * Guard against duplicate initialisation (getApps().length > 0) prevents crashes
 * from React Native Fast Refresh re-running this module.
 *
 * Realtime Database paths used across the app:
 *   breathingSessions/{uid}        — Breathing.js
 *   meditationSessions/{uid}       — Meditation.js
 *   problemSolvingSessions/{uid}   — ProblemSolving.js
 *   moodCalendar/{uid}/{YYYY-MM-DD}— MoodCalendar.js
 *   userMoods/{uid}/entries        — WeeklyMood.js
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlWuxf93t0f-LasSlx6uUABL3FOYdlfYA",
  authDomain: "adaptive-stress-app.firebaseapp.com",
  projectId: "adaptive-stress-app",
  storageBucket: "adaptive-stress-app.appspot.com",
  messagingSenderId: "99627827278",
  appId: "1:99627827278:android:14f8b93577fdc66876431f"
};

// Prevent multiple app initialization
const isAppInitialized = getApps().length > 0;
const app = isAppInitialized ? getApp() : initializeApp(firebaseConfig);

// Auth with AsyncStorage persistence so session survives app restarts
const auth = isAppInitialized
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

// Firestore
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});

// Realtime Database
const database = getDatabase(app);

export { auth, db, database };