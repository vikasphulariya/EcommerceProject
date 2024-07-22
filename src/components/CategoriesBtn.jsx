/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

function CategoriesBtn({ imgAddress, categoryName }) {
  return (
    <Link
      to={`/categories/${categoryName}`}
      className="container  rounded-3xl gap-2 items-center justify-center px-2 min-w-max flex flex-col group hover:cursor-pointer"
    >
      <div
        className="img-wrapper rounded-full bg-gray-200 flex items-center justify-center  p-2  transition-all group-hover:p-1 group-hover:bg-gray-100 
       md:p-4  md:group-hover:p-3"
        style={{
          width: "clamp(3rem,7vw ,6rem)",
          height: "clamp(3rem,7vw ,6rem)",
        }}
      >
        <img src={imgAddress} alt={categoryName} />
      </div>
      <span className=" text-xs md:text-base text-nowrap">{categoryName}</span>
    </Link>
  );
}

export default CategoriesBtn;

