import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";

export const registerNewUser = async (email, password, info) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    toast("User Registration Success");
    try {
      await sendEmailVerification(auth.currentUser);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        ...info,
        password: "null",
      });
      toast("Email Verification Pending");
    } catch (error) {
      console.log(error);
    }
    auth.signOut();
    return userCredential;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error registering user:", errorCode, errorMessage);
    return new Error(errorMessage);
  }
};

