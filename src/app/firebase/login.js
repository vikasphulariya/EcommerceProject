// loginWithFirebase.js
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "./firebase";
import { setUser, removeUser } from "../store/userSlice";
import { store } from "../store/store";
import { doc, getDoc } from "firebase/firestore";
import { loadCartFromCloudAsync } from "../store/cartSlice";
import { loadwishlistFromCloudAsync } from "../store/wishlistSlice";
import { updateUserInfo } from "./userMange";

export const loginWithFirebase = async (email, password, rememberMe = false) => {
  try {
    // Set persistence based on the rememberMe flag
    // SESSION: clears when the tab/browser is closed
    // LOCAL: survives browser restarts (the default)
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    await setPersistence(auth, persistence);

    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result) {
      if (!result.user.emailVerified) {
        auth.signOut();
        // store.dispatch(removeUser());
        return new Error("Email Verification Pending");
      }

      let userInfoSnap = await getDoc(doc(db, "users", result.user.uid));

      if (userInfoSnap.exists()) {
        let userInfo = userInfoSnap.data();
        updateUserInfo("emailVerified", true, false);
        store.dispatch(
          setUser({ ...userInfo, emailVerified: result.user.emailVerified, uid: result.user.uid })
        );
        store.dispatch(loadCartFromCloudAsync())
        store.dispatch(loadwishlistFromCloudAsync())
      }
    }
    return result;
  } catch (err) {
    auth.signOut();
    store.dispatch(removeUser());
  }
};


export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    return new Error(error.message);
  }
};
