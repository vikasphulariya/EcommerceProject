import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ProductCard from "../../components/ProductCard";
import { BiHeart, BiArrowBack, BiShoppingBag } from "react-icons/bi";
import { Link } from "react-router-dom";

const NoItems = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 md:py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 mt-8">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 animate-pulse">
        <BiHeart size={40} className="text-gray-300" />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
      <p className="text-gray-500 max-w-sm text-center mb-10 font-medium">
        Seems like you haven't saved any items yet. Start exploring the marketplace to find your favorites!
      </p>
      <button
        onClick={() => navigate("/categories/all")}
        className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:translate-y-0.5 transition-all"
      >
        <BiShoppingBag size={20} />
        Explore Products
      </button>
    </div>
  );
};

const Wishlist = () => {
  const products = useSelector((state) => state.wishlist.products);
  const user = useSelector((state) => state.user.user);

  const productCards = useMemo(
    () =>
      products.map((item, index) => (
        <div key={item.id || index} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
          <ProductCard product={item} />
        </div>
      )),
    [products]
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-4 text-gray-400 hover:text-blue-600 transition-colors mb-2 group">
              <Link to="/" className="flex items-center gap-1 text-xs font-black uppercase tracking-widest">
                <BiArrowBack size={16} /> Backward to Home
              </Link>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-rose-500 rounded-full"></div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Saved Favorites</h1>
           </div>
           {products.length > 0 && (
             <p className="text-gray-500 font-medium ml-4">
                You have {products.length} items saved in your collection
             </p>
           )}
        </div>

        {products.length > 0 && (
           <Link 
            to="/categories/all" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
           >
             Continue Shopping
           </Link>
        )}
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {productCards}
        </div>
      ) : (
        <NoItems />
      )}
    </div>
  );
};

export default Wishlist;
