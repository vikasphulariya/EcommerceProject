import { useState, useRef, useEffect } from "react";
import { BiUser, BiLogOut, BiHeart, BiStore, BiChevronDown, BiPlus } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../app/store/userSlice";
import { clearCart } from "../app/store/cartSlice";
import { clearWishlist } from "../app/store/wishlistSlice";
import { auth } from "../app/firebase/firebase";
import { toast } from "react-toastify";

function ProfileBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const wishListPrdoucts = useSelector((state) => state.wishlist.products);
  const navigate = useNavigate();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      dispatch(removeUser());
      dispatch(clearCart());
      dispatch(clearWishlist());
      toast.success("Successfully logged out", { position: "bottom-center" });
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link 
          to="/login" 
          className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
        >
          Sign In
        </Link>
        <Link 
          to="/register" 
          className="bg-blue-600 text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
        >
          Join UniMart
        </Link>
      </div>
    );
  }

  const userInitial = user.displayName ? user.displayName[0] : (user.email ? user.email[0] : "U");

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all active:scale-95 border border-transparent hover:border-gray-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-black shadow-sm uppercase">
          {userInitial}
        </div>
        <BiChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          {/* Header */}
          <div className="bg-gray-50/50 p-5 border-b border-gray-100">
             <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-black uppercase">
                  {userInitial}
                </div>
                <div className="flex flex-col overflow-hidden">
                   <p className="text-sm font-black text-gray-900 leading-none truncate mb-1">
                      {user.displayName || "Marketplace User"}
                   </p>
                   <p className="text-[11px] font-medium text-gray-500 truncate italic">
                      {user.email}
                   </p>
                </div>
             </div>
          </div>

          {/* Links Section */}
          <div className="p-2">
            <Link
              to="/sell"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 transition-all group"
            >
              <div className="p-2 bg-white/20 rounded-xl">
                <BiPlus size={18} />
              </div>
              <span>Sell an Item</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all group"
            >
              <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                <BiUser size={18} />
              </div>
              <span>My Profile</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-rose-100 transition-colors">
                  <BiHeart size={18} />
                </div>
                <span>Wishlist</span>
              </div>
              {wishListPrdoucts.length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {wishListPrdoucts.length}
                </span>
              )}
            </Link>

            <Link
              to="/my-listings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
            >
              <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <BiStore size={18} />
              </div>
              <span>My Listings</span>
            </Link>
          </div>

          <div className="h-px bg-gray-100 mx-2 my-1"></div>

          {/* Logout Section */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all group"
            >
              <div className="p-2 bg-rose-100/50 rounded-xl group-hover:bg-rose-100 transition-colors">
                <BiLogOut size={18} />
              </div>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileBtn;
