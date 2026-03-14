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

/**
 * Delete a listing or study material from Firestore
 */
export const deleteResource = async (id, type) => {
  try {
    const { doc, deleteDoc } = await import("firebase/firestore");
    const collectionName = type === "study" ? "study_materials" : "products";
    await deleteDoc(doc(db, collectionName, id));
    toast.success("Deleted successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error deleting resource:", error);
    toast.error("Deletion failed!");
    return { success: false, error };
  }
};

/**
 * Update an existing listing in Firestore
 */
export const updateListing = async (id, data, imageFile, user, type = "marketplace") => {
  try {
    const { doc, updateDoc } = await import("firebase/firestore");
    let imageUrl = data.imgUrl;
    
    if (imageFile) {
      imageUrl = await uploadImage(imageFile, user.uid);
    }

    const collectionName = type === "study" ? "study_materials" : "products";
    const docRef = doc(db, collectionName, id);
    
    await updateDoc(docRef, {
      ...data,
      imgUrl: imageUrl,
      updatedAt: new Date().toISOString()
    });

    toast.success("Listing updated successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error updating listing:", error);
    toast.error("Failed to update listing!");
    return { success: false, error };
  }
};
