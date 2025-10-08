
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  UserCredential,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  // CRITICAL: Do NOT use 'await signInAnonymously(...)'.
  return signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  // CRITICAL: Do NOT use 'await createUserWithEmailAndPassword(...)'.
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  // CRITICAL: Do NOT use 'await signInWithEmailAndPassword(...)'.
  return signInWithEmailAndPassword(authInstance, email, password);
}

/** Updates the user's profile (non-blocking). */
export function updateUserProfile(authInstance: Auth, data: { displayName?: string, photoURL?: string }): Promise<void> {
    if (!authInstance.currentUser) {
        return Promise.reject(new Error("No user is currently signed in."));
    }
    // CRITICAL: Do NOT use 'await updateProfile(...)'.
    return updateProfile(authInstance.currentUser, data);
}
