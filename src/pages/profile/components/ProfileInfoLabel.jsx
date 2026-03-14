/* eslint-disable react/prop-types */
import { useState } from "react";
import { BiEditAlt, BiCheck, BiX, BiLoaderAlt } from "react-icons/bi";
import {
  updateEmailOfUser,
  updatePassOfUser,
  updateUserInfo,
} from "../../../app/firebase/userMange";

function ProfileInfoLabel({ title, value, property }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (newValue === value) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    let response;
    if (property === "email") {
      response = await updateEmailOfUser(newValue);
    } else if (property === "password") {
      response = await updatePassOfUser(newValue);
    } else {
      response = await updateUserInfo(property, newValue);
    }
  
    setLoading(false);
    if (response === "true") {
      setIsEditing(false);
    }
  };

  return (
    <div className="relative group p-5 rounded-[2rem] bg-gray-50/50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all min-h-[100px] flex flex-col justify-center">
      {/* Label and Edit Icon */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</h3>
        {!isEditing && (
          <button
            onClick={() => {
                setNewValue(value);
                setIsEditing(true);
            }}
            className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <BiEditAlt size={16} />
          </button>
        )}
      </div>

      {/* Value Display */}
      <div className="relative h-7 flex items-center">
        <p className="text-gray-900 font-black text-lg tracking-tight truncate w-full">
            {value || <span className="text-gray-300 font-normal italic text-sm tracking-normal">Not Provided</span>}
        </p>
      </div>

      {/* Absolute Edit Overlay (Prevents Layout Shift) */}
      {isEditing && (
        <div className="absolute inset-0 bg-white rounded-[2rem] p-3 shadow-xl z-20 flex flex-col gap-2 border-2 border-blue-500 animate-in fade-in zoom-in-95 duration-200">
           <input
              type={property === "password" ? "password" : "text"}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white transition-all font-bold text-gray-900 text-sm"
              placeholder={`Edit ${title}...`}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
                title="Cancel"
              >
                <BiX size={20} />
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-grow flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
              >
                {loading ? <BiLoaderAlt className="animate-spin" size={14} /> : <span>Save</span>}
              </button>
            </div>
        </div>
      )}
    </div>
  );
}

export default ProfileInfoLabel;
