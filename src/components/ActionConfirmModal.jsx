import { createPortal } from "react-dom";
import { BiTrash, BiX, BiErrorCircle } from "react-icons/bi";
import { ClipLoader } from "react-spinners";

export default function ActionConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  confirmText = "Delete", 
  loading = false,
  variant = "danger" 
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const variantStyles = {
    danger: {
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
      btnBg: "bg-rose-600 hover:bg-rose-700",
      btnShadow: "shadow-rose-100",
      icon: <BiTrash size={28} />
    },
    warning: {
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      btnBg: "bg-amber-600 hover:bg-amber-700",
      btnShadow: "shadow-amber-100",
      icon: <BiErrorCircle size={28} />
    }
  };

  const style = variantStyles[variant] || variantStyles.danger;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-8 pb-0 flex flex-col items-center text-center">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
          >
            <BiX size={24} />
          </button>

          <div className={`w-20 h-20 ${style.iconBg} ${style.iconColor} rounded-3xl flex items-center justify-center mb-6`}>
            {style.icon}
          </div>

          <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
            {title}
          </h3>
          <p className="text-gray-500 font-bold leading-relaxed px-4">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="p-8 flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full py-4 ${style.btnBg} text-white font-black rounded-2xl shadow-xl ${style.btnShadow} transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : (
              <>
                {confirmText === "Delete" && <BiTrash size={18} />}
                <span>{confirmText}</span>
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-4 bg-gray-50 text-gray-900 font-black rounded-2xl hover:bg-gray-100 transition-all border border-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
