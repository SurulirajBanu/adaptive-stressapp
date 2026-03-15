import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBlWuxf93t0f-LasSlx6uUABL3FOYdlfYA",
  authDomain: "adaptive-stress-app.firebaseapp.com",
  projectId: "adaptive-stress-app",
  storageBucket: "adaptive-stress-app.appspot.com",
  messagingSenderId: "99627827278",
  appId: "1:99627827278:android:14f8b93577fdc66876431f"
};

// Prevent multiple app initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// Firestore
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
});

// Realtime Database
const database = getDatabase(app);

export { auth, db, database };