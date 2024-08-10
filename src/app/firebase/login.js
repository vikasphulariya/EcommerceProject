// loginWithFirebase.js
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { setUser, removeUser } from "../store/userSlice";
import { store } from "../store/store";
import { doc, getDoc } from "firebase/firestore";
import { loadCartFromCloudAsync } from "../store/cartSlice";
import { loadwishlistFromCloudAsync } from "../store/wishlistSlice";
import { updateUserInfo } from "./userMange";

export const loginWithFirebase = async (email, password) => {
  try {
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
        updateUserInfo("emailVerified",true)
        store.dispatch(
          setUser({ ...userInfo, emailVerified: result.user.emailVerified })
        );
        store.dispatch(loadCartFromCloudAsync())
        store.dispatch(loadwishlistFromCloudAsync())
      }
    }
    return result;
  } catch (err) {
    auth.signOut();
    store.dispatch(removeUser());
    return new Error(err.message);
  }
};

