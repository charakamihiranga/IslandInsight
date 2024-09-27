import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut,
  signInWithPopup,
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

      await sendEmailVerification(user); // Send verification email
      setCurrentUser(null); // Do not set user until they verify their email
    } catch (error) {
      console.error("Error signing up: ", error);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Reload user to get the latest info, including email verification status
      await user.reload(); 
      
      // Check if email is verified
      if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }
      setCurrentUser(user);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Google Sign-In method
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await user.reload(); // Ensure the user is updated
      if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }

      setCurrentUser(user); // Set current user after sign-in
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      throw error;
    }
  };

  // Facebook Sign-In method
  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await user.reload(); // Ensure the user is updated
      if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }

      setCurrentUser(user); // Set current user after sign-in
    } catch (error) {
      console.error("Error signing in with Facebook: ", error);
      throw error;
    }
  };

  // Apple Sign-In method
  const signInWithApple = async () => {
    const provider = new OAuthProvider("apple.com");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await user.reload(); // Ensure the user is updated
      if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in.");
      }

      setCurrentUser(user); // Set current user after sign-in
    } catch (error) {
      console.error("Error signing in with Apple: ", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth); // Sign out the current user
      setCurrentUser(null); // Reset current user to null
    } catch (error) {
      console.error("Error logging out: ", error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.reload().then(() => {
          // Check if email is verified
          if (user.emailVerified) {
            setCurrentUser(user);
          } else {
            setCurrentUser(null); // Do not set user until verified
          }
          setLoading(false); // Loading is false once the auth state is determined
        });
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribe; // Unsubscribe on cleanup
  }, []);

  // Auth context value
  const value = {
    currentUser,
    login,
    signup,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    logout, // Include the logout function
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only when not loading */}
    </AuthContext.Provider>
  );
};
