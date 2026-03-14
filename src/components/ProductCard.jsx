import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import ContactSellerBtn from "./ContactSellerBtn";
import AddToWishlist from "./AddToWishlist";
import { deleteResource } from "../app/firebase/listingManager";
import ActionConfirmModal from "./ActionConfirmModal";

function ProductCard({ product, className = "" }) {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.uid && (product.sellerId === user.uid || product.uploaderId === user.uid);

  const handleDelete = async () => {
    setIsDeleting(true);
    const type = product.isSharedMaterial ? "study" : "product";
    const result = await deleteResource(product.id, type);
    if (result.success) {
      window.location.reload(); 
    }
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/sell?id=${product.id}${product.isSharedMaterial ? '&type=study' : ''}`);
  };

  return (
    <>
      <div className={`card relative bg-white w-full rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${className}`}>
        
        {/* Owner Actions Overlay */}
        {isOwner && (
          <div className="absolute top-4 left-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
            <button 
              onClick={handleEdit}
              className="p-2 bg-white/90 backdrop-blur-md text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-50"
              title="Edit Listing"
            >
              <BiEditAlt size={18} />
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="p-2 bg-white/90 backdrop-blur-md text-rose-600 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-all border border-rose-50"
              title="Delete Listing"
            >
              <BiTrash size={18} />
            </button>
          </div>
        )}

        <Link to={`/product/${product.id}`} className="flex flex-col flex-grow">
          <div className="product-image w-full bg-gray-50 rounded-[1.5rem] flex justify-center items-center overflow-hidden mb-4 relative" style={{ height: "180px" }}>
            
            {/* Wishlist button overlay */}
            {!isOwner && (
              <div className="absolute top-2 right-2 z-20">
                <AddToWishlist product={product} />
              </div>
            )}

            <img
              className="object-contain w-full h-full p-2 drop-shadow-sm mix-blend-multiply transition-transform group-hover:scale-110 duration-500"
              src={product.imgUrl || "https://placehold.co/400x300"}
              alt={product.name}
            />
          </div>
          
          <div className="card-body flex flex-col flex-grow">
            <div className="flex gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                {product.category || product.type}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {product.condition || product.year}
              </span>
            </div>
            
            <h2 className="card-title font-bold text-gray-900 line-clamp-2 text-sm md:text-base leading-snug mt-1 mb-2">
              {product.name || product.title}
            </h2>
            
            <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
              <h3 className="font-black text-xl text-gray-900 tracking-tight">
                {product.price ? `₹${product.price}` : "FREE"}
              </h3>
            </div>
          </div>
        </Link>
        
        {!isOwner && (
          <div className="mt-3">
            <ContactSellerBtn product={product} />
          </div>
        )}
        
        {isOwner && (
          <div className="mt-3">
             <Link 
              to={`/product/${product.id}`}
              className="w-full py-3 bg-gray-50 text-gray-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100"
             >
                View My Listing
             </Link>
          </div>
        )}
      </div>

      <ActionConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Listing?"
        message={`Are you sure you want to remove "${product.name || product.title}"? This action cannot be undone.`}
      />
    </>
  );
}

export default ProductCard;
