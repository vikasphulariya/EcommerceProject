import React from "react";
import { Link } from "react-router-dom";
import CategoriesBtn from "../../components/CategoriesBtn";
import { BiCategoryAlt, BiArrowToRight } from "react-icons/bi";

export default function Categories() {
  const CategoryList = [
    {
      name: "Books",
      image: "https://cdn-icons-png.flaticon.com/512/3308/3308336.png",
      color: "bg-orange-50",
    },
    {
      name: "Study Material",
      image: "https://cdn-icons-png.flaticon.com/512/4762/4762311.png",
      color: "bg-blue-50",
      to: "/study-material",
    },
    {
      name: "Lab Tools",
      image: "https://cdn-icons-png.flaticon.com/512/3022/3022607.png",
      color: "bg-emerald-50",
    },
    {
      name: "Stationery",
      image: "https://cdn-icons-png.flaticon.com/512/2641/2641409.png",
      color: "bg-rose-50",
    },
    {
      name: "Electronics",
      image: "https://cdn-icons-png.flaticon.com/512/3067/3067451.png",
      color: "bg-indigo-50",
    },
    {
      name: "Bicycles",
      image: "https://cdn-icons-png.flaticon.com/512/3198/3198336.png",
      color: "bg-sky-50",
    },
    {
      name: "Hostel Needs",
      image: "https://cdn-icons-png.flaticon.com/512/3030/3030336.png",
      color: "bg-amber-50",
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-24">
        <div className="w-16 h-16 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-blue-100 mb-6 shrink-0 rotate-3">
           <BiCategoryAlt size={32} />
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">Explore Categories</h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
          Find exactly what you need for your campus journey. From academic essentials to weekend gear.
        </p>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6 md:gap-10 mb-24">
        {CategoryList.map((item, index) => (
          <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
            <CategoriesBtn
              imgAddress={item.image}
              categoryName={item.name}
              to={item.to}
            />
          </div>
        ))}
      </div>
      
      {/* Curated Collections Section */}
      <div className="grid md:grid-cols-2 gap-10">
        <div className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl shadow-blue-200 transition-all hover:-translate-y-2 cursor-pointer flex flex-col justify-between h-[350px]">
          <div className="relative z-10">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Curated</span>
            <h3 className="text-4xl font-black mb-4 tracking-tight">Academic Essentials</h3>
            <p className="text-blue-100 text-lg opacity-90 max-w-xs font-medium">Textbooks, notes, and lab gear for every major.</p>
          </div>
          <div className="relative z-10">
            <Link to="/categories/Books" className="inline-flex">
              <button className="flex items-center gap-3 bg-white text-blue-600 font-black px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <span>View Collection</span>
                <BiArrowToRight size={20} />
              </button>
            </Link>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 group-hover:scale-125 transition-transform duration-1000"></div>
        </div>
        
        <div className="group relative overflow-hidden bg-gray-900 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl transition-all hover:-translate-y-2 cursor-pointer flex flex-col justify-between h-[350px]">
          <div className="relative z-10">
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Flash Deals</span>
            <h3 className="text-4xl font-black mb-4 tracking-tight text-white">Campus Lifestyle</h3>
            <p className="text-gray-400 text-lg opacity-90 max-w-xs font-medium">Elevate your hostel room and weekend vibes.</p>
          </div>
          <div className="relative z-10">
            <Link to="/deals" className="inline-flex">
              <button className="flex items-center gap-3 bg-blue-600 text-white font-black px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <span>Discover More</span>
                <BiArrowToRight size={20} />
              </button>
            </Link>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
}
