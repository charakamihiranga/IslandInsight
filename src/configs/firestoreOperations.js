import { serverTimestamp } from "firebase/database";
import { firestore } from "./firebaseConfig";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// listen for real-time updates on likes
export const listenToLikes = (newsId, onUpdate) => {
  const newsRef = doc(firestore, "likes", newsId);
  return onSnapshot(newsRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      onUpdate(data.likesCount || 0); 
    } else {
      onUpdate(0);
    }
  });
};

// Check if the user liked the news
export const checkIfLiked = async (newsId, userId) => {
  const docRef = doc(firestore, "likes", newsId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.likedByUsers ? data.likedByUsers.includes(userId) : false;
  } else {
    return false;
  }
};

//update likes in firebase
export const updateLikesInDb = async (newsId, liked, userId) => {
  const newsRef = doc(firestore, "likes", newsId);

  // Check if the document exists
  const docSnapshot = await getDoc(newsRef);
  if (!docSnapshot.exists()) {
    // If the document doesn't exist, you may want to create it
    await setDoc(newsRef, {
      likesCount: 0, // Initialize with 0 likes
      likedByUsers: [], // Initialize with an empty array
    });
  }

  // Now we can safely update
  if (liked) {
    await updateDoc(newsRef, {
      likesCount: increment(1),
      likedByUsers: arrayUnion(userId),
    });
  } else {
    await updateDoc(newsRef, {
      likesCount: increment(-1),
      likedByUsers: arrayRemove(userId),
    });
  }
};

// post a comment to firestore
export const postCommentToDb = async (newsId, comment) => {
  await setDoc(doc(collection(firestore, "comments")), {
    newsId,
    ...comment,
    timestamp: serverTimestamp(),
  });
};

// listen to rt updates for comments
export const listenToComments = (newsId, onUpdate) => {
  const commentsRef = query(
    collection(firestore, "comments"),
    where("newsId", "==", newsId),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(commentsRef, (snapshot) => {
    const updatedComments = snapshot.docs.map((doc) => doc.data());
    onUpdate(updatedComments);
  });
};
