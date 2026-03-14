import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../app/firebase/firebase";
import { toast } from "react-toastify";
import { BiMessageSquareDetail } from "react-icons/bi";

function ContactSellerBtn({ product, className = "" }) {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const handleContactSeller = async (e) => {
    // Prevent navigation if the button is inside a Link/Card
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      toast.info("Please login to contact the seller", { position: "bottom-center" });
      navigate("/login");
      return;
    }

    if (user.uid === product.sellerId) {
      toast.info("This is your own listing!", { position: "bottom-center" });
      return;
    }

    try {
      // Create a toast for loading state
      const loadingToast = toast.loading("Starting conversation...", { position: "bottom-center" });

      const sellerDocRef = doc(db, "users", product.sellerId);
      const sellerDoc = await getDoc(sellerDocRef);
      const sellerData = sellerDoc.exists() ? sellerDoc.data() : {};

      const chatsRef = collection(db, "chats");
      // Check if a chat already exists between these two users
      const q = query(chatsRef, where("participants", "array-contains", user.uid));
      const querySnapshot = await getDocs(q);
      
      let existingChatId = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(product.sellerId)) {
          existingChatId = doc.id;
        }
      });

      if (!existingChatId) {
        const newChat = {
          participants: [user.uid, product.sellerId],
          participantDetails: {
            [user.uid]: { 
              name: user.displayName || user.name || "Buyer",
              email: user.email || "",
              mobile: user.mobile || "" 
            },
            [product.sellerId]: { 
              name: sellerData.name || product.sellerName || "Seller",
              email: sellerData.email || product.sellerEmail || "",
              mobile: sellerData.mobile || ""
            }
          },
          isPublicContact: sellerData.isPublicContact || false,
          updatedAt: serverTimestamp(),
          lastMessage: `Interested in: ${product.name}`,
          lastMessageBy: user.uid,
          unreadBy: [product.sellerId]
        };
        const docRef = await addDoc(chatsRef, newChat);
        existingChatId = docRef.id;

        // Add a first automated message or notification
        const messagesRef = collection(db, "chats", existingChatId, "messages");
        await addDoc(messagesRef, {
            text: `Hi! I'm interested in your listing: "${product.name}" (Price: ₹${product.price}). Is it still available?`,
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
      <span>Contact Seller</span>
    </button>
  );
}

export default ContactSellerBtn;
