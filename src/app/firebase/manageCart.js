import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const AddToCartFirebase = async (userUID, product) => {
  // Reference to the user's cart subcollection
  const cartRef = doc(db, `users/${userUID}/cart`, product.id);
  // Add the product to the cart subcollection
  try {
    await setDoc(cartRef, product);
    console.log("Product added to cart successfully!");
    return { success: true, message: "Product added to cart successfully!" };
  } catch (error) {
    console.error("Error adding product to cart: ", error);
    return { success: false, message: error.message };
  }
};

export const removeProductFromCart = async (userUID, product) => {
  // Reference to the user's cart subcollection
  const cartRef = doc(db, `users/${userUID}/cart`, product.id);
  // Add the product to the cart subcollection
  try {
    await deleteDoc(cartRef, product);
    console.log("Product added to cart successfully!");
    return { success: true, message: "Product added to cart successfully!" };
  } catch (error) {
    console.error("Error adding product to cart: ", error);
    return { success: false, message: error.message };
  }
};

export const updateProductInCart = async (userUID, product) => {
  // Reference to the user's cart subcollection
  const cartRef = doc(db, `users/${userUID}/cart`, product.id);
  // Add the product to the cart subcollection
  try {
    await updateDoc(cartRef, product);
    console.log("Product added to cart successfully!");
    return { success: true, message: "Product added to cart successfully!" };
  } catch (error) {
    console.error("Error adding product to cart: ", error);
    return { success: false, message: error.message };
  }
};

export const loadCartFromCloud = async (userUid) => {
  try {
    const data = await getDocs(collection(db, `users/${userUid}/cart`));
    const cartProducts = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return cartProducts;
  } catch (error) {
    throw new Error("Failed to load cart data");
  }
};

