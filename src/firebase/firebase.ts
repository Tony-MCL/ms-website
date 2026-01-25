// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Disse må ligge i .env (Vite) i ms-website:
// VITE_FIREBASE_API_KEY=...
// VITE_FIREBASE_AUTH_DOMAIN=...
// VITE_FIREBASE_PROJECT_ID=...
// VITE_FIREBASE_APP_ID=...
// (evt) VITE_FIREBASE_STORAGE_BUCKET=...
// (evt) VITE_FIREBASE_MESSAGING_SENDER_ID=...

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
