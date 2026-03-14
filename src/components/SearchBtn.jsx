import React, { useState, useEffect, useRef } from "react";
import { BiSearch, BiX, BiChevronRight, BiLoaderAlt } from "react-icons/bi";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy
} from "firebase/firestore";
import { db } from "../app/firebase/firebase";
import { Link, useNavigate } from "react-router-dom";

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function SearchBtn({ setSearchActive, searchActive }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const productsRef = collection(db, "products");
      
      // Firestore doesn't support easy case-insensitive substring search.
      // We'll fetch active items and filter client-side for better UX in a small-medium scale app.
      // For a "Real" query, we'd use 'where' but it's very limited for substring.
      const q = query(
        productsRef, 
        where("status", "==", "active"),
        limit(100)
      );
      
      const querySnapshot = await getDocs(q);
      const allActive = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const filtered = allActive.filter(product => {
        const nameMatch = product.name?.toLowerCase().includes(keyword.toLowerCase());
        const categoryMatch = product.category?.toLowerCase().includes(keyword.toLowerCase());
        const campusMatch = product.sellerCollege?.toLowerCase().includes(keyword.toLowerCase());
        return nameMatch || categoryMatch || campusMatch;
      }).slice(0, 8); // Show top 8 results for cleaner UI

      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useRef(
    debounce((nextValue) => performSearch(nextValue), 300)
  ).current;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setLoading(true);
    setIsDropdownOpen(true);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setSearchActive(true)}
        className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-95"
        aria-label="Open Search"
      >
        <BiSearch size={22} />
      </button>

      {/* Modal Overlay */}
      {searchActive && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center pt-16 md:pt-24 px-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            setSearchActive(false);
            setSearchInput("");
            setSearchResults([]);
          }}
        >
          {/* Modal Container */}
          <div 
            className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-top-10 duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Input Area */}
             <div className="relative flex items-center p-4 border-b border-gray-100">
                <BiSearch className="text-gray-400 absolute left-6 shrink-0" size={24} />
                <input
                  autoFocus
                  placeholder="Search for study materials, gadgets, campus deals..."
                  className="w-full bg-transparent border-none outline-none text-base md:text-lg font-medium text-gray-900 pl-10 pr-12 py-3"
                  value={searchInput}
                  onChange={handleInputChange}
                />
                <button 
                  onClick={() => {
                    if (searchInput) {
                      clearSearch();
                    } else {
                      setSearchActive(false);
                    }
                  }} 
                  className="absolute right-4 p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                >
                  <BiX size={24} />
                </button>
             </div>

             {/* Results Area */}
             {(searchInput.length > 0) && (
                <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {loading ? 'Searching Marketplace...' : 'Search Results'}
                     </h4>
                     {loading && <BiLoaderAlt className="animate-spin text-blue-600 shrink-0" size={16} />}
                  </div>

                  <div className="space-y-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50 transition-all group"
                          onClick={() => {
                            setSearchActive(false);
                            clearSearch();
                          }}
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            <img 
                              src={product.imgUrl || "https://placehold.co/100"} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-grow overflow-hidden">
                             <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                {product.name}
                             </p>
                             <p className="text-[11px] font-medium text-gray-500 truncate">
                                ₹{product.price} • {product.sellerCollege}
                             </p>
                          </div>
                          <BiChevronRight className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" size={20} />
                        </Link>
                      ))
                    ) : (
                      !loading && (
                        <div className="py-8 text-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                             <BiSearch className="text-gray-300" size={24} />
                          </div>
                          <p className="text-sm font-bold text-gray-900">No results found</p>
                          <p className="text-xs text-gray-500 mt-1">Try a different keyword or campus name</p>
                        </div>
                      )
                    )}
                  </div>

                  {searchResults.length > 0 && (
                     <Link 
                      to="/categories/all" 
                      className="mt-6 block text-center py-2 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest border-t border-gray-50 pt-4"
                      onClick={() => {
                        setSearchActive(false);
                        clearSearch();
                      }}
                     >
                       View All Results
                     </Link>
                  )}
                </div>
             )}
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBtn;
