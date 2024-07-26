import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AddTowishlistFirebase,
  loadwishlistFromCloud,
  removeProductFromwishlist,
} from "../firebase/manageWishList";

export const addProductTowishlistAsync = createAsyncThunk(
  "wishlist/addProduct",
  async (product, thunkAPI) => {
    const state = thunkAPI.getState();
    const userUID = state.user.user.uid;

    const response = await AddTowishlistFirebase(userUID, {
      ...product,
      quantity: 1,
    });
    return response.success
      ? { ...product, quantity: 1 }
      : thunkAPI.rejectWithValue(response.message);
  }
);
export const removeProductFromwishlistAsync = createAsyncThunk(
  "wishlist/removeProduct",
  async (product, thunkAPI) => {
    const state = thunkAPI.getState();
    const userUID = state.user.user.uid;

    const response = await removeProductFromwishlist(userUID, product);
    return response.success
      ? product
      : thunkAPI.rejectWithValue(response.message);
  }
);

export const loadwishlistFromCloudAsync = createAsyncThunk(
  "wishlist/loadwishlist",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const userUID = state.user.user.uid;
    try {
      const response = await loadwishlistFromCloud(userUID);
      return response; // Return the wishlist products array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { products: [] },
  reducers: {
    clearWishlist:(state,action)=>{
      state.products = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addProductTowishlistAsync.fulfilled, (state, action) => {
      state.products.push(action.payload);
    }),
      builder.addCase(
        removeProductFromwishlistAsync.fulfilled,
        (state, action) => {
          state.products = state.products.filter(
            (item) => item.id !== action.payload.id
          );
        }
      ),
      builder.addCase(loadwishlistFromCloudAsync.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

export const {clearWishlist}=wishlistSlice.actions

export default wishlistSlice.reducer;

