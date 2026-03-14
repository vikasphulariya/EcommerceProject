import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { createListing } from "../../app/firebase/listingManager";

export default function AddListing() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const CATEGORIES = [
    "Books",
    "Notes",
    "Lab Tools",
    "Stationery",
    "Electronics",
    "Bicycles",
    "Hostel Needs",
    "Other"
  ];

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please upload an image for your listing.");
      return;
    }

    const formData = new FormData(e.target);
    const data = {
      name: formData.get("title"), // Changed back to 'name' to preserve original struct
      description: formData.get("description"),
      price: Number(formData.get("price")),
      discountPrice: Number(formData.get("price")), // To keep legacy AddToCart math working
      category: formData.get("category"),
      condition: formData.get("condition"),
    };

    setLoading(true);
    const result = await createListing(data, imageFile, user);
    setLoading(false);

    if (result.success) {
      navigate("/"); // Or navigate to the newly created product page: `/product/${result.id}`
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center py-10 px-4 bg-gray-50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <h1 className="text-2xl font-bold">Sell an Item</h1>
          <p className="text-blue-100 mt-1">List an item for sale or exchange with students on campus.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Basic Info */}
            <div className="flex flex-col gap-4">
              <label className="flex flex-col">
                <span className="font-semibold text-gray-700 mb-1">Title <span className="text-red-500">*</span></span>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Fundamental of Physics 10th Ed."
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </label>

              <label className="flex flex-col">
                <span className="font-semibold text-gray-700 mb-1">Price (₹) <span className="text-red-500">*</span></span>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 500 (Set to 0 if exchanging)"
                  min="0"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="font-semibold text-gray-700 mb-1">Category <span className="text-red-500">*</span></span>
                  <select
                    name="category"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="font-semibold text-gray-700 mb-1">Condition <span className="text-red-500">*</span></span>
                  <select
                    name="condition"
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                  </select>
                </label>
              </div>

              <label className="flex flex-col">
                <span className="font-semibold text-gray-700 mb-1">Description <span className="text-red-500">*</span></span>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Describe your item, its condition, and reason for selling..."
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                ></textarea>
              </label>
            </div>

            {/* Right Column: Image Upload */}
            <div className="flex flex-col gap-4">
              <span className="font-semibold text-gray-700">Item Image <span className="text-red-500">*</span></span>
              
              <label 
                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative ${imagePreview ? 'border-primary' : 'border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50'}`}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
                
                {imagePreview ? (
                  <div className="w-full h-full absolute inset-0 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-semibold">
                      Click to Change Image
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center p-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">Click to browse or drag image here</span>
                    <span className="text-gray-400 text-sm mt-1">Supports JPG, PNG</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 border-t mt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition flex items-center justify-center min-w-[150px]"
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Post Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
