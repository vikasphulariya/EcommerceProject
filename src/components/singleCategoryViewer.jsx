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
      where("category_lower", "==", category.toLowerCase())
    );

    const querySnapshot = await getDocs(q);

    const productss = querySnapshot.docs.map((doc) => doc.data());
    setProducts(productss);
    console.log(productss);
    setTimeout(() => {
      setLoading(false);
    }, 50);
  }

  return (
    <div>
      <div className="w-full flex justify-between pr-3 pb-2 border-b-2">
        <h3 className=" text-xl">{sectionTtile}</h3>
        <Link
          to={`/categories/${category}`}
          className=" flex items-center hover:text-blue-600 transition-colors  "
        >
          View All <MdArrowForwardIos className=" inline" />{" "}
        </Link>
      </div>
      <div className="products py-3">
        <div className="products flex gap-2 overflow-scroll no-scrollbar">
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default SingleCategoryViewer;

