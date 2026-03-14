import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
function ProductOnSaleCard({ product }) {


  return (
    <Link to={`/product/${product.id}`} className="min-w-[170px] max-w-[200px] shrink-0">
      <div className="card h-full relative bg-white rounded-xl p-2.5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col group overflow-hidden border border-transparent hover:border-gray-100">
        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm border border-blue-100">
          {product.category}
        </div>
        
        <div className="product-image w-full bg-gray-100/60 rounded-lg flex justify-center items-center overflow-hidden mb-2 relative h-32 md:h-36 border border-gray-100/50">
          <img
            className="object-contain w-full h-full p-2 drop-shadow-sm mix-blend-multiply"
            src={product.imgUrl || "https://placehold.co/400x300"}
            alt={product.name}
          />
        </div>
        
        <div className="card-body flex flex-col flex-grow px-1">
          <h2 className="card-title font-bold text-gray-800 line-clamp-2 text-xs md:text-sm leading-snug mb-2 group-hover:text-blue-700 transition-colors">
            {product.name}
          </h2>
          
          <div className="mt-auto flex justify-between items-end">
            <h3 className="font-extrabold text-blue-700 text-sm md:text-base">₹{product.price}</h3>
            <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
              {product.condition}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductOnSaleCard;

