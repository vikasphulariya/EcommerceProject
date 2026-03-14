/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

function CategoriesBtn({ imgAddress, categoryName }) {
  return (
    <Link
      to={`/categories/${categoryName}`}
      className="flex flex-col items-center gap-3 group cursor-pointer transition-all active:scale-95 min-w-[90px] md:min-w-[110px]"
    >
      <div
        className="relative flex items-center justify-center rounded-[2rem] bg-gray-50 border border-gray-100 shadow-sm p-4 md:p-6 transition-all duration-300 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:shadow-md group-hover:-translate-y-1"
        style={{
          width: "clamp(4.5rem, 8vw, 6.5rem)",
          height: "clamp(4.5rem, 8vw, 6.5rem)",
        }}
      >
        <img 
          src={imgAddress} 
          alt={categoryName} 
          className="w-full h-full object-contain filter group-hover:brightness-0 group-hover:invert transition-all duration-300"
        />
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-blue-400/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <span className="text-xs md:text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors tracking-tight text-center">
        {categoryName}
      </span>
    </Link>
  );
}

export default CategoriesBtn;

