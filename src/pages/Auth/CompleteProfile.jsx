import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../app/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { 
  BiUser, 
  BiEnvelope, 
  BiPhone, 
  BiBuildingHouse, 
  BiBookBookmark, 
  BiBriefcaseAlt, 
  BiMapPin,
  BiCheckCircle,
  BiShieldQuarter,
  BiRocket,
  BiErrorCircle
} from "react-icons/bi";

const InputField = ({ label, name, value, onChange, type = "text", icon: Icon, placeholder, disabled = false, error }) => (
  <div className="flex flex-col gap-1.5 w-full group">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 transition-colors group-focus-within:text-blue-600">
      {label}
    </label>
    <div className={`relative flex items-center transition-all ${disabled ? 'opacity-60' : ''}`}>
      <div className="absolute left-6 text-gray-400 group-focus-within:text-blue-600">
        <Icon size={20} />
      </div>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full py-4 pl-14 pr-6 bg-gray-50 border-2 rounded-2xl outline-none font-bold text-gray-900 transition-all ${disabled ? 'cursor-not-allowed' : 'focus:bg-white focus:border-blue-600 focus:shadow-xl focus:shadow-blue-500/5'} ${error ? 'border-rose-500 bg-rose-50/30' : 'border-transparent'}`}
      />
    </div>
    {error && (
      <p className="text-[10px] font-bold text-rose-500 ml-4 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
        <BiErrorCircle size={12} />
        {error}
      </p>
    )}
  </div>
);

function CompleteProfile() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Form State initialized with empty strings to prevent controlled/uncontrolled toggle
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    college: "",
    degree: "",
    course: "",
    isPublicContact: false
  });

  // Effect to sync Redux user data with form state
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.displayName || "",
        mobile: user.mobile || user.phoneNumber || "",
        address: user.address || "",
        college: user.college || "",
        degree: user.degree || "",
        course: user.course || "",
        isPublicContact: !!user.isPublicContact
      });
    }
  }, [user]);

  // Auth Guard
  useEffect(() => {
    if (user === null) { // Explicitly null means logged out
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    
    // Mobile validation: 10 digits
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.address.trim()) newErrors.address = "Address or Hostel details are required";
    if (!formData.college.trim()) newErrors.college = "College name is required";
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.course.trim()) newErrors.course = "Course/Major is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Check Redux first, then Firebase Auth direct
    const currentUid = user?.uid || auth.currentUser?.uid;

    if (!currentUid) {
      toast.error("User session expired. Please refresh the page.");
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, "users", currentUid);
      await setDoc(userDocRef, {
        ...formData,
        profileCompleted: true
      }, { merge: true });
      toast.success("Profile updated! Ready for campus trading.");
      navigate("/");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to save profile: " + (error.message || "Network Error"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ClipLoader size={40} color="#2563EB" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 md:py-24 px-4 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10 opacity-50"></div>

      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-6 mx-auto">
             <BiRocket className="animate-bounce" size={14} />
             <span>Setup Journey</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight mb-4 leading-tight">
            Verify Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">Student Identity</span>
          </h1>
          <p className="text-gray-500 font-bold max-w-xl mx-auto text-lg leading-relaxed">
            Enhance your trading experience by filling out your verified academics.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                   <h2 className="text-xl font-black text-gray-900 tracking-tight">Personal Details</h2>
                </div>
                <div className="space-y-5">
                   <InputField label="Full Name" name="name" value={formData.name} onChange={handleChange} icon={BiUser} placeholder="Full Name" error={errors.name} />
                   <InputField label="Email Address" name="email" value={user.email || ""} onChange={() => {}} icon={BiEnvelope} disabled={true} />
                   <InputField label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} icon={BiPhone} placeholder="10-digit number" error={errors.mobile} />
                   
                   <div className="flex flex-col gap-1.5 w-full group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 transition-colors group-focus-within:text-blue-600">Address / Hostel</label>
                      <div className="relative flex items-center">
                         <div className="absolute left-6 top-5 text-gray-400 group-focus-within:text-blue-600">
                            <BiMapPin size={20} />
                         </div>
                         <textarea 
                           name="address"
                           value={formData.address}
                           onChange={handleChange}
                           rows="3"
                           className={`w-full py-4 pl-14 pr-6 bg-gray-50 border-2 rounded-[2rem] outline-none font-bold text-gray-900 transition-all focus:bg-white focus:border-blue-600 focus:shadow-xl resize-none ${errors.address ? 'border-rose-500 bg-rose-50/30' : 'border-transparent'}`}
                         />
                      </div>
                      {errors.address && (
                        <p className="text-[10px] font-bold text-rose-500 ml-4 flex items-center gap-1">
                          <BiErrorCircle size={12} />
                          {errors.address}
                        </p>
                      )}
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                   <h2 className="text-xl font-black text-gray-900 tracking-tight">Academic Details</h2>
                </div>
                <div className="space-y-5">
                   <InputField label="College / University" name="college" value={formData.college} onChange={handleChange} icon={BiBuildingHouse} error={errors.college} />
                   <InputField label="Degree" name="degree" value={formData.degree} onChange={handleChange} icon={BiBookBookmark} error={errors.degree} />
                   <InputField label="Course / Major" name="course" value={formData.course} onChange={handleChange} icon={BiBriefcaseAlt} error={errors.course} />
                   
                   <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] mt-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                         <BiShieldQuarter className="text-blue-600" size={24} />
                         <h3 className="text-lg font-black text-gray-900 tracking-tight">Privacy</h3>
                      </div>
                      <p className="text-[11px] font-bold text-blue-700/60 leading-relaxed mb-6 uppercase tracking-widest">
                        Enable this to make your phone and email visible to members for direct contact.
                      </p>
                      <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-black text-gray-800">Public Contact?</span>
                        <div className="relative inline-flex items-center">
                           <input type="checkbox" name="isPublicContact" className="sr-only peer" checked={formData.isPublicContact} onChange={handleChange} />
                           <div className="w-14 h-7 bg-blue-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                      </label>
                   </div>
                </div>
             </div>
          </div>

          <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-start gap-4 max-w-md text-left">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                   <BiCheckCircle size={28} />
                </div>
                <p className="text-xs font-bold text-gray-400">Your profile data is encrypted and used only for campus verification.</p>
             </div>
             
             <button
               type="submit"
               disabled={loading}
               className="w-full md:w-auto px-16 py-6 bg-gray-900 text-white font-black rounded-3xl shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
             >
                {loading ? <ClipLoader size={24} color="#ffffff" /> : "Complete Profile"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
