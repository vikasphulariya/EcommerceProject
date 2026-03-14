import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../app/firebase/firebase";
import ProductCard from "../../components/ProductCard";
import { ClipLoader } from "react-spinners";
import {
  BiUserCircle,
  BiMapPin,
  BiMailSend,
  BiPhone,
  BiBookOpen,
  BiStore,
  BiGlobe,
  BiLockAlt,
  BiFile,
} from "react-icons/bi";

export default function PublicProfile() {
  const { userId } = useParams();
  const viewer = useSelector((state) => state.user.user);

  const [profileUser, setProfileUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const snap = await getDoc(doc(db, "users", userId));
        if (snap.exists()) {
          setProfileUser({ uid: userId, ...snap.data() });
        } else {
          setProfileUser(null);
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        setProfileUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchListings = async () => {
      setLoadingListings(true);
      try {
        // Products listed by this user
        const prodQ = query(
          collection(db, "products"),
          where("sellerId", "==", userId)
        );
        const prodSnap = await getDocs(prodQ);
        const products = prodSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Study materials shared by this user
        const matQ = query(
          collection(db, "study_materials"),
          where("uploaderId", "==", userId)
        );
        const matSnap = await getDocs(matQ);
        let mats = matSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Visibility rules:
        // - Never show anonymous materials
        // - Always show public ("all")
        // - Show college-only ("college") only if viewer is from same college
        mats = mats.filter((m) => {
          if (m.isAnonymous) return false;

          if (m.visibility === "all") return true;

          if (
            m.visibility === "college" &&
            viewer &&
            viewer.college &&
            m.uploaderCollege === viewer.college
          ) {
            return true;
          }

          return false;
        });

        setMarketplaceItems(products);
        setStudyMaterials(mats);
      } catch (error) {
        console.error("Error loading user listings:", error);
        setMarketplaceItems([]);
        setStudyMaterials([]);
      } finally {
        setLoadingListings(false);
      }
    };

    fetchListings();
  }, [userId, viewer?.college]);

  if (loadingUser) {
    return (
      <div className="w-full h-[60vh] grid place-items-center">
        <ClipLoader color="#2563EB" size={48} />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="w-full h-[60vh] grid place-items-center">
        <div className="text-center">
          <p className="text-2xl font-black text-gray-900 mb-2">Profile not found</p>
          <p className="text-gray-500 font-medium">
            This user profile does not exist or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  const initial = profileUser.name?.[0] || profileUser.displayName?.[0] || "?";

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 md:py-16">
        {/* Profile Header */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-blue-900/5 overflow-hidden mb-12">
          {/* Cover */}
          <div className="h-40 md:h-56 bg-gray-900 relative">
            {profileUser.coverUrl ? (
              <img
                src={profileUser.coverUrl}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Avatar & basic info */}
          <div className="px-6 md:px-12 pb-10 -mt-16 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-[2rem] border-8 border-white shadow-2xl overflow-hidden bg-white shrink-0">
                {profileUser.profileUrl ? (
                  <img
                    src={profileUser.profileUrl}
                    alt={profileUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-full h-full flex items-center justify-center text-4xl md:text-5xl font-black">
                    {initial}
                  </div>
                )}
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">
                    {profileUser.name || profileUser.displayName || "Student"}
                  </h1>
                  {profileUser.profileCompleted && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest">
                      <BiUserCircle size={14} />
                      Verified Student
                    </span>
                  )}
                </div>

                {profileUser.college && (
                  <p className="flex items-center justify-center md:justify-start gap-2 text-gray-500 font-medium text-sm">
                    <BiMapPin className="text-blue-500" />
                    <span>{profileUser.college}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Contact & meta */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Name
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {profileUser.name || profileUser.displayName || "Not provided"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  College
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {profileUser.college || "Not shared"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Contact
                </p>
                {profileUser.isPublicContact ? (
                  <div className="space-y-1.5 text-sm font-medium text-gray-700">
                    {profileUser.email && (
                      <div className="flex items-center gap-2">
                        <BiMailSend className="text-blue-500" />
                        <span className="truncate">{profileUser.email}</span>
                      </div>
                    )}
                    {profileUser.mobile && (
                      <div className="flex items-center gap-2">
                        <BiPhone className="text-emerald-500" />
                        <span>{profileUser.mobile}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs font-medium text-gray-500">
                    Contact details are hidden by this user.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-16">
          {/* Marketplace items */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BiStore size={20} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    Items for Sale
                  </h2>
                  <p className="text-xs font-medium text-gray-500">
                    Marketplace listings shared by this student.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-black uppercase tracking-widest">
                {marketplaceItems.length} Active
              </span>
            </div>

            {loadingListings ? (
              <div className="w-full h-40 grid place-items-center">
                <ClipLoader color="#2563EB" size={32} />
              </div>
            ) : marketplaceItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                {marketplaceItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-10 px-6 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
                <p className="text-sm font-medium text-gray-500">
                  This user has no active marketplace listings yet.
                </p>
              </div>
            )}
          </section>

          {/* Study materials */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BiBookOpen size={20} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    Shared Study Materials
                  </h2>
                  <p className="text-xs font-medium text-gray-500">
                    Public and college-level resources (non-anonymous).
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-black uppercase tracking-widest">
                {studyMaterials.length} Resources
              </span>
            </div>

            {loadingListings ? (
              <div className="w-full h-40 grid place-items-center">
                <ClipLoader color="#4F46E5" size={32} />
              </div>
            ) : studyMaterials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {studyMaterials.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full"
                  >
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      {item.visibility === "college" ? (
                        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100 flex items-center gap-1.5">
                          <BiLockAlt size={14} />
                          <span className="text-[8px] font-black uppercase tracking-tight">
                            College Only
                          </span>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl border border-emerald-100 flex items-center gap-1.5">
                          <BiGlobe size={14} />
                          <span className="text-[8px] font-black uppercase tracking-tight">
                            Public
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="w-full aspect-video bg-gray-50 rounded-3xl mb-6 overflow-hidden flex items-center justify-center border border-gray-50">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600">
                          <BiFile size={32} />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {item.fileType || "Document"}
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">
                        {item.type}
                      </span>
                      <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs font-medium text-gray-500 line-clamp-2 mb-4">
                        {item.description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.year && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black border border-gray-100 uppercase tracking-tight">
                            {item.year}
                          </span>
                        )}
                        {item.course && (
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black border border-indigo-100 uppercase tracking-tight truncate max-w-[150px]">
                            {item.course}
                          </span>
                        )}
                        {item.uploaderCollege && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black border border-blue-100 uppercase tracking-tight truncate max-w-[150px]">
                            {item.uploaderCollege}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.fileUrl && (
                      <div className="pt-4 border-t border-gray-50 mt-auto">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                        >
                          <BiBookOpen size={18} />
                          <span>Open Resource</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 px-6 bg-white rounded-[2rem] border border-dashed border-gray-200 text-center">
                <p className="text-sm font-medium text-gray-500">
                  This user has not shared any visible study materials yet.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

