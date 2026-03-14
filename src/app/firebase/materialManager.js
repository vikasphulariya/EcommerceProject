import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";
import { toast } from "react-toastify";

const uploadFile = async (file, userId) => {
  if (!file) return null;
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const storageRef = ref(storage, `materials/${userId}/${fileName}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { url: downloadURL, name: file.name, type: fileExt };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};

export const publishMaterial = async (materialData, file, user) => {
  try {
    let fileInfo = null;
    if (file) {
      fileInfo = await uploadFile(file, user.uid);
    }

    const data = {
      ...materialData,
      fileUrl: fileInfo?.url || null,
      fileName: fileInfo?.name || null,
      fileType: fileInfo?.type || null,
      uploaderId: user.uid,
      uploaderName: materialData.isAnonymous ? "Anonymous Student" : user.name,
      uploaderEmail: user.email,
      uploaderCollege: user.college,
      isAnonymous: materialData.isAnonymous || false,
      createdAt: serverTimestamp(),
      status: "active",
    };

    const docRef = await addDoc(collection(db, "study_materials"), data);
    toast.success("Material published successfully!");
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error publishing material:", error);
    toast.error("Failed to publish material!");
    return { success: false, error };
  }
};
