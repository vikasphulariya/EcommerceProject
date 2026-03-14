import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../app/firebase/firebase";
import ProductCard from "../../components/ProductCard";
import ActionConfirmModal from "../../components/ActionConfirmModal";
import { ClipLoader } from "react-spinners";
import { BiPlus, BiTrash, BiStore, BiBookOpen, BiGlobe, BiLockAlt, BiFile, BiDownload, BiChevronRight, BiUserCircle, BiEditAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function MyListings() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("marketplace"); // 'marketplace' or 'study'
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      fetchAllItems();
    }
  }, [user]);

  const fetchAllItems = async () => {
    setLoading(true);
    try {
      // Fetch Products - Remove orderBy to avoid index requirement for new fields
      const qProd = query(
        collection(db, "products"),
        where("sellerId", "==", user.uid)
      );
      const prodSnap = await getDocs(qProd);
      setMarketplaceItems(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch Study Materials - Remove orderBy to avoid index requirement for new fields
      const matRef = collection(db, "study_materials");
      const qStudy = query(
        matRef,
        where("uploaderId", "==", user.uid)
      );
      const studySnap = await getDocs(qStudy);
      setStudyMaterials(studySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load your items. Please check if indexes are prepared.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const collectionName = "study_materials";
      await deleteDoc(doc(db, collectionName, deleteTarget.id));
      setStudyMaterials(prev => prev.filter(item => item.id !== deleteTarget.id));
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
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
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
              <h1 className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter">Inventory</h1>
           </div>
           <p className="text-gray-500 font-bold ml-5 text-lg">
              Manage your active sales and shared resources in one place.
           </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
           <Link 
            to="/publish-material" 
            className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-3.5 rounded-2xl font-black hover:bg-indigo-100 transition-all active:scale-95 text-sm"
           >
            <BiBookOpen size={18} />
            <span>Publish Study Material</span>
           </Link>
           <Link 
            to="/sell" 
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 text-sm"
           >
            <BiPlus size={22} />
            <span>New Listing</span>
           </Link>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex gap-2 mb-10 bg-gray-50 p-2 rounded-[2rem] w-full sm:w-fit border border-gray-100 overflow-x-auto custom-scrollbar">
         <button 
           onClick={() => setActiveTab("marketplace")}
           className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'marketplace' ? 'bg-white text-blue-600 shadow-xl' : 'text-gray-400 hover:text-gray-700'}`}
         >
           Marketplace ({marketplaceItems.length})
         </button>
         <button 
           onClick={() => setActiveTab("study")}
           className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'study' ? 'bg-white text-indigo-600 shadow-xl' : 'text-gray-400 hover:text-gray-700'}`}
         >
           Study Materials ({studyMaterials.length})
         </button>
      </div>

      {/* Content Rendering */}
      {activeTab === "marketplace" ? (
        marketplaceItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {marketplaceItems.map((product) => (
              <div key={product.id}>
                 <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<BiStore size={40} />} 
            title="No marketplace items" 
            subtitle="You haven't posted any items for sale yet."
            link="/sell"
            btnText="Post Your First Item"
          />
        )
      ) : (
        studyMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {studyMaterials.map((item) => (
               <div key={item.id} className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full border-b-4 border-b-indigo-500">
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                     <button 
                       onClick={() => navigate(`/sell?id=${item.id}&type=study`)}
                       className="p-2 bg-white/80 backdrop-blur-md text-blue-600 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white"
                       title="Edit Resource"
                     >
                       <BiEditAlt size={16} />
                     </button>
                     <button 
                       onClick={() => handleDelete(item)}
                       className="p-2 bg-white/80 backdrop-blur-md text-rose-600 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 hover:text-white"
                       title="Delete Resource"
                     >
                       <BiTrash size={16} />
                     </button>
                     <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100 flex items-center gap-1.5">
                        {item.visibility === 'college' ? <BiLockAlt size={14} /> : <BiGlobe size={14} />}
                        <span className="text-[8px] font-black uppercase tracking-tight">{item.visibility}</span>
                     </div>
                     {item.isAnonymous && (
                        <div className="bg-slate-900 text-white p-2 rounded-xl flex items-center gap-1.5">
                           <BiUserCircle size={14} />
                           <span className="text-[8px] font-black uppercase tracking-tight">Anonymous</span>
                        </div>
                     )}
                  </div>

                  <div className="w-full aspect-video bg-gray-50 rounded-3xl mb-6 overflow-hidden flex items-center justify-center relative border border-gray-50">
                     <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600">
                           <BiFile size={32} />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.fileType}</span>
                     </div>
                  </div>

                  <div className="flex-grow">
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">{item.type}</span>
                     <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{item.title}</h3>
                     <p className="text-xs font-medium text-gray-500 line-clamp-2 mb-4">{item.description || "No description provided."}</p>
                     
                     <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black border border-gray-100 uppercase tracking-tight">{item.year}</span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black border border-indigo-100 uppercase tracking-tight truncate max-w-[150px]">{item.course}</span>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 mt-auto">
                     <a href={item.fileUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors">
                        <BiDownload size={18} />
                        <span>Download View</span>
                     </a>
                  </div>
               </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<BiBookOpen size={40} />} 
            title="No study materials" 
            subtitle="You haven't shared any resources with the community."
            link="/publish-material"
            btnText="Publish Your First Resource"
          />
        )
      )}
      <ActionConfirmModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete Resource?"
        message={`Are you sure you want to remove "${deleteTarget?.title}"? This cannot be recovered.`}
      />
    </div>
  );
}

function EmptyState({ icon, title, subtitle, link, btnText }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center px-6">
       <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-300">
          {icon}
       </div>
       <h3 className="text-2xl font-black text-gray-900 mb-2">{title}</h3>
       <p className="text-gray-500 max-w-sm mb-8 font-medium">
          {subtitle}
       </p>
       <Link 
        to={link} 
        className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-all"
      >
         {btnText}
       </Link>
    </div>
  );
}
