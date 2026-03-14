import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../app/firebase/firebase";
import ProductCard from "../../components/ProductCard";
import { ClipLoader } from "react-spinners";
import { BiPlus, BiTrash, BiEditAlt, BiStore } from "react-icons/bi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function MyListings() {
  const user = useSelector((state) => state.user.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      fetchUserListings();
    }
  }, [user]);

  const fetchUserListings = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "products"),
        where("sellerId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setListings(items);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setListings(prev => prev.filter(item => item.id !== id));
        toast.success("Listing deleted successfully");
      } catch (error) {
        toast.error("Failed to delete listing");
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] grid place-items-center">
        <ClipLoader color="#2563EB" size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">My Listings</h1>
           </div>
           <p className="text-gray-500 font-medium ml-4">
              You have {listings.length} active items in the marketplace
           </p>
        </div>
        
        <Link 
          to="/sell" 
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <BiPlus size={24} />
          <span>New Listing</span>
        </Link>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {listings.map((product) => (
            <div key={product.id} className="relative group">
               <ProductCard product={product} />
               {/* Controls Overlay */}
               <div className="absolute top-4 left-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-3 bg-white text-rose-600 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-all transform hover:scale-110"
                    title="Delete Listing"
                  >
                    <BiTrash size={20} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
           <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <BiStore size={40} className="text-gray-300" />
           </div>
           <h3 className="text-2xl font-black text-gray-900 mb-2">No active listings</h3>
           <p className="text-gray-500 max-w-sm text-center mb-8">
              You haven't posted any items for sale yet. Start selling today!
           </p>
           <Link 
            to="/sell" 
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg border-b-4 border-blue-800 hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-0 transition-all"
          >
             Post an Item
           </Link>
        </div>
      )}
    </div>
  );
}
