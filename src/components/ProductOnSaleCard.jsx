import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
function ProductOnSaleCard({ product }) {
  const discountPercentage =
    100 - Number(Number(product.discountPrice) / Number(product.price)) * 100;

  return (
    <Link to={`/product/${product.id}`}>
      <div className="card relative bg-white rounded-md p-2">
        <div className=" absolute bg-green-400 left-0 rounded-e-md px-1">
          <p style={{ fontSize: "clamp(0.65rem,1.5vw,0.9rem)" }}>
            {discountPercentage} %
          </p>
        </div>
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
      </div>
    </Link>
  );
}

export default ProductOnSaleCard;

