import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Link, NavLink } from "react-router-dom";

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

async function searchProducts(keyword) {
  if (keyword.length === 0) return [];
  const db = getFirestore();
  const productsRef = collection(db, "products");
  console.log(keyword);
  const lowerKeyword = keyword.toLowerCase();
  const q = query(
    productsRef,
    where("brand_lower", ">=", lowerKeyword),
    where("brand_lower", "<=", lowerKeyword + "\uf8ff")
  );

  const categoryQuery = query(
    productsRef,
    where("category_lower", ">=", lowerKeyword),
    where("category_lower", "<=", lowerKeyword + "\uf8ff")
  );

  const nameQuery = query(
    productsRef,
    where("name_lower", ">=", lowerKeyword),
    where("name_lower", "<=", lowerKeyword + "\uf8ff")
  );

  const tagsQuery = query(
    productsRef,
    where("searchTags", "array-contains", lowerKeyword)
  );

  const [brandSnap, categorySnap, nameSnap, tagsSnap] = await Promise.all([
    getDocs(q),
    getDocs(categoryQuery),
    getDocs(nameQuery),
    getDocs(tagsQuery),
  ]);

  const products = [
    ...brandSnap.docs,
    ...categorySnap.docs,
    ...nameSnap.docs,
    ...tagsSnap.docs,
  ].map((doc) => doc.data());
  console.log(products);
  const uniqueProducts = Array.from(new Set(products.map((p) => p.id))).map(
    (id) => products.find((p) => p.id === id)
  );
  return uniqueProducts;
}

const debouncedSearchProducts = debounce(async (keyword, setResults) => {
  const products = await searchProducts(keyword);
  setResults(products);
}, 500);

function SearchBtn({ setSearchActive, searchActive }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchDropdown, setSearchDropdown] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearchProducts(value, setSearchResults);
  };

  return (
    <div className="flex items-center">
      {searchActive && (
        <div className="relative mr-2">
          <div className="flex items-center text-xl border rounded-md overflow-hidden px-2">
            <input
              placeholder="What are you looking for..."
              className="outline-none"
              onFocus={() => setSearchDropdown(true)}
              onBlur={() => setSearchDropdown(false)}
              value={searchInput}
              onChange={handleInputChange}
            />
            <CgClose
              className="cursor-pointer"
              onClick={() => setSearchActive(false)}
            />
          </div>

          {searchDropdown && (
            <div className="bg-white shadow-xl border absolute w-full rounded-md z-10 min-h-80">
              {searchInput.length ? (
                searchResults.length ? (
                  <ul>
                    {searchResults.map((product) => (
                      <Link
                        to={`/product/${product.id}`}
                        className="p-2 w-full block border-b"
                        key={product.id}
                      >
                        {product.name}
                      </Link>
                    ))}
                  </ul>
                ) : (
                  <div>
                    <p className="text-center p-4">No results found</p>
                  </div>
                )
              ) : (
                <div className="h-80 grid place-items-center">
                  <p className="text-center p-4">
                    Hit the Keyboard to start Searching
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <BiSearch
        className="cursor-pointer"
        onClick={() => setSearchActive(!searchActive)}
      />
    </div>
  );
}

export default SearchBtn;

