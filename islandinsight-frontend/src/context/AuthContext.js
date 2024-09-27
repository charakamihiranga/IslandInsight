import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut,
  signInWithPopup,  // Add signInWithPopup for external sign-ins
} from "firebase/auth"; // Firebase methods
import { auth } from "../configs/firebaseConfig";

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Signup function
  const signup = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);  // Send verification email
      setCurrentUser(user);  // Set current user after signup
    } catch (error) {
      console.error("Error signing up: ", error);
      throw error;
    }
  };

  // Google Sign-In method 
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);  
      const user = result.user;

      setCurrentUser(user);  // Set current user after sign-in
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      throw error;
    }
  };

  // Facebook Sign-In method
  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);  // Fixed to signInWithPopup
      const user = result.user;

      setCurrentUser(user);  // Set current user after sign-in
    } catch (error) {
      console.error("Error signing in with Facebook: ", error);
      throw error;
    }
  };

  // Apple Sign-In method
  const signInWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      const result = await signInWithPopup(auth, provider);  // Fixed to signInWithPopup
      const user = result.user;

      setCurrentUser(user);  // Set current user after sign-in
    } catch (error) {
      console.error("Error signing in with Apple: ", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);  // Sign out the current user
      setCurrentUser(null);  // Reset current user to null
    } catch (error) {
      console.error("Error logging out: ", error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);  // Loading is false once the auth state is determined
    });

    return unsubscribe;  // Unsubscribe on cleanup
  }, []);

  // Auth context value
  const value = {
    currentUser,
    signup,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    logout,  // Include the logout function
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}  {/* Render children only when not loading */}
    </AuthContext.Provider>
  );
};
