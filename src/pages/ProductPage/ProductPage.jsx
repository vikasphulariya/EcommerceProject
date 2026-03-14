/* eslint-disable react/prop-types */
import { doc, getDoc } from "firebase/firestore";
import  { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { db } from "../../app/firebase/firebase";
import { ClipLoader } from "react-spinners";
import AddToWishlist from "../../components/AddToWishlist";
import { BiFilterAlt, BiX, BiSliderAlt, BiChevronDown, BiEnvelope, BiPhoneCall } from "react-icons/bi";
import ContactSellerBtn from "../../components/ContactSellerBtn";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const ProductLoader = () => (
  <div className="h-screen w-full grid place-items-center">
    <div>
      <ClipLoader color="#36d7b7" size={50} />
      <h3>Loading</h3>
    </div>
  </div>
);

const ProductInfo = ({ product }) => {
  const [sellerData, setSellerData] = useState(null);
  useEffect(() => {
    const fetchSeller = async () => {
      const docRef = doc(db, "users", product.sellerId);
      const snap = await getDoc(docRef);
      if (snap.exists()) setSellerData(snap.data());
    };
    fetchSeller();
  }, [product.sellerId]);

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
      {/* Left: Image Showcase */}
      <div className="w-full md:w-1/2 lg:w-3/5 flex justify-center items-center bg-gray-50 rounded-2xl p-6 relative min-h-[300px] md:min-h-[400px]">
        {/* Wishlist Button Overlay */}
        <div className="absolute top-4 right-4 z-20">
          <AddToWishlist product={product} />
        </div>
        <img
          src={product.imgUrl || "https://placehold.co/800x600"}
          alt={product.name}
          className="w-full h-full object-contain max-h-[500px] drop-shadow-md mix-blend-multiply"
        />
      </div>

      {/* Right: Product Details */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col pt-2">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs uppercase tracking-wider font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {product.category}
          </span>
          <span className="text-xs uppercase tracking-wider font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            {product.condition}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
          {product.name}
        </h1>

        {/* Price */}
        <div className="text-4xl font-black text-blue-600 mb-6">
          ₹{product.price}
        </div>

        {/* Description */}
        <div className="mb-8 flex-grow">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
            Description
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base md:text-lg">
            {product.description}
          </p>
        </div>

        {/* Seller Info with Integrated Action */}
        <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-6 mb-8 shadow-sm">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 block">
            Seller Details
          </h3>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 rounded-full flex items-center justify-center text-xl font-black uppercase shrink-0 shadow-inner">
              {(sellerData?.name || product.sellerName || "S")[0]}
            </div>
            <div className="flex-grow">
              <p className="text-gray-900 font-black text-xl leading-none mb-1">{sellerData?.name || product.sellerName}</p>
              <p className="text-gray-500 text-sm font-medium">{sellerData?.college || product.sellerCollege}</p>
              {sellerData?.isPublicContact && (
                <div className="mt-3 pt-3 border-t border-gray-200/60 flex flex-col gap-2">
                  <p className="text-xs font-bold text-blue-600 flex items-center gap-2">
                    <BiEnvelope size={14} />
                    {sellerData.email}
                  </p>
                  <p className="text-xs font-bold text-gray-500 flex items-center gap-2">
                    <BiPhoneCall size={14} />
                    {sellerData.mobile}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8">
            <ContactSellerBtn product={product} />
          </div>
        </div>
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
        setProduct({ id: data.id, ...data.data() });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-screen bg-gray-50/50">
      <ProductInfo product={product} />
    </div>
  );
}

export default ProductPage;

