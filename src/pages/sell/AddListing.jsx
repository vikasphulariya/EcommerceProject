import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { createListing, updateListing } from "../../app/firebase/listingManager";
import { BiImageAdd, BiTrash, BiCheckCircle, BiChevronLeft, BiBookOpen } from "react-icons/bi";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../app/firebase/firebase";

export default function AddListing() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const editType = searchParams.get("type");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: "",
    condition: "",
    degree: "",
    course: "",
    year: "1st Year",
    type: "Notes"
  });

  const CATEGORIES = [
    "Books",
    "Lab Tools",
    "Stationery",
    "Electronics",
    "Bicycles",
    "Hostel Needs",
    "Other"
  ];

  const MATERIAL_TYPES = ["Notes", "Handwritten Notes", "Printed Notes", "Previous Year Papers", "Textbook", "Reference Book", "Project Report", "Other"];
  const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

  useEffect(() => {
    if (editId) {
      loadEditData();
    }
  }, [editId]);

  const loadEditData = async () => {
    setFetching(true);
    try {
      const collectionName = editType === "study" ? "study_materials" : "products";
      const docSnap = await getDoc(doc(db, collectionName, editId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.sellerId !== user.uid && data.uploaderId !== user.uid) {
           toast.error("You don't have permission to edit this listing");
           navigate("/");
           return;
        }
        setFormState({
          name: data.name || data.title || "",
          description: data.description || "",
          price: data.price || "",
          condition: data.condition || "",
          degree: data.degree || "",
          course: data.course || "",
          year: data.year || "1st Year",
          type: data.type || "Notes"
        });
        setSelectedCategory(data.category || (editType === "study" ? "Books" : ""));
        setImagePreview(data.imgUrl);
      }
    } catch (error) {
      console.error("Error loading edit data:", error);
      toast.error("Failed to load listing details");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview && !imageFile) {
      toast.error("Please upload an image for your listing.");
      return;
    }

    const data = {
      ...formState,
      price: Number(formState.price),
      discountPrice: Number(formState.price),
      category: selectedCategory,
      // Pass along existing imgUrl if in edit mode and no new image
      imgUrl: editId ? imagePreview : null 
    };

    setLoading(true);
    let result;
    if (editId) {
      result = await updateListing(editId, data, imageFile, user, editType);
    } else {
      result = await createListing(data, imageFile, user);
    }
    setLoading(false);

    if (result.success) {
      navigate("/my-listings");
    }
  };

  const isStudyMaterial = selectedCategory === "Books";

  if (fetching) {
     return (
       <div className="h-screen flex items-center justify-center">
          <ClipLoader color="#2563EB" size={50} />
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all text-gray-400 hover:text-gray-900"
              >
                <BiChevronLeft size={24} />
              </button>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight italic">
                   {editId ? "Update Listing" : "Sell Something"}
                 </h1>
                 <p className="text-gray-500 font-bold mt-1 uppercase tracking-widest text-[10px]">
                   {editId ? "Refresh your item details for better engagement" : "Turn your extras into someone's essentials"}
                 </p>
              </div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Left: Image Upload Zone */}
          <div className="lg:col-span-5">
             <div className="sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                   <h2 className="text-xl font-black text-gray-900 tracking-tight">Show it off</h2>
                </div>

                <label 
                  className={`group relative w-full aspect-square sm:aspect-[4/5] rounded-[2.5rem] border-4 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${imagePreview ? 'border-blue-600' : 'border-gray-100 hover:border-blue-200 bg-gray-50 hover:bg-blue-50/50'}`}
                >
                   <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                   
                   {imagePreview ? (
                      <div className="w-full h-full animate-in zoom-in-95 duration-500">
                         <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity backdrop-blur-sm">
                            <BiImageAdd size={48} className="mb-2" />
                            <span className="font-black text-xs uppercase tracking-widest">Change Image</span>
                         </div>
                      </div>
                   ) : (
                      <div className="flex flex-col items-center text-center p-12">
                         <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                            <BiImageAdd size={32} />
                         </div>
                         <h3 className="text-lg font-black text-gray-900 mb-2">Upload high quality photo</h3>
                         <p className="text-sm font-medium text-gray-400 leading-relaxed">Better photos lead to <br/> 3x faster sales in our community.</p>
                      </div>
                   )}
                </label>
             </div>
          </div>

          {/* Right: Details Form */}
          <div className="lg:col-span-7 space-y-10">
             
              {/* Section 1: Core Details */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Main Details</h2>
                 </div>

                 <div className="space-y-4">
                    <div className="relative group">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Item Title</label>
                       <input
                        type="text"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="What are you selling?"
                        className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all"
                       />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative group">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Category</label>
                          <select
                            name="category"
                            required
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold text-gray-900 appearance-none transition-all cursor-pointer"
                          >
                            <option value="">Select Category</option>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                        <div className="relative group">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Condition</label>
                          <select
                            name="condition"
                            required
                            value={formState.condition}
                            onChange={handleInputChange}
                            className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold text-gray-900 appearance-none transition-all cursor-pointer"
                          >
                            <option value="">Select Condition</option>
                            <option value="New">New</option>
                            <option value="Like New">Like New</option>
                            <option value="Used - Good">Used - Good</option>
                            <option value="Used - Fair">Used - Fair</option>
                          </select>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Conditionally Render Study Material Fields */}
              {isStudyMaterial && (
                <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <BiBookOpen className="text-blue-600" size={24} />
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Study Material Specs</h2>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block text-blue-600">Material Type</label>
                                <select 
                                    name="type" 
                                    value={formState.type}
                                    onChange={handleInputChange}
                                    className="w-full py-3.5 px-6 bg-white border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-sm"
                                >
                                    {MATERIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block text-blue-600">Academic Year</label>
                                <select 
                                    name="year" 
                                    value={formState.year}
                                    onChange={handleInputChange}
                                    className="w-full py-3.5 px-6 bg-white border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-sm"
                                >
                                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block text-blue-600">Target Degree</label>
                                <input 
                                    type="text" 
                                    name="degree" 
                                    value={formState.degree}
                                    onChange={handleInputChange}
                                    placeholder="e.g. B.Tech Computer Science"
                                    className="w-full py-3.5 px-6 bg-white border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block text-blue-600">Course / Subject Name</label>
                                <input 
                                    type="text" 
                                    name="course" 
                                    value={formState.course}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Data Structures"
                                    className="w-full py-3.5 px-6 bg-white border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-gray-900 transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {/* Section 2: Pricing & Description */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Pricing & About</h2>
                 </div>

                 <div className="space-y-4">
                    <div className="relative group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Asking Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        required
                        value={formState.price}
                        onChange={handleInputChange}
                        placeholder="0 for FREE / Exchange"
                        min="0"
                        className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all"
                      />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">Describe your item</label>
                        <textarea
                          name="description"
                          rows="5"
                          required
                          value={formState.description}
                          onChange={handleInputChange}
                          placeholder="Tell us about the condition, use history, or why you're passing it on..."
                          className="w-full py-5 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none font-bold text-gray-900 transition-all resize-none"
                        ></textarea>
                    </div>
                 </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-10 flex flex-col sm:flex-row gap-4">
                 <button
                    type="submit"
                    disabled={loading}
                    className="flex-grow bg-gray-900 text-white font-black py-5 px-8 rounded-3xl shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                 >
                    {loading ? (
                      <ClipLoader size={24} color="#ffffff" />
                    ) : (
                      <>
                        <span>{editId ? "Update Listing" : "Publish Listing"}</span>
                        <BiCheckCircle size={24} className="text-blue-400" />
                      </>
                    )}
                 </button>
              </div>

          </div>
        </form>
      </div>
    </div>
  );
}
