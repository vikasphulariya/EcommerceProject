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
  console.log(wishListedProduct);

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
      onClick={() => {}}
      className=" absolute bg-red-100 bg-opacity-45  cursor-pointer  text-red-800  rounded-full p-2 text-2xl left-3 top-2  "
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

