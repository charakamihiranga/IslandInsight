import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore methods
import { fireStore } from '../configs/firebaseConfig'; 
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  sendEmailVerification, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider, 
  signOut 
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

  // Signup function with Firestore data saving
  const signup = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(fireStore, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
        profilePicture: user.photoURL,  
      });

      await sendEmailVerification(user);  // Send verification email
      setCurrentUser(user);  // Set current user after signup
    } catch (error) {
      console.error("Error signing up: ", error);
      throw error;
    }
  };

  // Google SignIn method
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(fireStore, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      // If user doesn't exist in Firestore, create a new entry
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
          profilePicture: user.photoURL,
        });
      }

      setCurrentUser(user);  // Set current user after sign-in
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      throw error;
    }
  };

  // Facebook SignIn method
  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(fireStore, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      // If user doesn't exist in Firestore, create a new entry
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName,
          email: user.email,
          createdAt: new Date().toISOString(),
          profilePicture: user.photoURL,
        });
      }

      setCurrentUser(user);  // Set current user after sign-in
    } catch (error) {
      console.error("Error signing in with Facebook: ", error);
      throw error;
    }
  };

  // Apple SignIn method
  const signInWithApple = async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(fireStore, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      // If user doesn't exist in Firestore, create a new entry
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName || "No",  // Apple doesn't always provide a displayName
          email: user.email,
          createdAt: new Date().toISOString(),
          profilePicture: user.photoURL || "No",  // Default to empty if no photoURL
        });
      }

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
