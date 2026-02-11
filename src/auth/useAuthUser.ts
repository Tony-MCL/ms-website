// src/auth/useAuthUser.ts
// Clean-room Firebase Auth hook for ms-website
// Identisk logikk som i appen – men repo-lokal

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

export type AuthUser = {
  uid: string;
  email: string;
};

export type UseAuthUserResult = {
  user: AuthUser | null;
  ready: boolean;

  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
};

function getFirebaseConfig() {
  const apiKey = String(import.meta.env.VITE_FIREBASE_API_KEY || "");
  const authDomain = String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "");
  const projectId = String(import.meta.env.VITE_FIREBASE_PROJECT_ID || "");

  if (!apiKey || !authDomain || !projectId) {
    throw new Error(
      "Missing Firebase env vars. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID."
    );
  }

  return { apiKey, authDomain, projectId };
}

function ensureFirebaseApp() {
  if (getApps().length) return;
  initializeApp(getFirebaseConfig());
}

export function useAuthUser(): UseAuthUserResult {
  const [fbUser, setFbUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    try {
      ensureFirebaseApp();
      const auth = getAuth();
      unsub = onAuthStateChanged(auth, (u) => {
        setFbUser(u);
        setReady(true);
      });
    } catch (e) {
      console.warn("[auth] Firebase init failed", e);
      setFbUser(null);
      setReady(true);
    }

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const user: AuthUser | null = useMemo(() => {
    if (!fbUser) return null;
    return { uid: fbUser.uid, email: fbUser.email || "" };
  }, [fbUser]);

  const signInFn = useCallback(async (email: string, password: string) => {
    ensureFirebaseApp();
    await signInWithEmailAndPassword(getAuth(), email, password);
  }, []);

  const registerFn = useCallback(async (email: string, password: string) => {
    ensureFirebaseApp();
    await createUserWithEmailAndPassword(getAuth(), email, password);
  }, []);

  const signOutFn = useCallback(async () => {
    ensureFirebaseApp();
    await signOut(getAuth());
  }, []);

  const getIdTokenFn = useCallback(async (forceRefresh?: boolean) => {
    try {
      ensureFirebaseApp();
      const u = getAuth().currentUser;
      if (!u) return null;
      return await u.getIdToken(!!forceRefresh);
    } catch {
      return null;
    }
  }, []);

  return {
    user,
    ready,
    signIn: signInFn,
    register: registerFn,
    signOut: signOutFn,
    getIdToken: getIdTokenFn,
  };
}
