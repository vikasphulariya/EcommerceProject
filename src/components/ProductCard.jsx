import { useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { Link } from "react-router-dom";
import ContactSellerBtn from "./ContactSellerBtn";
import AddToWishlist from "./AddToWishlist";

function ProductCard({ product, className = "" }) {
  return (
    <div className={`card relative bg-white w-full rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${className}`}>
      
      <Link to={`/product/${product.id}`} className="flex flex-col flex-grow">
        <div className="product-image w-full bg-gray-50 rounded-[1.5rem] flex justify-center items-center overflow-hidden mb-4 relative" style={{ height: "180px" }}>
          
          {/* Wishlist button overlay */}
          <div className="absolute top-2 right-2 z-20">
            <AddToWishlist product={product} />
          </div>

          <img
            className="object-contain w-full h-full p-2 drop-shadow-sm mix-blend-multiply"
            src={product.imgUrl || "https://placehold.co/400x300"}
            alt={product.name}
          />
        </div>
        
        <div className="card-body flex flex-col flex-grow">
          <div className="flex gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {product.condition}
            </span>
          </div>
          
          <h2 className="card-title font-bold text-gray-900 line-clamp-2 text-sm md:text-base leading-snug mt-1 mb-2">
            {product.name}
          </h2>
          
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
            <h3 className="font-black text-xl text-gray-900 tracking-tight">₹{product.price}</h3>
          </div>
        </div>
      </Link>
      
      <div className="mt-3">
        <ContactSellerBtn product={product} />
      </div>
    </div>
  );
}

export default ProductCard;

