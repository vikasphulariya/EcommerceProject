import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const addBookmarkFirebase = async (userUID, material) => {
  const bookmarkRef = doc(db, `users/${userUID}/bookmarks`, material.id);
  try {
    await setDoc(bookmarkRef, {
      ...material,
      bookmarkedAt: new Date().toISOString()
    });
    return { success: true, message: "Material bookmarked successfully!" };
  } catch (error) {
    console.error("Error adding bookmark: ", error);
    return { success: false, message: error.message };
  }
};

export const removeBookmarkFirebase = async (userUID, materialId) => {
  const bookmarkRef = doc(db, `users/${userUID}/bookmarks`, materialId);
  try {
    await deleteDoc(bookmarkRef);
    return { success: true, message: "Bookmark removed successfully!" };
  } catch (error) {
    console.error("Error removing bookmark: ", error);
    return { success: false, message: error.message };
  }
};

export const loadBookmarksFromCloud = async (userUid) => {
  try {
    const data = await getDocs(collection(db, `users/${userUid}/bookmarks`));
    const bookmarks = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return bookmarks;
  } catch (error) {
    console.error("Error loading bookmarks:", error);
    throw new Error("Failed to load bookmarks");
  }
};
