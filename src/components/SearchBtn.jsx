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
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Search Input Container - Dynamic Width */}
      <div className={`flex items-center transition-all duration-500 ease-in-out bg-gray-50 rounded-2xl border border-transparent focus-within:border-blue-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 ${searchActive ? 'w-64 md:w-80 px-4 py-2 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
        <BiSearch className="text-gray-400 mr-2 shrink-0" size={20} />
        <input
          placeholder="Search items, campus..."
          className="bg-transparent border-none outline-none text-sm font-medium w-full text-gray-700"
          value={searchInput}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
        />
        {searchInput && (
          <button onClick={clearSearch} className="text-gray-400 hover:text-rose-500 transition-colors">
            <BiX size={18} />
          </button>
        )}
      </div>

      {/* Toggle Button */}
      {!searchActive && (
        <button 
          onClick={() => setSearchActive(true)}
          className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all active:scale-95"
          aria-label="Open Search"
        >
          <BiSearch size={22} />
        </button>
      )}
      
      {searchActive && !searchInput && (
        <button 
          onClick={() => setSearchActive(false)}
          className="ml-2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <BiX size={20} />
        </button>
      )}

      {/* Modern Search Results Dropdown */}
      {isDropdownOpen && searchActive && (searchInput.length > 0) && (
        <div className="absolute top-full right-0 mt-3 w-[320px] md:w-[400px] bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[110] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {loading ? 'Searching Marketplace...' : 'Search Results'}
               </h4>
               {loading && <BiLoaderAlt className="animate-spin text-blue-600" size={16} />}
            </div>

            <div className="space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50 transition-all group"
                    onClick={() => setIsDropdownOpen(false)}
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
                    <BiChevronRight className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" size={20} />
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
                onClick={() => setIsDropdownOpen(false)}
               >
                 View All Results
               </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBtn;
