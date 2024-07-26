import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCartAsync,
  removeProductFromCartAsync,
  updateProductInCartAsync,
} from "../app/store/cartSlice";
import { PiMinusCircle, PiPlusCircle } from "react-icons/pi";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function AddToCartBtn({ product, className }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user);
  const productFromCart = useSelector((state) =>
    state.cart.products.find((item) => item.id === product.id)
  );
  const navigate = useNavigate();

  const protectedAction = (action) => {
    if (user) {
      action();
    } else {
      toast("Please login to add to cart", { autoClose: 1000 });
      navigate("/login");
    }
  };

  const addToCart = async () => {
    setLoading(true);
    await dispatch(addProductToCartAsync(product));
    setLoading(false);
  };

  const updateProuctQuantity = (value) => {
    setLoading(true);
    if (productFromCart) {
      if (productFromCart.quantity === 1 && value === -1) {
        dispatch(removeProductFromCartAsync(product));
      } else {
        dispatch(updateProductInCartAsync({ product: productFromCart, value }));
      }
    }
    setLoading(false);
  };

  return (
    <>
      {productFromCart !== undefined ? (
        <div
          className={`flex w-full  justify-around py-1 ${className}`}
          style={{ fontSize: "clamp(1rem,2vw,1.55rem)" }}
        >
          <button onClick={() => updateProuctQuantity(-1)}>
            <PiMinusCircle />{" "}
          </button>
          {loading ? <ClipLoader /> : <span>{productFromCart.quantity}</span>}
          <button onClick={() => updateProuctQuantity(1)}>
            <PiPlusCircle />{" "}
          </button>
        </div>
      ) : (
        <button
          disabled={loading}
          onClick={() => protectedAction(addToCart)}
          className=" bg-black w-full text-white py-2 rounded-lg hover:bg-blue-800  transition-colors"
          style={{ fontSize: "clamp(0.75rem,2vw,1.25rem)" }}
        >
          {loading ? <ClipLoader size={20} /> : <p>Add To Cart</p>}
        </button>
      )}
    </>
  );
}

export default AddToCartBtn;

