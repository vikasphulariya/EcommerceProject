import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  addProductToCartAsync,
  removeProduct,
  removeProductFromCartAsync,
  updateProduct,
  updateProductInCartAsync,
} from "../app/store/cartSlice";
import { PiMinusCircle, PiPlusCircle } from "react-icons/pi";

function AddToCartBtn({ product, className }) {
  const dispatch = useDispatch();

  const productFromCart = useSelector((state) =>
    state.cart.products.find((item) => item.id === product.id)
  );

  const addToCart = () => {
    dispatch(addProductToCartAsync(product));
  };

  const updateProuctQuantity = (value) => {
    if (productFromCart) {
      if (productFromCart.quantity === 1 && value === -1) {
        dispatch(removeProductFromCartAsync(product));
      } else {
        dispatch(updateProductInCartAsync({ product: productFromCart, value }));
      }
    }
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
          <span>{productFromCart.quantity}</span>
          <button onClick={() => updateProuctQuantity(1)}>
            <PiPlusCircle />{" "}
          </button>
        </div>
      ) : (
        <button
          onClick={addToCart}
          className=" bg-black w-full text-white py-2 rounded-lg hover:bg-blue-800  transition-colors"
          style={{ fontSize: "clamp(0.75rem,2vw,1.25rem)" }}
        >
          Add To Cart
        </button>
      )}
    </>
  );
}

export default AddToCartBtn;

