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
  register: (name: string, email: string, pass: string, role?: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateCandidateProfile: (profile: Partial<CandidateProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(() => {
    try {
      const cached = localStorage.getItem('fj_current_user_account');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(() => {
    try {
      const cached = localStorage.getItem('fj_current_candidate_profile');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync user state on auth change with offline resilience
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        // Fast-path: Create immediate fallback account from user object so UI is instantly responsive
        const fallbackAccount: UserAccount = {
          uid: user.uid,
          email: user.email || '',
          fullName: user.displayName || user.email?.split('@')[0] || 'Job Seeker',
          role: 'job_seeker',
          createdAt: new Date().toISOString(),
        };

        const defaultProfile: CandidateProfile = {
          userId: user.uid,
          fullName: user.displayName || fallbackAccount.fullName,
          email: user.email || '',
          skills: ['Problem Solving', 'Communication', 'Research'],
          careerInterests: ['Technology', 'Finance', 'Early-Career Growth'],
          preferredLocations: ['Lagos, Nigeria', 'Remote'],
          employmentPreferences: ['Full-time', 'Internship', 'NYSC'],
          qualification: 'BSc',
          academicLevel: 'Entry-level',
        };

        // Check local cache first
        try {
          const cachedUser = localStorage.getItem(`fj_user_${user.uid}`);
          if (cachedUser) {
            setUserAccount(JSON.parse(cachedUser));
          } else {
            setUserAccount(fallbackAccount);
          }

          const cachedProfile = localStorage.getItem(`fj_profile_${user.uid}`);
          if (cachedProfile) {
            setCandidateProfile(JSON.parse(cachedProfile));
          } else {
            setCandidateProfile(defaultProfile);
          }
        } catch (e) {
          setUserAccount(fallbackAccount);
          setCandidateProfile(defaultProfile);
        }

        // Now attempt background Firestore sync without crashing if offline
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserAccount;
            setUserAccount(data);
            localStorage.setItem('fj_current_user_account', JSON.stringify(data));
            localStorage.setItem(`fj_user_${user.uid}`, JSON.stringify(data));
          } else {
            // First time Firestore write
            try {
              await setDoc(userDocRef, fallbackAccount);
            } catch (writeErr) {
              console.warn('Firestore offline write deferred for user profile:', writeErr);
            }
            setUserAccount(fallbackAccount);
            localStorage.setItem('fj_current_user_account', JSON.stringify(fallbackAccount));
            localStorage.setItem(`fj_user_${user.uid}`, JSON.stringify(fallbackAccount));
          }

          // Candidate profile sync
          const profileDocRef = doc(db, 'candidateProfiles', user.uid);
          const profileSnap = await getDoc(profileDocRef);

          if (profileSnap.exists()) {
            const pData = profileSnap.data() as CandidateProfile;
            setCandidateProfile(pData);
            localStorage.setItem('fj_current_candidate_profile', JSON.stringify(pData));
            localStorage.setItem(`fj_profile_${user.uid}`, JSON.stringify(pData));
          } else {
            try {
              await setDoc(profileDocRef, defaultProfile);
            } catch (profileWriteErr) {
              console.warn('Firestore offline write deferred for candidate profile:', profileWriteErr);
            }
            setCandidateProfile(defaultProfile);
            localStorage.setItem('fj_current_candidate_profile', JSON.stringify(defaultProfile));
            localStorage.setItem(`fj_profile_${user.uid}`, JSON.stringify(defaultProfile));
          }
        } catch (firestoreErr) {
          // Gracefully handled: client is offline or network connecting
          console.warn('Firestore offline or network sync pending (using offline cache):', firestoreErr);
        }
      } else {
        setUserAccount(null);
        setCandidateProfile(null);
        try {
          localStorage.removeItem('fj_current_user_account');
          localStorage.removeItem('fj_current_candidate_profile');
        } catch {}
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const fallback: UserAccount = {
      uid: cred.user.uid,
      email: cred.user.email || email,
      fullName: cred.user.displayName || email.split('@')[0],
      role: 'job_seeker',
      createdAt: new Date().toISOString(),
    };
    setUserAccount(fallback);
    try {
      localStorage.setItem(`fj_user_${cred.user.uid}`, JSON.stringify(fallback));
      localStorage.setItem('fj_current_user_account', JSON.stringify(fallback));
    } catch {}
  };

  const register = async (name: string, email: string, pass: string, role: UserRole = 'job_seeker') => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newAccount: UserAccount = {
      uid: cred.user.uid,
      email,
      fullName: name,
      role: 'job_seeker',
      createdAt: new Date().toISOString(),
    };

    const initialProfile: CandidateProfile = {
      userId: cred.user.uid,
      fullName: name,
      email,
      skills: ['Problem Solving', 'Communication', 'Research'],
      careerInterests: ['Technology', 'Finance', 'Early-Career Growth'],
      preferredLocations: ['Lagos, Nigeria', 'Remote'],
      employmentPreferences: ['Full-time', 'Internship', 'NYSC'],
      qualification: 'BSc',
      academicLevel: 'Entry-level',
    };

    setUserAccount(newAccount);
    setCandidateProfile(initialProfile);

    try {
      localStorage.setItem(`fj_user_${cred.user.uid}`, JSON.stringify(newAccount));
      localStorage.setItem('fj_current_user_account', JSON.stringify(newAccount));
      localStorage.setItem(`fj_profile_${cred.user.uid}`, JSON.stringify(initialProfile));
      localStorage.setItem('fj_current_candidate_profile', JSON.stringify(initialProfile));
    } catch {}

    // Background sync to Firestore without blocking
    try {
      await setDoc(doc(db, 'users', cred.user.uid), newAccount);
      await setDoc(doc(db, 'candidateProfiles', cred.user.uid), initialProfile);
    } catch (err) {
      console.warn('Could not sync newly registered user to Firestore immediately (offline):', err);
    }
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const defaultAccount: UserAccount = {
      uid: cred.user.uid,
      email: cred.user.email || '',
      fullName: cred.user.displayName || 'Job Seeker',
      role: 'job_seeker',
      createdAt: new Date().toISOString(),
    };

    setUserAccount(defaultAccount);
    try {
      localStorage.setItem(`fj_user_${cred.user.uid}`, JSON.stringify(defaultAccount));
      localStorage.setItem('fj_current_user_account', JSON.stringify(defaultAccount));
    } catch {}

    try {
      const userDocRef = doc(db, 'users', cred.user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data() as UserAccount;
        setUserAccount(data);
        localStorage.setItem(`fj_user_${cred.user.uid}`, JSON.stringify(data));
      } else {
        await setDoc(userDocRef, defaultAccount);
      }
    } catch (err) {
      console.warn('Firestore offline fallback for Google login:', err);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } finally {
      setCurrentUser(null);
      setUserAccount(null);
      setCandidateProfile(null);
      try {
        localStorage.removeItem('fj_current_user_account');
        localStorage.removeItem('fj_current_candidate_profile');
      } catch {}
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateCandidateProfile = async (updates: Partial<CandidateProfile>) => {
    if (!currentUser) return;
    const base = candidateProfile || {
      userId: currentUser.uid,
      fullName: currentUser.displayName || userAccount?.fullName || '',
      email: currentUser.email || '',
      skills: [],
      careerInterests: [],
      preferredLocations: [],
      employmentPreferences: [],
    };
    const updated: CandidateProfile = {
      ...base,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setCandidateProfile(updated);
    try {
      localStorage.setItem(`fj_profile_${currentUser.uid}`, JSON.stringify(updated));
      localStorage.setItem('fj_current_candidate_profile', JSON.stringify(updated));
    } catch {}

    try {
      const docRef = doc(db, 'candidateProfiles', currentUser.uid);
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn('Candidate profile offline cached, remote sync pending:', err);
    }
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
