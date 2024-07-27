import  { useMemo } from "react";
import Lottie from "react-lottie-player";
import { useSelector } from "react-redux";
import emptyWishlist from "../../assets/emptyWish.json";
import { useNavigate } from "react-router";
import ProductCard from "../../components/ProductCard";

const NoItems = () => {
  const navigate = useNavigate();
  return (
    <div className="no-items h-screen flex justify-center">
      <div className="flex flex-col items-center justify-center">
        <Lottie
          play
          loop
          animationData={emptyWishlist}
          className="w-80 max-h-[400px]"
        />
        <h2 className="text-center text-2xl sm:text-4xl lg:text-5xl">
          No items in your cart
        </h2>
        <button
          tabIndex={2}
          onClick={() => navigate("/")}
          className="z-10 bg-blue-400 py-2 px-4 rounded-md hover:bg-blue-500 mt-4"
        >
          Explore Products
        </button>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const products = useSelector((state) => state.wishlist.products);

  const productCards = useMemo(
    () =>
      products.map((item, index) => (
        <ProductCard key={index} product={item} />
      )),
    [products]
  );

  return (
    <div className="p-4">
      {products.length ? (
        <div className="py-2">
          <h1 className="text-2xl mb-4">Your Wish's</h1>
          <div className="flex flex-wrap gap-2">
            {productCards}
          </div>
        </div>
      ) : (
        <NoItems />
      )}
    </div>
  );
};

export default Wishlist;
