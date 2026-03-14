import { useNavigate } from "react-router-dom";
import { BiLockAlt, BiArrowBack, BiUserPlus } from "react-icons/bi";

function AuthNeeded() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-blue-50 border border-gray-100 text-center max-w-lg w-full relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50"></div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200 rotate-3 group-hover:rotate-0 transition-transform">
            <BiLockAlt size={40} className="text-white" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
            Authentication Required
          </h1>
          
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            This part of the campus marketplace is exclusive to our community. 
            Please sign in or create an account to continue.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <BiLockAlt size={20} />
              <span>Sign In to Your Account</span>
            </button>
            
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-white border-2 border-gray-100 hover:border-blue-200 text-gray-700 font-bold py-4 rounded-2xl transition-all hover:bg-blue-50 active:scale-95 flex items-center justify-center gap-2"
            >
              <BiUserPlus size={20} />
              <span>Create Student Account</span>
            </button>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors mx-auto group"
          >
            <BiArrowBack className="group-hover:-translate-x-1 transition-transform" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthNeeded;
