import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileInfoLabel from "./components/ProfileInfoLabel";
import { auth } from "../../app/firebase/firebase";
import { updateUserInfo } from "../../app/firebase/userMange";
import { useEffect } from "react";
import { loadBookmarksAsync } from "../../app/store/bookmarkSlice";
import { 
  BiEditAlt, BiCamera, BiCheck, BiX, BiUserCircle, 
  BiBriefcaseAlt, BiDetail, BiBadgeCheck, BiShield, 
  BiLoaderAlt, BiBookmark, BiFile, BiDownload, 
  BiLockAlt, BiGlobe, BiTrash 
} from "react-icons/bi";
import BookmarkButton from "../../components/BookmarkButton";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const bookmarks = useSelector((state) => state.bookmarks.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverUrlInput, setCoverUrlInput] = useState(user?.coverUrl || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(loadBookmarksAsync());
    }
  }, [user?.uid, dispatch]);

  const handleUpdateCover = async () => {
    setLoading(true);
    const res = await updateUserInfo("coverUrl", coverUrlInput);
    if (res === "true") {
      setIsCoverModalOpen(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 md:py-16">
        
        {/* Profile Card Container */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
          
          {/* Header/Cover Section */}
          <div className="h-48 md:h-64 bg-gray-100 w-full relative group">
            {user.coverUrl ? (
              <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 opacity-20 flex flex-wrap gap-4 p-8 pointer-events-none">
                    {[...Array(20)].map((_, i) => <div key={i} className="w-32 h-1 bg-white rounded-full rotate-45"></div>)}
                 </div>
              </div>
            )}
            
            <button
              onClick={() => setIsCoverModalOpen(true)}
              className="absolute top-6 right-6 bg-white/20 hover:bg-white text-white hover:text-blue-600 px-6 py-3 flex items-center gap-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all font-black text-xs uppercase tracking-widest backdrop-blur-xl shadow-xl hover:shadow-2xl"
            >
              <BiCamera size={18} />
              <span>Update Cover</span>
            </button>
          </div>

          <div className="px-6 md:px-12 pb-12 relative">
            {/* Profile Pic & Stats Area */}
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 mb-12 gap-6 md:gap-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] md:rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden bg-white shrink-0 group relative">
                {user.profileUrl ? (
                  <img src={user.profileUrl} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-full h-full flex items-center justify-center text-6xl font-black italic">
                    {user.name?.[0] || "?"}
                  </div>
                )}
                {/* Profile Pic Upload Trigger (Placeholder functionality) */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white">
                   <BiCamera size={32} />
                </div>
              </div>

              <div className="text-center md:text-left flex-grow mb-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                   <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                   {user.profileCompleted && (
                     <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100">
                        <BiBadgeCheck size={16} />
                        <span>Verified Student</span>
                     </div>
                   )}
                </div>
                <p className="text-gray-500 font-bold text-lg md:text-xl truncate max-w-md">{user.email}</p>
              </div>

            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
              
              {/* Left Column: Personal Information */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-10 bg-blue-600 rounded-full"></div>
                   <div className="flex items-center gap-2">
                      <BiUserCircle className="text-blue-600" size={24} />
                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Personal Profile</h2>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ProfileInfoLabel title="Full Name" value={user.name} property="name" />
                  <ProfileInfoLabel title="Phone Number" value={user.mobile} property="mobile" />
                  <ProfileInfoLabel title="Email Address" value={user.email} property="email" />
                  <ProfileInfoLabel title="Address / Hostel" value={user.address || "Not Provided"} property="address" />
                </div>
              </div>

              {/* Right Column: Academic Information */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
                   <div className="flex items-center gap-2">
                      <BiBriefcaseAlt className="text-indigo-600" size={24} />
                      <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Academic Profile</h2>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <ProfileInfoLabel title="College / University" value={user.college || "Not Provided"} property="college" />
                  </div>
                  <ProfileInfoLabel title="Degree" value={user.degree} property="degree" />
                  <ProfileInfoLabel title="Course / Major" value={user.course} property="course" />
                </div>

                {/* Privacy & Settings Section */}
                <div className="mt-12">
                   <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-10 bg-rose-500 rounded-full"></div>
                    <div className="flex items-center gap-2">
                        <BiShield className="text-rose-500" size={24} />
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Privacy Settings</h2>
                    </div>
                  </div>

                  <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-md">
                       <h3 className="text-lg font-black text-gray-900 mb-1">Public Contact Visibility</h3>
                       <p className="text-sm font-medium text-gray-500 leading-relaxed">
                         Enable this to make your phone and email visible to members for direct contact.
                       </p>
                    </div>

                    <label className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl border border-rose-100 hover:border-rose-300 cursor-pointer transition-all shadow-sm shrink-0">
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={user.isPublicContact || false}
                          onChange={(e) => updateUserInfo("isPublicContact", e.target.checked)}
                        />
                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                      </div>
                      <span className="text-sm font-black text-gray-900 uppercase tracking-tight">
                        {user.isPublicContact ? "Visible" : "Hidden"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bookmarked Resources Section */}
        <div className="mt-20">
           <div className="flex items-center justify-between mb-10 px-4">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-sm">
                    <BiBookmark size={24} />
                 </div>
                 <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Saved Resources</h2>
                    <p className="text-gray-500 font-bold text-sm">Materials you've bookmarked for later study.</p>
                 </div>
              </div>
              <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                 {bookmarks.length} Items
              </span>
           </div>

           {bookmarks.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {bookmarks.map((item) => (
                  <div key={item.id} className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full hover:-translate-y-1">
                     <div className="absolute top-4 right-4 z-10 flex gap-2">
                        <BookmarkButton material={item} />
                        <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl border border-indigo-100 flex items-center gap-1.5 backdrop-blur-md">
                           {item.visibility === 'college' ? <BiLockAlt size={14} /> : <BiGlobe size={14} />}
                        </div>
                     </div>

                     <div className="w-full aspect-video bg-gray-50 rounded-3xl mb-6 overflow-hidden flex items-center justify-center relative border border-gray-50 group-hover:bg-blue-50/30 transition-colors">
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                              <BiFile size={32} />
                           </div>
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.fileType || "Document"}</span>
                        </div>
                     </div>

                     <div className="flex-grow px-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">{item.type}</span>
                        <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                        <p className="text-xs font-medium text-gray-500 line-clamp-2 mb-4">{item.description || "No description provided."}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                           <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black border border-gray-100 uppercase tracking-tight">{item.year}</span>
                           <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black border border-blue-100 uppercase tracking-tight truncate max-w-[150px]">{item.course}</span>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-gray-50 mt-auto">
                        <a href={item.fileUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 shadow-xl shadow-gray-200 hover:shadow-blue-200 transition-all active:scale-95">
                           <BiDownload size={18} />
                           <span>Download & Study</span>
                        </a>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-20 px-8 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-sm">
                   <BiBookmark size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No bookmarks yet</h3>
                <p className="text-gray-500 font-bold max-w-sm mx-auto mb-8">Save important resources from the Knowledge Base to find them here easily later.</p>
                <button 
                  onClick={() => navigate("/study-material")}
                  className="bg-white text-blue-600 border-2 border-blue-50 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-blue-200 hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
                >
                  Browse Knowledge Base
                </button>
             </div>
           )}
        </div>
      </div>

      {/* Custom Tailwind Modal for Cover URL */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsCoverModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                   <BiCamera size={32} />
                </div>
                <div>
                   <h2 className="text-2xl font-black text-gray-900 tracking-tight">Update Cover Art</h2>
                   <p className="text-gray-500 font-medium">Add a personal touch to your profile banner.</p>
                </div>
             </div>

             <div className="mb-10">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Host Image URL</label>
                <input
                  value={coverUrlInput}
                  onChange={(e) => setCoverUrlInput(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-sm"
                  placeholder="Paste URL (e.g., Unsplash/Imgur links)"
                  autoFocus
                />
             </div>

             <div className="flex gap-4">
                <button
                  onClick={handleUpdateCover}
                  disabled={loading || !coverUrlInput || coverUrlInput === user.coverUrl}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <BiLoaderAlt className="animate-spin" size={20} />
                  ) : (
                    <>
                      <BiCheck size={22} />
                      <span>Apply Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsCoverModalOpen(false)}
                  className="px-8 bg-gray-50 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all active:scale-95"
                >
                  Cancel
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
