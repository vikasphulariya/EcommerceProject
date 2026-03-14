import CategoriesBtn from "../../components/CategoriesBtn";
import HeroSection from "../../components/HeroSection";
import ProductsOnSaleSection from "../../components/ProductsOnSaleSection";
import SingleCategoryViewer from "../../components/singleCategoryViewer";
import { Link } from "react-router-dom";

export default function Home() {
  const CategoryList = [
    {
      name: "Books",
      image: "https://cdn-icons-png.flaticon.com/512/3308/3308336.png",
    },
    {
      name: "Study Material",
      image: "https://cdn-icons-png.flaticon.com/512/4762/4762311.png",
      to: "/study-material",
    },
    {
      name: "Lab Tools",
      image: "https://cdn-icons-png.flaticon.com/512/3022/3022607.png",
    },
    {
      name: "Stationery",
      image: "https://cdn-icons-png.flaticon.com/512/2641/2641409.png",
    },
    {
      name: "Electronics",
      image: "https://cdn-icons-png.flaticon.com/512/3067/3067451.png",
    },
    {
      name: "Bicycles",
      image: "https://cdn-icons-png.flaticon.com/512/3198/3198336.png",
    },
    {
      name: "Hostel Needs",
      image: "https://cdn-icons-png.flaticon.com/512/3030/3030336.png",
    },
  ];

  return (
    <div className="flex flex-col gap-12 py-6 max-w-[1400px] mx-auto px-4">
      <HeroSection />
      
      {/* Categories Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Browse Categories</h2>
           </div>
           <Link to="/categories" className="text-blue-600 font-bold hover:underline">Explore All</Link>
        </div>
        <div className="categories flex overflow-x-auto custom-scrollbar gap-6 pb-4">
          {CategoryList.map((item, index) => {
            return (
              <CategoriesBtn
                key={index}
                imgAddress={item.image}
                categoryName={item.name}
                to={item.to}
              />
            );
          })}
        </div>
      </section>

      <ProductsOnSaleSection />

      {/* Featured Collections Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SingleCategoryViewer sectionTtile={"Books & Resources"} category={"Books"} />
        <SingleCategoryViewer sectionTtile={"Tech & Gadgets"} category={"Electronics"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SingleCategoryViewer sectionTtile={"Hostel Essentials"} category={"Hostel Needs"} />
      </div>
    </div>
  );
}
