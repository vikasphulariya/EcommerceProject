import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  export const AddTowishlistFirebase = async (userUID, product) => {
    const wishlistRef = doc(db, `users/${userUID}/wishlist`, product.id);
    try {
      await setDoc(wishlistRef, product);
      console.log("Product added to wishlist successfully!");
      return { success: true, message: "Product added to wishlist successfully!" };
    } catch (error) {
      console.error("Error adding product to wishlist: ", error);
      return { success: false, message: error.message };
    }
  };
  
  export const removeProductFromwishlist = async (userUID, product) => {

    const wishlistRef = doc(db, `users/${userUID}/wishlist`, product.id);
    try {
      await deleteDoc(wishlistRef, product);
      console.log("Product added to wishlist successfully!");
      return { success: true, message: "Product added to wishlist successfully!" };
    } catch (error) {
      console.error("Error adding product to wishlist: ", error);
      return { success: false, message: error.message };
    }
  };
 
  
  export const loadwishlistFromCloud = async (userUid) => {
    try {
      const data = await getDocs(collection(db, `users/${userUid}/wishlist`));
      const wishlistProducts = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return wishlistProducts;
    } catch (error) {
      throw new Error("Failed to load wishlist data");
    }
  };
  
  