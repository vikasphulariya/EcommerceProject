import { useEffect, useState, useMemo } from "react";
import { collection, getDocs, query, orderBy, where, or, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../app/firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../../components/ProductCard";
import ContactSellerBtn from "../../components/ContactSellerBtn";
import ActionConfirmModal from "../../components/ActionConfirmModal";
import BookmarkButton from "../../components/BookmarkButton";
import { addBookmarkAsync, loadBookmarksAsync, removeBookmarkAsync } from "../../app/store/bookmarkSlice";
import { ClipLoader } from "react-spinners";
import { BiFilterAlt, BiX, BiBookOpen, BiDownload, BiSearch, BiLockAlt, BiGlobe, BiFile, BiUserCircle, BiTrash, BiEditAlt } from "react-icons/bi";

export default function StudyMaterial() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    campus: "",
    degree: "",
    course: "", 
    year: "",
    type: ""
  });

  const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
  const TYPES = ["Notes", "Question Paper", "Assignment", "Textbook", "Project", "Other"];

  useEffect(() => {
    fetchMaterials();
    if (user) {
      dispatch(loadBookmarksAsync());
    }
  }, [user, dispatch]); // Re-fetch if user changes (college visibility)

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      // Fetch from dedicated 'study_materials' collection
      const matRef = collection(db, "study_materials");
      
      // We fetch all public items OR items from the same college
      // Note: Firestore 'or' queries with 'where' are now supported
      const q = query(
        matRef,
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      let items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isSharedMaterial: true }));

      // Client-side visibility filter
      if (user) {
        items = items.filter(item => {
           if (item.visibility === "college") {
              return item.uploaderCollege === user.college;
           }
           return true; // Public items
        });
      } else {
        // Logged out users only see public items
        items = items.filter(item => item.visibility === "all");
      }

      // Also merge with 'products' that are Books/Notes for backward compatibility
      const prodRef = collection(db, "products");
      const qProd = query(prodRef, where("category", "in", ["Books", "Notes"]));
      const prodSnap = await getDocs(qProd);
      const prodItems = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setMaterials([...items, ...prodItems]);
    } catch (error) {
      console.error("Error fetching study materials:", error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCampuses = useMemo(() => {
    const campuses = new Set(materials.map(m => m.uploaderCollege || m.sellerCollege).filter(Boolean));
    return Array.from(campuses).sort();
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      const itemCampus = item.uploaderCollege || item.sellerCollege;
      const matchCampus = !filters.campus || itemCampus === filters.campus;
      const matchYear = !filters.year || item.year === filters.year;
      const matchType = !filters.type || item.type === filters.type || item.category === filters.type;
      
      const matchSearch = !searchTerm || 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemCampus?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchCampus && matchYear && matchType && matchSearch;
    });
  }, [materials, filters, searchTerm]);

  const resetFilters = () => {
    setFilters({
      campus: "",
      degree: "",
      course: "",
      year: "",
      type: ""
    });
    setSearchTerm("");
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    try {
      const collectionName = deleteTarget.isSharedMaterial ? "study_materials" : "products";
      await deleteDoc(doc(db, collectionName, deleteTarget.id));
      setMaterials(prev => prev.filter(item => item.id !== deleteTarget.id));
      toast.success("Resource removed successfully");
    } catch (error) {
      toast.error("Failed to remove resource");
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
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-16 min-h-screen">
      {/* Hero Section */}
      <div className="relative mb-16 overflow-hidden bg-gray-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl">
         <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white rotate-3">
                   <BiBookOpen size={28} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Library & Resources</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-tight tracking-tight">Student Study <br/>Knowledge Base</h1>
            
            <div className="relative group max-w-xl">
               <BiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={24} />
               <input 
                type="text" 
                placeholder="Search notes, papers, or subjects..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-white outline-none focus:bg-white focus:text-gray-900 focus:ring-8 focus:ring-blue-500/20 transition-all font-bold"
               />
            </div>
         </div>
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex w-full items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-2xl font-bold shadow-sm active:scale-95 transition-all text-sm mb-4"
          >
            <BiFilterAlt size={18} />
            <span>Show Filters</span>
          </button>
        </div>
        {/* Sidebar */}
        <aside className="hidden lg:block w-80 shrink-0 sticky top-24 h-fit">
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filters</h3>
                <button onClick={resetFilters} className="text-xs font-bold text-blue-600 underline">Reset</button>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">By College</h4>
                <select 
                  value={filters.campus}
                  onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-100 outline-none text-sm font-bold"
                >
                  <option value="">All Campuses</option>
                  {uniqueCampuses.map(campus => <option key={campus} value={campus}>{campus}</option>)}
                </select>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">Resource Type</h4>
                <div className="flex flex-col gap-2">
                  {TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters(prev => ({ ...prev, type: prev.type === type ? "" : type }))}
                      className={`text-left px-4 py-3 rounded-2xl text-xs font-black transition-all ${filters.type === type ? "bg-blue-600 text-white shadow-lg" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
              {filteredMaterials.map((item) => (
                <div key={item.id} className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full">
                  {/* Visibility Badge & Delete for Owner */}
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                     {(item.uploaderId === user?.uid || item.sellerId === user?.uid) && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/sell?id=${item.id}&type=${item.isSharedMaterial ? 'study' : 'marketplace'}`)}
                            className="bg-white/80 backdrop-blur-md text-blue-600 p-2 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                            title="Edit Resource"
                          >
                             <BiEditAlt size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item)}
                            className="bg-white/80 backdrop-blur-md text-rose-600 p-2 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-all transform hover:scale-110"
                            title="Delete Resource"
                          >
                             <BiTrash size={14} />
                          </button>
                        </div>
                      )}
                      
                      {/* Bookmark for Non-Owners */}
                      {user?.uid && (item.uploaderId !== user.uid && item.sellerId !== user.uid) && (
                         <div className="bg-white/10 backdrop-blur-md rounded-xl">
                            <BookmarkButton material={item} />
                         </div>
                      )}

                     {item.visibility === 'college' ? (
                       <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100 tooltip flex items-center gap-1.5" title="College Restricted">
                          <BiLockAlt size={14} />
                          <span className="text-[8px] font-black uppercase tracking-tight">College Only</span>
                       </div>
                     ) : (
                       <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                          <BiGlobe size={14} />
                          <span className="text-[8px] font-black uppercase tracking-tight">Public</span>
                       </div>
                     )}
                  </div>

                  <div className="w-full aspect-video bg-gray-50 rounded-3xl mb-6 overflow-hidden flex items-center justify-center relative">
                     {item.fileUrl ? (
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600">
                              <BiFile size={32} />
                           </div>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.fileType}</span>
                        </div>
                     ) : (
                        <img src={item.imgUrl || "https://placehold.co/400x300?text=Notes"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     )}
                  </div>

                  <div className="flex-grow">
                     <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">{item.type || item.category}</span>
                     <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{item.title || item.name}</h3>
                     <p className="text-xs font-medium text-gray-500 line-clamp-2 mb-4">{item.description}</p>
                     
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                           <BiUserCircle size={16} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">
                           {item.isAnonymous ? "Anonymous Student" : (item.uploaderName || item.sellerName || "Uploader")}
                        </span>
                     </div>

                     <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black border border-gray-100 uppercase tracking-tight">{item.year}</span>
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black border border-indigo-100 uppercase tracking-tight truncate max-w-[150px]">{item.uploaderCollege || item.sellerCollege}</span>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-gray-50 mt-auto space-y-3">
                     {item.fileUrl && (
                        <a 
                          href={item.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors"
                        >
                           <BiDownload size={18} />
                           <span>Download File</span>
                        </a>
                     )}
                     
                     {!item.isAnonymous && (
                        <ContactSellerBtn 
                          product={item} 
                          label="Contact Publisher"
                          className="!py-3.5 !text-xs !uppercase !tracking-widest !rounded-2xl"
                        />
                     )}

                     {!item.fileUrl && (
                        <button className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors">
                           View Listing
                        </button>
                     )}
                  </div>
                </div>
              ))}
           </div>

           {filteredMaterials.length === 0 && (
             <div className="py-24 text-center">
                <BiBookOpen className="text-gray-200 mx-auto mb-6" size={64} />
                <h3 className="text-xl font-black text-gray-900">No resources found</h3>
                <p className="text-gray-500 font-medium">Try clearing your filters or check back later.</p>
             </div>
           )}
        </main>
      </div>
      <ActionConfirmModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={isDeleting}
        title="Delete Resource?"
        message={`Are you sure you want to remove "${deleteTarget?.title || deleteTarget?.name}"?`}
      />

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] bg-white animate-in slide-in-from-right duration-400 flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-black">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-gray-100 rounded-full">
                <BiX size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">By College</h4>
                <select 
                  value={filters.campus}
                  onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white outline-none text-sm font-bold"
                >
                  <option value="">All Campuses</option>
                  {uniqueCampuses.map(campus => <option key={campus} value={campus}>{campus}</option>)}
                </select>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">Resource Type</h4>
                <div className="flex flex-col gap-2">
                  {TYPES.map(type => (
                    <button key={type} onClick={() => setFilters(prev => ({ ...prev, type: prev.type === type ? "" : type }))}
                      className={`text-left px-4 py-3 rounded-2xl text-xs font-black transition-all ${filters.type === type ? "bg-blue-600 text-white shadow-lg" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                    >{type}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t">
              <button onClick={() => setShowMobileFilters(false)} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
