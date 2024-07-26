import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { store } from "../store/store";
import { updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { toast } from "react-toastify";

export const updateUserInfo = async (name, value) => {
  try {
    const uid = store.getState().user.user.uid;
    console.log(`Updated ${name} to ${value} for user ${uid}`);

    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, { [name]: value });
    toast(`Successfull updated ${name}.`);
    return "true";
  } catch (error) {
    toast(error.message);
    console.error(error.message);
  }
};
export const updateEmailOfUser = async (email) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    toast("No user is currently logged in.");
    return;
  }
  try {
    await verifyBeforeUpdateEmail(currentUser, email);

    toast("Email verification mail sent successfully to new mail"); // Return the promise to chain it
    return "true";
  } catch (err) {
    console.error(err);
    if (err.code === "auth/requires-recent-login") {
      toast("Please sign in again to update your email");
    } else {
      toast("Failed to update email" + err.code);
    }
  }
};
export const updatePassOfUser = async (password) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    toast("No user is currently logged in.");
    return;
  }
  try {
    await updatePassword(currentUser, password);
    toast("Pasword Updated Successfully");

    return "true";
  } catch (err) {
    console.error(err);
    if (err.code === "auth/requires-recent-login") {
      toast("Please sign in again to update your password");
    } else {
      toast("Failed to update Password" + err.code);
    }
  }
};

