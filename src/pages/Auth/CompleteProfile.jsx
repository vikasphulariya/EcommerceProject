import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../../app/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

function CompleteProfile() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else if (user.profileCompleted) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const completeProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        college: data.college,
        course: data.course,
        degree: data.degree,
        isPublicContact: data.isPublicContact === "on",
        profileCompleted: true
      });
      toast.success("Profile Completed!");
      // Navigation will handled by useEffect when user.profileCompleted becomes true via onSnapshot
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.profileCompleted) return null;

  return (
    <div className="w-full flex justify-center py-10 px-4 min-h-[70vh] items-center">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md border text-center">
        <h1 className="text-2xl font-bold mb-2 text-blue-800">Complete Your Profile</h1>
        <p className="text-gray-600 mb-6 font-medium">Tell us more about your academics to verify your student status before trading.</p>
        <form onSubmit={completeProfile} className="flex flex-col gap-4 text-left">
          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">College / University</span>
            <input
              className="mt-1 outline-none border rounded border-gray-300 p-2 focus:border-blue-500 bg-gray-50"
              type="text"
              name="college"
              placeholder="e.g. SRM University"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Degree</span>
            <input
              className="mt-1 outline-none border rounded border-gray-300 p-2 focus:border-blue-500 bg-gray-50"
              type="text"
              name="degree"
              placeholder="e.g. B.Tech, B.Sc"
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="font-semibold text-gray-700">Course / Major</span>
            <input
              className="mt-1 outline-none border rounded border-gray-300 p-2 focus:border-blue-500 bg-gray-50"
              type="text"
              name="course"
              placeholder="e.g. Computer Science"
              required
            />
          </label>
          <label className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-lg border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors">
            <input
              type="checkbox"
              name="isPublicContact"
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex flex-col text-sm">
              <span className="font-bold text-blue-900">Make contact details public</span>
              <span className="text-blue-700/70">Buyers will be able to see your email and phone number on your listings.</span>
            </div>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-600 text-white font-semibold rounded p-3 hover:bg-blue-700 transition"
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
