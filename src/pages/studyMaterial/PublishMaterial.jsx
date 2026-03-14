import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { publishMaterial } from "../../app/firebase/materialManager";
import { 
  BiCloudUpload, 
  BiFile, 
  BiCheckCircle, 
  BiChevronLeft, 
  BiLockAlt, 
  BiGlobe, 
  BiInfoCircle,
  BiBookOpen
} from "react-icons/bi";

export default function PublishMaterial() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [visibility, setVisibility] = useState("all"); 
  const [isAnonymous, setIsAnonymous] = useState(false);

  const MATERIAL_TYPES = ["Notes", "Question Paper", "Assignment", "Textbook", "Project", "Other"];
  const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) { // 20MB Limit
         toast.error("File size exceeds 20MB limit");
         return;
      }
      setFile(selectedFile);
      setFilePreview({
         name: selectedFile.name,
         size: (selectedFile.size / 1024 / 1024).toFixed(2) + " MB",
         type: selectedFile.type
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a file to publish.");
      return;
    }

    const formData = new FormData(e.target);
    const materialData = {
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      year: formData.get("year"),
      course: formData.get("course"),
      visibility: visibility,
      isAnonymous: isAnonymous,
      college: user.college, 
    };

    setLoading(true);
    const result = await publishMaterial(materialData, file, user);
    setLoading(false);

    if (result.success) {
      navigate("/study-material");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-gray-900 p-8 md:p-12 text-white relative overflow-hidden">
           <div className="relative z-10">
              <button 
                onClick={() => navigate(-1)}
                className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
              >
                <BiChevronLeft size={20} />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 rotate-3">
                    <BiBookOpen size={32} />
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight">Post Study Resource</h1>
              </div>
              <p className="text-gray-400 font-medium max-w-lg">Help your peers by sharing verified study materials, notes, and previous year's papers.</p>
           </div>
           
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Column: File Upload */}
              <div className="space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-gray-900">Upload Resource</h2>
                 </div>

                 <label className={`group relative w-full aspect-square md:aspect-auto md:h-80 border-4 border-dashed rounded-[2.5rem] transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden ${file ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200 bg-gray-50'}`}>
                    <input type="file" className="hidden" onChange={handleFileChange} />
                    
                    {file ? (
                      <div className="text-center p-8 animate-in zoom-in-95 duration-300">
                         <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                            <BiFile size={40} />
                         </div>
                         <h3 className="text-lg font-black text-gray-900 mb-1 truncate max-w-xs">{filePreview.name}</h3>
                         <p className="text-sm font-bold text-blue-600">{filePreview.size}</p>
                         <div className="mt-6 flex justify-center">
                            <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">File Ready</span>
                         </div>
                      </div>
                    ) : (
                      <div className="text-center p-12 group-hover:scale-105 transition-transform">
                         <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-gray-300 mx-auto mb-6">
                            <BiCloudUpload size={40} />
                         </div>
                         <h3 className="text-lg font-black text-gray-900 mb-2">Drop your file here</h3>
                         <p className="text-xs font-medium text-gray-400 leading-relaxed uppercase tracking-widest">Supports PDF, DOC, PPT, Images <br/> (Max 20MB)</p>
                      </div>
                    )}
                 </label>

                 {/* Visibility Picker */}
                 <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                       <BiLockAlt className="text-blue-600" size={18} />
                       <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Who can see this?</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                         type="button"
                         onClick={() => setVisibility("all")}
                         className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${visibility === 'all' ? 'border-blue-600 bg-white shadow-lg' : 'border-transparent bg-gray-100 hover:bg-white text-gray-400'}`}
                       >
                          <BiGlobe size={24} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Public</span>
                       </button>
                       <button 
                         type="button"
                         onClick={() => setVisibility("college")}
                         className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${visibility === 'college' ? 'border-indigo-600 bg-white shadow-lg' : 'border-transparent bg-gray-100 hover:bg-white text-gray-400'}`}
                       >
                          <div className="relative">
                             <BiGlobe size={24} />
                             <BiLockAlt size={12} className="absolute -bottom-1 -right-1 text-indigo-600 bg-white rounded-full" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-center leading-none">My College <br/> Only</span>
                       </button>
                    </div>
                    <div className="mt-4 flex items-start gap-2 text-[10px] font-bold text-gray-400">
                       <BiInfoCircle size={14} className="shrink-0 text-blue-400" />
                       <p>Visibility is based on your profile's verified college: <span className="text-blue-600 font-black uppercase">{user.college || "Your College"}</span></p>
                    </div>
                 </div>

                 {/* Anonymous Toggle */}
                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center justify-between">
                       <div className="flex flex-col gap-1">
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Post Anonymously</h3>
                          <p className="text-[10px] font-bold text-slate-400 max-w-[180px]">Your name will be hidden from everyone else.</p>
                       </div>
                       
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                          />
                          <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                       </label>
                    </div>
                 </div>
              </div>

              {/* Right Column: Details Form */}
              <div className="space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-gray-900">Resource Details</h2>
                 </div>

                 <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Resource Title</label>
                       <input 
                         name="title" 
                         required 
                         placeholder="e.g. CS101 Lecture Notes - Week 5"
                         className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all placeholder:font-medium"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Type</label>
                          <select name="type" required className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-gray-900 transition-all cursor-pointer">
                             {MATERIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                       </div>
                       <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Year / Semester</label>
                          <select name="year" required className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-gray-900 transition-all cursor-pointer">
                             {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Subject / Course Name</label>
                       <input 
                         name="course" 
                         required 
                         placeholder="e.g. Data Communication"
                         className="w-full py-4 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold text-gray-900 transition-all"
                       />
                    </div>

                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Description (Optional)</label>
                       <textarea 
                         name="description" 
                         rows="5" 
                         placeholder="Briefly describe what's inside the file..."
                         className="w-full py-5 px-6 bg-gray-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[2rem] outline-none font-bold text-gray-900 transition-all resize-none"
                       />
                    </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={loading}
                   className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {loading ? (
                      <ClipLoader size={24} color="#ffffff" />
                    ) : (
                      <>
                        <BiCheckCircle size={24} />
                        <span>Publish Resource</span>
                      </>
                    )}
                 </button>
              </div>

           </div>
        </form>
      </div>
    </div>
  );
}
