import { useNavigate } from "react-router-dom";
import PageLayout from "./PageLayout";
import { BiErrorCircle, BiHomeAlt, BiArrowBack } from "react-icons/bi";

function NoPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        {/* Large Ghosty 404 Text */}
        <div className="relative mb-8">
           <h2 className="text-[12rem] md:text-[16rem] font-black text-gray-50 leading-none select-none">
             404
           </h2>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center">
                 <BiErrorCircle size={60} className="text-rose-500 animate-bounce" />
              </div>
           </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
          Page Not Found
        </h1>
        
        <p className="text-gray-500 font-medium max-w-md mx-auto mb-12 leading-relaxed text-lg">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
          >
            <BiHomeAlt size={20} />
            <span>Marketplace Home</span>
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 font-bold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all active:scale-95"
          >
            <BiArrowBack size={20} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Support Links */}
        <div className="mt-16 pt-8 border-t border-gray-100 w-full max-w-lg mx-auto flex justify-center gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
           <button onClick={() => navigate("/contact-us")} className="hover:text-blue-600 transition-colors">Contact Support</button>
           <button onClick={() => navigate("/categories/all")} className="hover:text-blue-600 transition-colors">Browse Products</button>
        </div>
      </div>
    </PageLayout>
  );
}

export default NoPage;
