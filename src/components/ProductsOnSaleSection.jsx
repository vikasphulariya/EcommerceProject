import ProductOnSaleCard from "./ProductOnSaleCard";

function ProductsOnSaleSection() {
  let product = {
    id: "2sdcsd",
    name: "Samsung Galaxy S20",
    price: 1000,
    discountPrice: 800,
    imgUrl:
      "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1715785282/Croma%20Assets/Communication/Mobiles/Images/268867_0_sstd64.png?tr=w-600",
  };
  return (
    <div className=" bg-blue-700 w-full py-5 rounded-lg gap-2 px-2 min-[450px]:gap-3 min-[450px]:px-4  flex flex-row">
      <div className="flex flex-col justify-between items-center">
        <div className="flex w-max flex-col justify-center items-center ">
          <h1 className="text-white text-base font-bold min-[450px]:text-lg sm:text-xl md:text-2xl">
            Products On Sale
          </h1>
          <p className="text-white text-xs min-[450px]:text-base sm:text-lg">Shop now</p>
        </div>

        <button className="bg-white text-blue-700 text-sm  font-bold py-1 px-2 min-[450px]:py-1.5 min-[450px]:px-2.5 sm:py-2 sm:px-3 rounded">
          View All
        </button>
      </div>
      <div className="sale-products flex overflow-x-scroll gap-3 no-scrollbar">
        <ProductOnSaleCard product={product} />
        <ProductOnSaleCard product={product} />
        <ProductOnSaleCard product={product} />
        <ProductOnSaleCard product={product} />
        <ProductOnSaleCard product={product} />
        <ProductOnSaleCard product={product} />
      </div>
    </div>
  );
}

export default ProductsOnSaleSection;

