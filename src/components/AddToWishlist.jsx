import React, { useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useSelectedState } from "rsuite/esm/DateInput";
import {
  addProductTowishlistAsync,
  removeProductFromwishlistAsync,
} from "../app/store/wishlistSlice";

function AddToWishlist({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const wishListedProduct = useSelector((state) =>
    state.wishlist.products.find((item) => item.id === product.id)
  );

  const dispatch = useDispatch();
  const addToWishListBtn = () => {
    if (wishListedProduct) {
      dispatch(removeProductFromwishlistAsync(product));
    } else {
      dispatch(addProductTowishlistAsync(product));
    }
  };
  return (
    <label
      htmlFor={product.id}
      onClick={(e) => e.stopPropagation()}
      className="bg-white/90 backdrop-blur-md shadow-sm border border-gray-100 hover:border-red-200 hover:scale-110 hover:shadow-md hover:bg-red-50 active:scale-95 transition-all duration-200 ease-in-out cursor-pointer text-red-500 rounded-full p-2 text-xl flex items-center justify-center transform"
    >
      <input
        type="checkbox"
        className="sr-only"
        value={wishListedProduct === undefined ? false : true}
        id={product.id}
        onChange={addToWishListBtn}
      />
      {wishListedProduct === undefined ? <GoHeart /> : <GoHeartFill />}
    </label>
  );
}

export default AddToWishlist;

