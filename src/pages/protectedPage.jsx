import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuthNeeded from "./AuthNeeded"; // Adjust the path as needed
import { ClipLoader } from "react-spinners";
// import ComponentA from "./ComponentA"; // Adjust the path as needed

function ProtectedPage({ children }) {
  const isLoggedIn = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);
  if (loading)
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">
          Verifying Permissions...
        </p>
      </div>
    );

  return isLoggedIn ? <> {children}</> : <AuthNeeded />;
}

export default ProtectedPage;

