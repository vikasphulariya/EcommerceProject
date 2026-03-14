import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { collection, getDocs, getFirestore, limit, orderBy, query } from "firebase/firestore";

function ProductsOnSaleSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestListings() {
      try {
        const db = getFirestore();
        const productsRef = collection(db, "products");
        // Fetch 8 most recently added items
        const q = query(productsRef, orderBy("createdAt", "desc"), limit(8));
        const querySnapshot = await getDocs(q);
        
        const latestItems = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(latestItems);
      } catch (error) {
        console.error("Error fetching latest products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestListings();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-blue-700 w-full py-4 md:py-5 rounded-lg gap-2 px-2 min-[450px]:gap-3 min-[450px]:px-4 flex flex-row shadow-inner">
      <div className="flex flex-col justify-center items-center w-32 min-[450px]:w-40 md:w-48 shrink-0 px-1 py-4">
        <div className="flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-lg font-bold min-[450px]:text-xl sm:text-2xl md:text-3xl leading-tight">
            Latest <br className="hidden sm:block" /> Listings
          </h1>
          <p className="text-blue-200 mt-2 text-xs min-[450px]:text-sm sm:text-base font-medium">Fresh on campus</p>
        </div>

        <button className="bg-white hover:bg-gray-100 transition-colors text-blue-700 text-xs font-bold py-1.5 px-3 min-[450px]:py-2 min-[450px]:px-4 rounded-full shadow-md mt-6 w-full max-w-[120px]">
          View All
        </button>
      </div>
      <div className="flex overflow-x-auto gap-3 custom-scrollbar pb-4 pt-2 pr-4 flex-grow">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} className="min-w-[220px] max-w-[240px]" />
          ))
        ) : (
          <div className="text-white flex items-center h-full px-4 italic opacity-80">
            No listings available right now. Be the first to sell!
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsOnSaleSection;

