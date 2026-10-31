import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserAccount, UserRole, CandidateProfile } from '../types/job';

interface AuthContextType {
  currentUser: User | null;
  userAccount: UserAccount | null;
  candidateProfile: CandidateProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, role: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateCandidateProfile: (profile: Partial<CandidateProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user state on auth change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Fetch or create user record in Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            setUserAccount(userSnap.data() as UserAccount);
          } else {
            // New user initial profile
            const newAccount: UserAccount = {
              uid: user.uid,
              email: user.email || '',
              fullName: user.displayName || 'Job Seeker',
              role: 'job_seeker',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newAccount);
            setUserAccount(newAccount);
          }

          // Fetch candidate profile if exists
          const profileDocRef = doc(db, 'candidateProfiles', user.uid);
          const profileSnap = await getDoc(profileDocRef);
          if (profileSnap.exists()) {
            setCandidateProfile(profileSnap.data() as CandidateProfile);
          } else {
            const initialProfile: CandidateProfile = {
              userId: user.uid,
              fullName: user.displayName || '',
              email: user.email || '',
              skills: ['JavaScript', 'React', 'Problem Solving'],
              careerInterests: ['Software Engineering', 'FinTech'],
              preferredLocations: ['Lagos, Nigeria', 'Remote'],
              employmentPreferences: ['Full-time', 'Internship', 'NYSC'],
              qualification: 'BSc',
              academicLevel: 'Entry-level',
            };
            await setDoc(profileDocRef, initialProfile);
            setCandidateProfile(initialProfile);
          }
        } catch (err) {
          console.error('Error loading user profile from Firestore:', err);
        }
      } else {
        setUserAccount(null);
        setCandidateProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (name: string, email: string, pass: string, role: UserRole) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newAccount: UserAccount = {
      uid: cred.user.uid,
      email,
      fullName: name,
      role,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), newAccount);
    setUserAccount(newAccount);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const userDocRef = doc(db, 'users', cred.user.uid);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) {
      const newAccount: UserAccount = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        fullName: cred.user.displayName || 'Job Seeker',
        role: 'job_seeker',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, newAccount);
      setUserAccount(newAccount);
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateCandidateProfile = async (updates: Partial<CandidateProfile>) => {
    if (!currentUser) return;
    const docRef = doc(db, 'candidateProfiles', currentUser.uid);
    const updated = {
      ...(candidateProfile || {
        userId: currentUser.uid,
        fullName: currentUser.displayName || '',
        email: currentUser.email || '',
        skills: [],
        careerInterests: [],
        preferredLocations: [],
        employmentPreferences: [],
      }),
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, updated, { merge: true });
    setCandidateProfile(updated as CandidateProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userAccount,
        candidateProfile,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        updateCandidateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
