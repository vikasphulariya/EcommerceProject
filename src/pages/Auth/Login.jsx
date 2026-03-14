import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithFirebase, resetPassword } from "../../app/firebase/login";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { BiEnvelope, BiLockAlt, BiShow, BiHide, BiLogInCircle, BiErrorCircle } from "react-icons/bi";
import logo from "../../assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    const emailToReset = emailInput.trim();
    if (!emailToReset) {
      toast.error("Please enter your email address above first to reset your password");
      return;
    }
    
    // Basic email validation before spamming firebase
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToReset)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setResetLoading(true);
    try {
      const result = await resetPassword(emailToReset);
      if (result instanceof Error) {
        toast.error(result.message);
      } else {
        toast.success("Password reset link sent to your email!");
      }
    } catch (error) {
      toast.error("Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  const validate = (data) => {
    const newErrors = {};
    
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email?.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password Validation
    if (!data.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!validate(data)) {
      toast.error("Please provide valid login details");
      return;
    }

    setLoading(true);
    try {
      const response = await loginWithFirebase(data.email, data.password, rememberMe);
      if (response instanceof Error) {
        toast.error(response.message);
      } else {
        toast.success("Welcome back to UniMart!");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-12 md:py-20 flex justify-center items-center">
      <div className="w-full max-w-[500px] animate-in fade-in zoom-in-95 duration-700">
        
        {/* Card Container */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-gray-100 overflow-hidden">
          
          {/* Header/Logo Section */}
          <div className="bg-gray-900 p-10 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center p-3 shadow-xl mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src={logo} alt="UniMart" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight italic">Welcome Back</h1>
              <p className="text-gray-400 font-medium mt-2">Nice to see you again at UniMart</p>
            </div>
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </div>

          {/* Form Section */}
          <div className="p-10 md:p-12 space-y-8">
            <form onSubmit={loginUser} noValidate className="space-y-6">
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 block" htmlFor="email">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <BiEnvelope size={20} />
                  </div>
                  <input
                    className={`w-full pl-14 pr-6 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-900 transition-all ${errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-transparent focus:border-blue-600 focus:bg-white'}`}
                    type="email"
                    name="email"
                    id="email"
                    value={emailInput}
                    placeholder="name@college.edu"
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setErrors(prev => ({ ...prev, email: '' }));
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] font-bold text-rose-500 ml-4 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 mt-1">
                    <BiErrorCircle size={12} />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 block" htmlFor="password">
                  Security Password
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <BiLockAlt size={20} />
                  </div>
                  <input
                    className={`w-full pl-14 pr-14 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-900 transition-all font-mono ${errors.password ? 'border-rose-500 bg-rose-50/30' : 'border-transparent focus:border-blue-600 focus:bg-white'}`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    onChange={() => setErrors(prev => ({ ...prev, password: '' }))}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] font-bold text-rose-500 ml-4 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 mt-1">
                    <BiErrorCircle size={12} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only" 
                    />
                    <div className="w-5 h-5 bg-gray-100 border-2 border-gray-200 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Keep me signed in</span>
                </label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  disabled={resetLoading || loading}
                  className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {resetLoading ? <ClipLoader size={12} color="#2563EB" /> : null}
                  Forgot?
                </button>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white font-black py-5 rounded-[2rem] shadow-xl hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <ClipLoader size={24} color="#ffffff" />
                ) : (
                  <>
                    <span>Enter Marketplace</span>
                    <BiLogInCircle size={24} className="text-blue-400" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 font-medium">
                New to the community?{" "}
                <Link to="/register" className="text-blue-600 font-black hover:text-blue-700 transition-colors">
                  Join Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


