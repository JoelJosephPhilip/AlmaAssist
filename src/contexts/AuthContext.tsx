"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { initFirebase } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Provides authentication state and methods to all child components */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /** Listen for auth state changes on mount */
  useEffect(() => {
    const { auth } = initFirebase();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /** Sign in with email and password */
  async function login(email: string, password: string) {
    const { auth } = initFirebase();
    await signInWithEmailAndPassword(auth, email, password);
  }

  /** Create a new account and store user profile in Firestore */
  async function signup(email: string, password: string) {
    const { auth, db } = initFirebase();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Create user document in Firestore (non-blocking — don't fail signup if this errors)
    try {
      await setDoc(doc(db, "users", credential.user.uid), {
        email: credential.user.email,
        createdAt: serverTimestamp(),
      });
    } catch (firestoreErr) {
      console.error("Failed to create user doc in Firestore:", firestoreErr);
    }
  }

  /** Sign out the current user */
  async function logout() {
    const { auth } = initFirebase();
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to access auth context — must be used within AuthProvider */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
