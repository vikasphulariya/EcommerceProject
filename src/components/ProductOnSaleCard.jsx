import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { deleteResource } from "../app/firebase/listingManager";
import ActionConfirmModal from "./ActionConfirmModal";

/* eslint-disable react/prop-types */
function ProductOnSaleCard({ product }) {
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
      <div className="relative group min-w-[170px] max-w-[200px] shrink-0">
        <Link to={`/product/${product.id}`} className="block h-full">
          <div className="card h-full relative bg-white rounded-xl p-2.5 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden border border-transparent hover:border-gray-100">
            
            {/* Owner Actions */}
            {isOwner && (
              <div className="absolute top-2 right-2 z-30 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  onClick={handleEdit}
                  className="p-1.5 bg-white/90 backdrop-blur-md text-blue-600 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-50"
                >
                  <BiEditAlt size={14} />
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDeleteModal(true);
                  }}
                  className="p-1.5 bg-white/90 backdrop-blur-md text-rose-600 rounded-lg shadow-lg hover:bg-rose-600 hover:text-white transition-all border border-rose-50"
                >
                  <BiTrash size={14} />
                </button>
              </div>
            )}

            <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm border border-blue-100">
              {product.category || product.type}
            </div>
            
            <div className="product-image w-full bg-gray-100/60 rounded-lg flex justify-center items-center overflow-hidden mb-2 relative h-32 md:h-36 border border-gray-100/50">
              <img
                className="object-contain w-full h-full p-2 drop-shadow-sm mix-blend-multiply transition-transform group-hover:scale-110 duration-500"
                src={product.imgUrl || "https://placehold.co/400x300"}
                alt={product.name}
              />
            </div>
            
            <div className="card-body flex flex-col flex-grow px-1">
              <h2 className="card-title font-bold text-gray-800 line-clamp-2 text-xs md:text-sm leading-snug mb-2 group-hover:text-blue-700 transition-colors">
                {product.name || product.title}
              </h2>
              
              <div className="mt-auto flex justify-between items-end">
                <h3 className="font-extrabold text-blue-700 text-sm md:text-base">
                  {product.price ? `₹${product.price}` : "FREE"}
                </h3>
                <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                  {product.condition || product.year}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <ActionConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Listing?"
        message={`Remove "${product.name || product.title}"?`}
      />
    </>
  );
}

export default ProductOnSaleCard;
