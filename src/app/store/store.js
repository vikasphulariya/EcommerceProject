import { configureStore } from "@reduxjs/toolkit";
import userSliceReducer from "./userSlice";
import cartSliceReducer from "./cartSlice";
import wishlistSliceReducer from "./wishlistSlice";
import bookmarkSliceReducer from "./bookmarkSlice";

export const store = configureStore({
  reducer: {
    user: userSliceReducer,
    cart: cartSliceReducer,
    wishlist: wishlistSliceReducer,
    bookmarks: bookmarkSliceReducer
  },
});
