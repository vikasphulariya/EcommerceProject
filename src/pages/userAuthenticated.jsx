import { useEffect, useState } from "react";
import { auth } from "../app/firebase/firebase";
import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

function UserAuthenticated({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    setTimeout(() => {
      if (user && user.emailVerified) {
        navigate("/", { replace: true });
      } else {
        setLoading(false);
      }
    }, 300);
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">
            Secure Access
          </p>
          <h3 className="text-sm font-bold text-gray-900">Identifying Student Account...</h3>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default UserAuthenticated;

