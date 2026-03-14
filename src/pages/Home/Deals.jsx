import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, getFirestore, limit, orderBy } from "firebase/firestore";
import { db } from "../../app/firebase/firebase";
import ProductCard from "../../components/ProductCard";
import { ClipLoader } from "react-spinners";
import { BiSearch } from "react-icons/bi";

export default function Deals() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchDeals() {
      try {
        const q = query(
          collection(db, "products"),
          limit(50)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDeals(items);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDeals();
  }, []);

  // Grouping logic
  const groupedDeals = deals.reduce((acc, product) => {
    const campus = product.sellerCollege || "Unknown campus";
    if (!acc[campus]) acc[campus] = [];
    acc[campus].push(product);
    return acc;
  }, {});

  // Filtered campuses based on search
  const filteredCampuses = Object.keys(groupedDeals).filter(campus => 
    campus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-[60vh] grid place-items-center">
        <ClipLoader color="#2563EB" size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-12 min-h-screen">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 text-white mb-8 md:mb-12 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">Flash Sale</span>
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-black mb-4 md:mb-6 leading-tight tracking-tight">Campus Steals <br/>& Hot Deals</h1>
          <p className="text-blue-100 text-base md:text-2xl opacity-90 leading-relaxed font-medium">
            The best prices on pre-loved items from your fellow students. Save money, live better on campus.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse"></div>
      </div>

      {/* Campus Search Section */}
      <div className="mb-10 md:mb-16 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Search by Campus</h2>
            <p className="text-gray-500 font-medium">Find deals happening right at your college.</p>
          </div>
          <div className="relative w-full md:w-[450px] group">
            <BiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Enter your college name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all font-bold text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Grouped Listings */}
      <div className="space-y-24">
        {filteredCampuses.length > 0 ? (
          filteredCampuses.map((campus) => (
            <div key={campus} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-8 md:mb-10">
                <div className="h-12 w-2 bg-blue-600 rounded-full"></div>
                <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">{campus}</h3>
                <span className="text-xs font-black bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest hidden sm:block">
                  {groupedDeals[campus].length} {groupedDeals[campus].length === 1 ? 'Listing' : 'Listings'}
                </span>
                <div className="flex-grow h-px bg-gray-100 hidden md:block"></div>
                <button 
                  onClick={() => navigate(`/categories/all?campus=${encodeURIComponent(campus)}`)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4 whitespace-nowrap"
                >
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 transition-all">
                {groupedDeals[campus].slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                
                {groupedDeals[campus].length > 4 && (
                  <div className="flex items-center justify-center p-8 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 group hover:border-blue-400 transition-all cursor-pointer"
                    onClick={() => navigate(`/categories/all?campus=${encodeURIComponent(campus)}`)}
                  >
                    <div className="text-center group-hover:scale-105 transition-transform">
                      <p className="text-sm font-black text-gray-500 mb-1 group-hover:text-blue-600">+ {groupedDeals[campus].length - 4} More Items</p>
                      <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">View All Deals</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-center md:hidden">
                 <button 
                  onClick={() => navigate(`/categories/all?campus=${encodeURIComponent(campus)}`)}
                  className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
                 >
                   Browse All {campus} Deals
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiSearch size={32} className="text-gray-300" />
             </div>
            <p className="text-gray-500 font-bold text-lg mb-2">No campuses found</p>
            <p className="text-gray-400">Try searching for a different college or clear the filter.</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
