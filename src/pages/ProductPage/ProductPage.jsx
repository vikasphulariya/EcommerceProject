/* eslint-disable react/prop-types */
import { doc, getDoc } from "firebase/firestore";
import  { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { db } from "../../app/firebase/firebase";
import { ClipLoader } from "react-spinners";
import AddToWishlist from "../../components/AddToWishlist";
import AddToCartBtn from "../../components/AddToCartBtn";

const ProductLoader = () => (
  <div className="h-screen w-full grid place-items-center">
    <div>
      <ClipLoader color="#36d7b7" size={50} />
      <h3>Loading</h3>
    </div>
  </div>
);

const ProductInfo = ({ product }) => {
  const discountPercentage =
    100 - (product.discountPrice / product.price) * 100;

  return (
    <div className="flex flex-col sm:flex-row flex-wrap py-3">
      <div className="w-full relative sm:w-1/2">
        <AddToWishlist product={product} />
        <img
          src={product.imgUrl}
          alt={product.name}
          className="w-full h-auto"
        />
      </div>
      <div className="w-full flex flex-col gap-4 sm:w-1/2">
        <div
          className="flex gap-2"
          style={{ fontSize: "clamp(0.75rem,2vw,1.25rem)" }}
        >
          <div className="min-w-max bg-gray-400 px-3 rounded-xl py-1">
            ⭐ {product.rating}
          </div>
          <div className="min-w-max bg-cyan-400 px-3 rounded-xl py-1">
            {product.category}
          </div>
          <div className="min-w-max capitalize bg-orange-400 px-3 rounded-xl py-1">
            {product.warranty} Warranty
          </div>
        </div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-500">{product.seller}</p>
        <p className="text-xl font-bold flex gap-2">
          <span className="line-through">₹{product.price}</span>
          <span className="text-green-900">₹{product.discountPrice}</span>
          <span className="bg-green-400 px-3 rounded-lg">
            {discountPercentage.toFixed(2)}%
          </span>
        </p>
        <AddToCartBtn product={product} />
      </div>
    </div>
  );
};

const ProductError = () => (
  <div className="h-screen w-full grid place-items-center">
    <div>
      <h3 className="text-red-500 text-xl">
        The product you are looking for is either removed or not present right
        now.
      </h3>
    </div>
  </div>
);

function ProductPage() {
  const { productID } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);

  const loadProductData = useCallback(async () => {
    try {
      const productRef = doc(db, "products", productID);
      const data = await getDoc(productRef);
      if (data.exists()) {
        setProduct(data.data());
      } else {
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching product data: ", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [productID]);

  useEffect(() => {
    loadProductData();
  }, [loadProductData]);

  if (loading) {
    return <ProductLoader />;
  }

  if (error) {
    return <ProductError />;
  }

  return (
    <div className="container mx-auto p-4">
      <ProductInfo product={product} />
    </div>
  );
}

export default ProductPage;

