import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../app/firebase/firebase";
import { toast } from "react-toastify";
import { BiMessageSquareDetail } from "react-icons/bi";

function ContactSellerBtn({ product, className = "", label }) {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleContactSeller = async (e) => {
    // Basic mapping for study materials vs products
    const ownerId = product.sellerId || product.uploaderId;
    const ownerName = product.sellerName || product.uploaderName;
    const itemName = product.name || product.title;
    const itemPrice = product.price || 0;

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      toast.info("Please login to contact the owner", { position: "bottom-center" });
      navigate("/login");
      return;
    }

    if (user.uid === ownerId) {
      toast.info("This is your own listing!", { position: "bottom-center" });
      return;
    }

    try {
      const loadingToast = toast.loading("Starting conversation...", { position: "bottom-center" });

      const ownerDocRef = doc(db, "users", ownerId);
      const ownerDoc = await getDoc(ownerDocRef);
      const ownerData = ownerDoc.exists() ? ownerDoc.data() : {};

      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("participants", "array-contains", user.uid));
      const querySnapshot = await getDocs(q);
      
      let existingChatId = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(ownerId)) {
          existingChatId = doc.id;
        }
      });

      if (!existingChatId) {
        const newChat = {
          participants: [user.uid, ownerId],
          participantDetails: {
            [user.uid]: { 
              name: user.displayName || user.name || "User",
              email: user.email || "",
              mobile: user.mobile || "" 
            },
            [ownerId]: { 
              name: ownerData.name || ownerName || "Owner",
              email: ownerData.email || product.sellerEmail || product.uploaderEmail || "",
              mobile: ownerData.mobile || ""
            }
          },
          isPublicContact: ownerData.isPublicContact || false,
          updatedAt: serverTimestamp(),
          lastMessage: `Interested in: ${itemName}`,
          lastMessageBy: user.uid,
          unreadBy: [ownerId]
        };
        const docRef = await addDoc(chatsRef, newChat);
        existingChatId = docRef.id;

        const messagesRef = collection(db, "chats", existingChatId, "messages");
        await addDoc(messagesRef, {
            text: `Hi! I'm interested in your resource: "${itemName}". Is it still available?`,
            senderId: user.uid,
            createdAt: serverTimestamp(),
        });
      }

      toast.dismiss(loadingToast);
      navigate(`/messages?chatId=${existingChatId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Could not start conversation", { position: "bottom-center" });
    }
  };

  return (
    <button
      onClick={handleContactSeller}
      className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all active:scale-95 ${className}`}
    >
      <BiMessageSquareDetail size={20} />
      <span>{label || "Contact Seller"}</span>
    </button>
  );
}

export default ContactSellerBtn;
