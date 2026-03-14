import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";
import { toast } from "react-toastify";

/**
 * Upload an image to Firebase Storage and get the URL
 */
const uploadImage = async (file, userId) => {
  if (!file) return null;
  // Create a unique file name
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const storageRef = ref(storage, `listings/${userId}/${fileName}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};

/**
 * Add a new product listing to Firestore
 */
export const createListing = async (listingData, imageFile, user) => {
  try {
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile, user.uid);
    }

    const newListing = {
      ...listingData,
      imgUrl: imageUrl,
      sellerId: user.uid,
      sellerName: user.name,
      sellerEmail: user.email,
      sellerCollege: user.college,
      createdAt: new Date().toISOString(),
      status: "active", // active, sold, deleted
    };

    const docRef = await addDoc(collection(db, "products"), newListing);
    toast.success("Listing created successfully!");
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating listing:", error);
    toast.error("Failed to create listing!");
    return { success: false, error };
  }
};
