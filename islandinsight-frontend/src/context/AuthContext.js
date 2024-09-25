import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { fireStore } from '../configs/firebaseConfig'; 
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, signOut } from "firebase/auth"; // Import signOut
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

  // Signup function with user data saving to Firestore
  const signup = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(fireStore, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
        profilePicture: user.photoURL,  // Save profile picture (if available)
      });

      await sendEmailVerification(user);
      setCurrentUser(user);  // Set the current user after signup
    } catch (error) {
      console.error("Error signing up: ", error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(fireStore, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
          profilePicture: user.photoURL,
        });
      }

      setCurrentUser(user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      throw error;
    }
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(fireStore, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
          profilePicture: user.photoURL,
        });
      }

      setCurrentUser(user);
    } catch (error) {
      console.error("Error signing in with Facebook: ", error);
      throw error;
    }
  };

  // Sign in with Apple
  const signInWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(fireStore, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
          profilePicture: user.photoURL,
        });
      }

      setCurrentUser(user);
    } catch (error) {
      console.error("Error signing in with Apple: ", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth); // Call Firebase signOut
      setCurrentUser(null); // Update currentUser to null
    } catch (error) {
      console.error("Error logging out: ", error);
      throw error;
    }
  };

  // Listen to user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);  // Stop loading once the auth state is determined
    });

    return unsubscribe;  // Unsubscribe from the listener when the component unmounts
  }, []);

  // Context value to be provided to consuming components
  const value = {
    currentUser,
    signup,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    logout, // Add logout function to context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}  {/* Render children only when loading is finished */}
    </AuthContext.Provider>
  );
};
