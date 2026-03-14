import { useNavigate, Link } from "react-router-dom";
import { registerNewUser } from "../../app/firebase/createUserWithEmailAndPassword";
import { useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { BiUser, BiEnvelope, BiPhone, BiLockAlt, BiShow, BiHide, BiUserPlus, BiErrorCircle } from "react-icons/bi";
import logo from "../../assets/logo.png";

function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const newErrors = {};
    if (!data.name?.trim()) newErrors.name = "Full name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email?.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!data.mobile?.trim()) {
      newErrors.mobile = "Phone number is required";
    } else if (!mobileRegex.test(data.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit phone number";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!validate(data)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    try {
      const result = await registerNewUser(data.email, data.password, data);
      if (result instanceof Error) {
        toast.error(result.message);
      } else {
        toast.success("Welcome to the community! Please login to continue.");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-12 md:py-20 flex justify-center items-center">
      <div className="w-full max-w-[550px] animate-in fade-in zoom-in-95 duration-700">
        
        {/* Card Container */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-gray-100 overflow-hidden">
          
          {/* Header/Logo Section */}
          <div className="bg-gray-900 p-10 text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center p-3 shadow-xl mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src={logo} alt="UniMart" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight italic">Join UniMart</h1>
              <p className="text-gray-400 font-medium mt-2">Start your campus journey with us</p>
            </div>
            {/* Decorative background circle */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          </div>

          {/* Form Section */}
          <div className="p-10 md:p-12 space-y-8">
            <form onSubmit={login} noValidate className="space-y-6">
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 block" htmlFor="name">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                    <BiUser size={20} />
                  </div>
                  <input
                    className={`w-full pl-14 pr-6 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-900 transition-all placeholder:font-medium ${errors.name ? 'border-rose-500 bg-rose-50/30' : 'border-transparent focus:border-blue-600 focus:bg-white'}`}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="e.g. John Doe"
                    onChange={() => setErrors(prev => ({ ...prev, name: '' }))}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] font-bold text-rose-500 ml-4 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 mt-1">
                    <BiErrorCircle size={12} />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email & Mobile Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 block" htmlFor="email">
                    College Email
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <BiEnvelope size={18} />
                    </div>
                    <input
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-sm text-gray-900 transition-all placeholder:font-medium ${errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-transparent focus:border-blue-600 focus:bg-white'}`}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="name@edu.in"
                      onChange={() => setErrors(prev => ({ ...prev, email: '' }))}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[10px] font-bold text-rose-500 ml-4 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 mt-1">
                      <BiErrorCircle size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 block" htmlFor="mobile">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                      <BiPhone size={18} />
                    </div>
                    <input
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-sm text-gray-900 transition-all placeholder:font-medium ${errors.mobile ? 'border-rose-500 bg-rose-50/30' : 'border-transparent focus:border-blue-600 focus:bg-white'}`}
                      type="tel"
                      name="mobile"
                      id="mobile"
                      placeholder="+91..."
                      onChange={() => setErrors(prev => ({ ...prev, mobile: '' }))}
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-[10px] font-bold text-rose-500 ml-4 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 mt-1">
                      <BiErrorCircle size={12} />
                      {errors.mobile}
                    </p>
                  )}
                </div>
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

              <div className="px-2">
                 <p className="text-[10px] font-medium text-gray-400 leading-relaxed uppercase tracking-wider">
                   By creating an account, you agree to our <span className="text-blue-600 cursor-pointer">Terms of Service</span> and <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
                 </p>
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
                    <span>Create Profile</span>
                    <BiUserPlus size={24} className="text-blue-400" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-black hover:text-blue-700 transition-colors">
                  Login Instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

