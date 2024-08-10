import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import ProductCard from "../../components/ProductCard";
import { ClipLoader } from "react-spinners";
import noProduct from "../../assets/noProduct.jpg";
function CategoryPage() {
  const categoryName = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getProductsByCategory(categoryName.categoryName);
  }, [categoryName]);

  async function getProductsByCategory(category) {
    const db = getFirestore();
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("category_lower", "==", category.toLowerCase())
    );

    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc) => doc.data());
    setProducts(products);
    setTimeout(() => {
      setLoading(false);
    }, 50);
  }

  // Example usage:

  return (
    <div className="min-h-[30rem] ">
      <h1 className="text-3xl font-bold text-center my-3">
        {categoryName.categoryName}
      </h1>
      {loading ? (
        <div className="w-full min-h-[30rem]  grid place-items-center">
          <div>
            <ClipLoader size={70} />
            <p>Loading</p>
          </div>
        </div>
      ) : products.length ? (
        <>
          <div className=" flex gap-2 flex-wrap">
            {products.map((item) => {
              return <ProductCard key={item.id} product={item} />;
            })}
          </div>
        </>
      ) : (
        <div className=" flex justify-center bg-[#EBEFF2]">
          <img src={noProduct} alt="" className=" max-h-[30rem] object-contain " />
        </div>
      )}
    </div>
  );
}

export default CategoryPage;

