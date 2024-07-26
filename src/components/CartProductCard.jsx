import { MdClose } from "react-icons/md";
import AddToCartBtn from "./AddToCartBtn";
import { useDispatch } from "react-redux";
import { removeProductFromCartAsync } from "../app/store/cartSlice";

function CartProductCard({ product }) {
  const dispatch = useDispatch();

  const removeProductFromCart = () => {
    dispatch(removeProductFromCartAsync(product));
  };

  return (
    <div className=" flex w-full hover:bg-sky-100 py-1 rounded-md px-1">
      <div className="product-img-container w-12 h-12 p-0.5 flex justify-center ">
        <img
          src={product.imgUrl}
          alt={product.title}
          className="product-img object-contain h-full"
        />
      </div>
      <div className="product-info-container w-full flex flex-col justify-center px-2">
        <div className="flex justify-between w-full ">
          <p className="product-title   flex-grow text-sm font-semibold">
            {product.name}
          </p>
          <button onClick={removeProductFromCart}>
            <MdClose />
          </button>
        </div>
        <div className="product-price flex items-end justify-between">
          <AddToCartBtn product={product} />
          <p className="product-price flex-grow w-full py-2 text-sm font-semibold">
            ₹{product.quantity * product.discountPrice}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartProductCard;

