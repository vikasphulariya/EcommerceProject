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
    <div className={`w-full ${className || ""}`}>
      {productFromCart !== undefined ? (
        <div className="flex w-full items-center justify-between bg-gray-50 rounded-xl p-1 shadow-inner border border-gray-100 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent pointer-events-none"></div>
          
          <button 
            disabled={loading}
            onClick={() => updateProuctQuantity(-1)}
            className="relative flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-lg bg-white text-gray-500 shadow-sm hover:bg-red-50 hover:text-red-500 hover:shadow-md hover:scale-105 active:scale-90 transition-all duration-300 disabled:opacity-50 z-10"
          >
            <PiMinusCircle className="text-xl" />
          </button>
          
          <div className="flex-grow flex justify-center items-center font-black text-gray-800 text-base md:text-lg z-10">
            {loading ? <ClipLoader size={18} color="#2563EB" /> : <span className="animate-in fade-in zoom-in duration-300">{productFromCart.quantity}</span>}
          </div>
          
          <button 
            disabled={loading}
            onClick={() => updateProuctQuantity(1)}
            className="relative flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-lg bg-white text-gray-500 shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:shadow-md hover:scale-105 active:scale-90 transition-all duration-300 disabled:opacity-50 z-10"
          >
            <PiPlusCircle className="text-xl" />
          </button>
        </div>
      ) : (
        <button
          disabled={loading}
          onClick={() => protectedAction(addToCart)}
          className="relative w-full py-2.5 md:py-3 px-4 flex items-center justify-center gap-2 bg-gray-900 border border-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 hover:border-blue-600 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] active:scale-[0.97] transition-all duration-300 disabled:opacity-70 disabled:active:scale-100 group overflow-hidden"
        >
          {/* Shine effect overlay */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
          
          {loading ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            <div className="flex items-center gap-2 z-10 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 group-hover:-translate-y-0.5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 origin-bottom-left" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm md:text-base tracking-wide whitespace-nowrap">Add To Cart</span>
            </div>
          )}
        </button>
      )}
    </div>
  );
}

export default AddToCartBtn;

