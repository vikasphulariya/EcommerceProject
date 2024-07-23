import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AddToCartFirebase,
  loadCartFromCloud,
  removeProductFromCart,
  updateProductInCart,
} from "../firebase/manageCart";

export const addProductToCartAsync = createAsyncThunk(
  "cart/addProduct",
  async (product, thunkAPI) => {
    const state = thunkAPI.getState();
    const userUID = state.user.user.uid;

    const response = await AddToCartFirebase(userUID, {
      ...product,
      quantity: 1,
    });
    return response.success
      ? { ...product, quantity: 1 }
      : thunkAPI.rejectWithValue(response.message);
  }
);
export const removeProductFromCartAsync = createAsyncThunk(
  "cart/removeProduct",
  async (product, thunkAPI) => {
    const state = thunkAPI.getState();
    const userUID = state.user.user.uid;

    const response = await removeProductFromCart(userUID, product);
    return response.success
      ? product
      : thunkAPI.rejectWithValue(response.message);
  }
);

export const updateProductInCartAsync = createAsyncThunk(
  "cart/updateProduct",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState();
    const userUID = state.user.user.uid;

    const response = await updateProductInCart(userUID, {
      ...data.product,
      quantity: data.product.quantity + data.value,
    });

    return response.success
      ? { id: data.product.id, value: data.value }
      : thunkAPI.rejectWithValue(response.message);
  }
);






export const loadCartFromCloudAsync = createAsyncThunk(
  "cart/loadCart",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    console.log(state);
    const userUID = state.user.user.uid;
    console.log("Dd");
    try {
      const response = await loadCartFromCloud(userUID);
      return response; // Return the cart products array
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);












const cartSlice = createSlice({
  name: "cart",
  initialState: { products: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addProductToCartAsync.fulfilled, (state, action) => {
      state.products.push(action.payload);
    }),
      builder.addCase(removeProductFromCartAsync.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (item) => item.id !== action.payload.id
        );
      }),
      builder.addCase(updateProductInCartAsync.fulfilled, (state, action) => {
        const product = state.products.find(
          (item) => item.id === action.payload.id
        );
        console.log(product);
        if (product) {
          product.quantity += action.payload.value;
        }
      }),
      builder.addCase(loadCartFromCloudAsync.fulfilled, (state, action) => {
        state.products = action.payload;
        // state.products = [];
      });
  },
});

export const { addProduct, removeProduct, updateProduct } = cartSlice.actions;

export default cartSlice.reducer;

