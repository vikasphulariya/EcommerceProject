import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CartProductCard from "../../components/CartProductCard";

function Cart() {
  const cart = useSelector((state) => state.cart.products);
  const [shipping, setShipping] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [subTotalDiscounted, setSubTotalDiscounted] = useState(0);

  useEffect(() => {
    let total = 0;
    let discountedTotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      discountedTotal += (item.discountPrice || item.price) * item.quantity;
    });

    setSubTotal(total);
    setSubTotalDiscounted(discountedTotal);

    setShipping(discountedTotal < 500 ? 50 : 0);
  }, [cart]);

  return (
    <div className="px-4 py-6">
      <div className="cart-grid flex flex-wrap gap-4">
        <div className="cart-items flex-grow border max-h-screen p-4 overflow-auto">
          {cart.map((item) => (
            <CartProductCard key={item.id} product={item} />
          ))}
        </div>
        <div className="cart-total border p-4 w-full md:w-1/4 h-min">
          <h2 className="text-2xl font-bold mb-4">BILL</h2>
          <p>Total: ₹{subTotal.toFixed(2)}</p>
          <p className="text-sm text-green-600">
            Discount: {(100 - (subTotalDiscounted / subTotal) * 100).toFixed(2)}%
          </p>
          <p>After Discount: ₹{subTotalDiscounted.toFixed(2)}</p>
          <p>Shipping: {shipping ? `₹${shipping.toFixed(2)}` : "Free"}</p>
          <hr className="my-4" />
          <p className="text-lg font-semibold">
            Final Amount: ₹{(shipping + subTotalDiscounted).toFixed(2)}
          </p>
          <button className="bg-orange-500 py-2 text-center w-full rounded-md mt-4 hover:bg-orange-600 transition duration-200">
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
