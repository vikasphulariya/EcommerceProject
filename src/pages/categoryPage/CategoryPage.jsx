import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import ProductCard from "../../components/ProductCard";
import { ClipLoader } from "react-spinners";
import { db } from "../../app/firebase/firebase";
import { BiFilterAlt, BiX, BiSliderAlt, BiChevronDown } from "react-icons/bi";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Derive filters from URL search params
  const filters = useMemo(() => ({
    category: searchParams.get("category") || (categoryName?.toLowerCase() === "all" ? "" : categoryName || ""),
    condition: searchParams.get("condition") || "",
    maxPrice: parseInt(searchParams.get("maxPrice")) || 20000,
    campus: searchParams.get("campus") || "",
    sortBy: searchParams.get("sortBy") || "newest"
  }), [searchParams, categoryName]);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const CATEGORIES = ["Books", "Lab Tools", "Stationery", "Electronics", "Bicycles", "Hostel Needs"];
  const CONDITIONS = ["New", "Like New", "Used - Good", "Used - Fair"];

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    // Sync category from URL path to search params if needed
    if (categoryName?.toLowerCase() !== "all" && categoryName && !searchParams.get("category")) {
      updateFilters({ category: categoryName });
    }
  }, [categoryName]);

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllProducts(items);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCampuses = useMemo(() => {
    const campuses = new Set(allProducts.map(p => p.sellerCollege).filter(Boolean));
    return Array.from(campuses).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(product => {
      const matchCategory = !filters.category || product.category?.toLowerCase() === filters.category.toLowerCase();
      const matchCondition = !filters.condition || product.condition === filters.condition;
      const matchPrice = product.price <= filters.maxPrice;
      const matchCampus = !filters.campus || product.sellerCollege === filters.campus;
      return matchCategory && matchCondition && matchPrice && matchCampus;
    });

    // Apply Sorting
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name":
        result.sort((a, b) => {
          const nameA = (a.name || "").toLowerCase();
          const nameB = (b.name || "").toLowerCase();
          return nameA.localeCompare(nameB);
        });
        break;
      default: // newest
        result.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA;
        });
        break;
    }
    return result;
  }, [allProducts, filters]);

  const resetFilters = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] grid place-items-center">
        <ClipLoader color="#2563EB" size={50} />
      </div>
    );
  }

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`space-y-8 ${isMobile ? 'p-6' : ''}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-gray-900 uppercase tracking-wider">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Categories</h4>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => updateFilters({ category: filters.category === cat ? "" : cat })}
              className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filters.category === cat 
                ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Campus Filter */}
      <div>
        <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Campus / College</h4>
        <select 
          value={filters.campus}
          onChange={(e) => updateFilters({ campus: e.target.value })}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium transition-all"
        >
          <option value="">All Campuses</option>
          {uniqueCampuses.map(campus => (
            <option key={campus} value={campus}>{campus}</option>
          ))}
        </select>
      </div>

      {/* Price Filter */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Max Price</h4>
          <span className="text-blue-600 font-bold">₹{filters.maxPrice}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="20000" 
          step="500"
          value={filters.maxPrice}
          onChange={(e) => updateFilters({ maxPrice: e.target.value })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
          <span>₹0</span>
          <span>₹20000+</span>
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Condition</h4>
        <div className="grid grid-cols-2 gap-2">
          {CONDITIONS.map(cond => (
            <button
              key={cond}
              onClick={() => updateFilters({ condition: filters.condition === cond ? "" : cond })}
              className={`px-2 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                filters.condition === cond 
                ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                : "text-gray-600 bg-white border-gray-100 hover:border-blue-200 hover:bg-blue-50"
              }`}
            >
              {cond}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12 min-h-screen relative">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 shrink-0 sticky top-24 h-fit bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <FilterSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                  {categoryName?.toLowerCase() === "all" ? "Explore Marketplace" : categoryName}
                </h1>
              </div>
              <p className="text-gray-500 font-medium ml-4">
                Showing {filteredProducts.length} verified listings from {uniqueCampuses.length} campuses
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all w-full"
            >
              <BiFilterAlt size={20} />
              <span>Show Filters</span>
            </button>

            <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-[1.25rem] border border-gray-100 shadow-sm">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-r pr-4 border-gray-100">Sorted By</span>
              <select 
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer hover:text-blue-600 transition-colors pl-2"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(filters.category || filters.condition || filters.campus) && (
             <div className="flex flex-wrap gap-2 mb-8">
                {filters.category && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                    {filters.category} <BiX className="cursor-pointer" onClick={() => updateFilters({ category: "" })} />
                  </span>
                )}
                {filters.campus && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100">
                    {filters.campus} <BiX className="cursor-pointer" onClick={() => updateFilters({ campus: "" })} />
                  </span>
                )}
                {filters.condition && (
                   <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                    {filters.condition} <BiX className="cursor-pointer" onClick={() => updateFilters({ condition: "" })} />
                  </span>
                )}
             </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredProducts.map((product) => (
                <ProductCard
                  product={product}
                  key={product.id}
                  className="w-full"
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                 <BiSliderAlt size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No items match your filters</h3>
              <p className="text-gray-500 max-w-sm text-center mb-8">
                Try adjusting your price range or clearing some filters to find what you're looking for.
              </p>
              <button 
                onClick={resetFilters}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg border-b-4 border-blue-800 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-0 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] bg-white animate-in slide-in-from-right duration-500">
            <div className="h-full flex flex-col">
               <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="text-xl font-black">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-full">
                    <BiX size={24} />
                  </button>
               </div>
               <div className="flex-grow overflow-y-auto">
                  <FilterSidebar isMobile />
               </div>
               <div className="p-6 border-t mt-auto">
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
                  >
                    Apply Filters
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
