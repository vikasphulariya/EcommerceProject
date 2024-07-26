import { useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { Link } from "react-router-dom";
import AddToCartBtn from "./AddToCartBtn";
import AddToWishlist from "./AddToWishlist";

function ProductCard({ product }) {
  return (
    <div className="card relative  w-max rounded-md p-2 border-gray-200 hover:shadow-md transition-all duration-150   border   ">
      <AddToWishlist product={product} />
      <Link to={`/product/${product.id}`}>
        <div
          className="product-image flex justify-center"
          style={{
            height: "clamp(7rem, 25vw, 14rem)",
            width: "clamp(6rem, 20vw, 12rem)",
          }}
        >
          <img
            className="object-contain w-full h-full"
            src={product.imgUrl}
            alt={product.title}
          />
        </div>
        <div className="card-body">
          <h2
            className="card-title"
            style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}
          >
            {product.name}
          </h2>
          <div
            className="product-price flex justify-between"
            style={{ fontSize: "clamp(0.75rem, 2vw, 1rem)" }}
          >
            <h3 className="card-text line-through">₹{product.price}</h3>
            <h3 className="card-text">₹{product.discountPrice}</h3>
          </div>
        </div>
      </Link>
      <AddToCartBtn product={product} />
    </div>
  );
}

export default ProductCard;

