import  { useEffect, useState } from "react";
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
import { db } from "../../app/firebase/firebase";
import ProductCardRes from "../../components/ProductCard copy";
function CategoryPage() {
  const categoryName = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (
      typeof categoryName.categoryName === "string" &&
      categoryName.categoryName.toLowerCase() === "all"
    ) {
      getAllProducts();
    } else {
      getProductsByCategory(categoryName.categoryName);
    }
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

  const getAllProducts = async () => {
    const data = await getDocs(collection(db, "products"));
    const products = data.docs.map((doc) => doc.data());
    setProducts(products);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="  w-full grid place-items-center">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  } else if (categoryName === undefined) return <></>;

  return (
    <div className="min-h-[30rem] ">
      <h1 className="text-3xl font-bold text-center my-3">
        {categoryName.categoryName === "all"
          ? "All Products"
          : categoryName.categoryName}
      </h1>
      {products.length ? (
        <>
                <div
        className="category-page grid max-w-screen-2xl "
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
          gap: "10px",
        }}
      >
        {products.map((product) => {
          return (
            <ProductCard
              product={product}
              key={product.id}
              className="product-card"
            ></ProductCard>
          );
        })}
      </div>
        </>
      ) : (
        <div className=" flex justify-center bg-[#EBEFF2]">
          <img
            src={noProduct}
            alt=""
            className=" max-h-[30rem] object-contain "
          />
        </div>
      )}
    </div>
  );
}

export default CategoryPage;

