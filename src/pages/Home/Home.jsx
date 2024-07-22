import CategoriesBtn from "../../components/CategoriesBtn";
import HeroSection from "../../components/HeroSection";
import ProductsOnSaleSection from "../../components/ProductsOnSaleSection";
import SingleCategoryViewer from "../../components/singleCategoryViewer";

export default function Home() {
  const CategoryList = [
    {
      name: "Accessories",
      image: "https://static.thenounproject.com/png/639882-200.png",
    },
    {
      name: "Camera",
      image:
        "https://static-00.iconduck.com/assets.00/camera-icon-512x417-vgmhgbfy.png",
    },
    {
      name: "Computers",
      image:
        "https://images.vexels.com/media/users/3/157345/isolated/lists/934008c8466ce089e15947cec0a7c61d-flat-laptop-icon-laptop.png",
    },
    {
      name: "Mobiles",
      image: "https://cdn-icons-png.flaticon.com/512/65/65756.png",
    },
    {
      name: "SmartWatches",
      image: "https://www.svgrepo.com/show/1756/smartwatch.svg",
    },
    {
      name: "TV",
      image:
        "https://icons.veryicon.com/png/o/internet--web/line-style-digital-correlation/tv-27.png",
    },
    {
      name: "Washing Machine",
      image: "https://cdn-icons-png.flaticon.com/512/125/125652.png",
    },
    {
      name: "Printer",
      image: "https://cdn-icons-png.flaticon.com/512/4020/4020167.png",
    },
  ];
  return (
    <div className=" flex flex-col gap-3 py-3 ">
      <HeroSection />
      <div className="categories flex  overflow-x-scroll no-scrollbar scroll justify-evenly gap-1 md:gap-3">
        {CategoryList.map((item, index) => {
          return (
            <CategoriesBtn
              key={index}
              imgAddress={item.image}
              categoryName={item.name}
            />
          );
        })}
      </div>
      <ProductsOnSaleSection />
      <SingleCategoryViewer sectionTtile={"Cameras"} />
    </div>
  );
}

