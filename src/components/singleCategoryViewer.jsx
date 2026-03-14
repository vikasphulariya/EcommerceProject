/* eslint-disable react/prop-types */

import { MdArrowForwardIos } from "react-icons/md";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../app/firebase/firebase";
import { toast } from "react-toastify";

function SingleCategoryViewer({ sectionTtile, category }) {
  const categoryName = category;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getProductsByCategory(categoryName);
  }, [categoryName]);

  async function getProductsByCategory(category) {
    const db = getFirestore();
    const productsRef = collection(db, "products");
    console.log(category);
    const q = query(
      productsRef,
      where("category", "==", category)
    );

    const querySnapshot = await getDocs(q);

    const productss = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(productss);
    console.log(productss);
    setTimeout(() => {
      setLoading(false);
    }, 50);
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">{sectionTtile}</h3>
          <div className="h-1 w-12 bg-blue-600 rounded-full mt-1"></div>
        </div>
        <Link
          to={`/categories/${category}`}
          className="group flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All 
          <MdArrowForwardIos className="inline transition-transform group-hover:translate-x-1" size={12} />
        </Link>
      </div>
      <div className="products">
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="min-w-[200px] h-64 bg-gray-50 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 pt-2 pr-4 scroll-smooth">
            {products.map((product) => (
              <div key={product.id} className="min-w-[180px] md:min-w-[220px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
             <p className="text-gray-400 font-medium italic">No items listed yet</p>
             <Link to="/sell" className="mt-2 text-blue-600 text-sm font-bold hover:underline">+ Add First Listing</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SingleCategoryViewer;

