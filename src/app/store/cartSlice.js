import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { products: [] },
  reducers: {
    addProduct: (state, action) => {
      state.products.push({ ...action.payload, quantity: 1 });
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (item) => item.id !== action.payload.id
      );
    },
    updateProduct: (state, action) => {
      const product = state.products.find(
        (item) => item.id === action.payload.id
      );
      console.log(product);
      if (product) {
        product.quantity += action.payload.value;
      }

    },
  },
});

export const { addProduct, removeProduct, updateProduct } = cartSlice.actions;

export default cartSlice.reducer;

