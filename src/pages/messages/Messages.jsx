import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../../app/firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  updateDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import { BiEnvelope, BiPhone, BiLogoWhatsapp, BiTrash, BiArrowBack, BiSend } from "react-icons/bi";

export default function Messages() {
  const user = useSelector((state) => state.user.user);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [otherUserData, setOtherUserData] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Fetch chats list
  useEffect(() => {
    if (!user) return;

    // Check if the user is part of the chat
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort by updatedAt descending locally since complicated composite indexes might be required if ordering directly in query
      chatData.sort((a, b) => {
        const timeA = a.updatedAt ? a.updatedAt.toMillis() : 0;
        const timeB = b.updatedAt ? b.updatedAt.toMillis() : 0;
        return timeB - timeA;
      });
      setChats(chatData);
      setLoadingChats(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle URL chatId selection
  useEffect(() => {
    if (!loadingChats && chats.length > 0) {
      const chatId = searchParams.get("chatId");
      if (chatId) {
        const chatToSelect = chats.find(c => c.id === chatId);
        if (chatToSelect) {
          setActiveChat(chatToSelect);
        }
      }
    }
  }, [loadingChats, chats, searchParams]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const messagesRef = collection(db, `chats/${activeChat.id}/messages`);
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgData);
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsubscribe();
  }, [activeChat]);

  // Fetch true real-time data of the other participant (privacy, etc)
  useEffect(() => {
    if (!activeChat || !user) {
      setOtherUserData(null);
      return;
    }

    const otherUid = activeChat.participants.find((uid) => uid !== user.uid);
    if (!otherUid) return;

    const unsubscribe = onSnapshot(doc(db, "users", otherUid), (snapshot) => {
      if (snapshot.exists()) {
        setOtherUserData({ ...snapshot.data(), uid: otherUid });
      }
    });

    return () => unsubscribe();
  }, [activeChat, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const text = newMessage;
    setNewMessage(""); // Clear input optimistically

    try {
      await addDoc(collection(db, `chats/${activeChat.id}/messages`), {
        text,
        senderId: user.uid,
        senderName: user.name,
        createdAt: serverTimestamp(),
      });

      // Update the chat's updatedAt field
      await updateDoc(doc(db, "chats", activeChat.id), {
        updatedAt: serverTimestamp(),
        lastMessage: text,
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!activeChat) return;
    try {
      await deleteDoc(doc(db, `chats/${activeChat.id}/messages`, messageId));
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  const getOtherParticipant = (chat) => {
    if (chat.participantDetails) {
      const otherUid = chat.participants.find((uid) => uid !== user.uid);
      return {
        ...chat.participantDetails[otherUid],
        uid: otherUid
      };
    }
    return { name: "Campus User" };
  };

  const otherParticipant = activeChat ? getOtherParticipant(activeChat) : null;

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-gray-200 h-full overflow-hidden relative">
        {/* Left Column: Chat List */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex-col bg-gray-50/50 h-full shrink-0 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-6 h-[72px] border-b border-gray-200 bg-white flex items-center shadow-sm shrink-0">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Messages</h2>
          </div>

          <div className="overflow-y-auto flex-grow no-scrollbar">
            {loadingChats ? (
              <div className="flex justify-center p-8">
                <ClipLoader color="#2563EB" />
              </div>
            ) : chats.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium">
                No messages yet.
              </div>
            ) : (
              chats.map((chat) => {
                const other = getOtherParticipant(chat);
                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-white flex items-center gap-3 ${
                      activeChat?.id === chat.id
                        ? "bg-white border-l-4 border-l-blue-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                        : "border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-sm border border-blue-50">
                      {other.name?.[0] || "?"}
                    </div>
                    <div className="flex-grow min-w-0 overflow-hidden">
                      <h3 className="font-bold text-gray-900 truncate">
                        {other.name}
                      </h3>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Chat */}
        <div className={`w-full md:w-2/3 lg:w-3/4 flex-col bg-[#F0F2F5] h-full ${activeChat ? 'flex' : 'hidden md:flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="px-4 md:px-6 py-2.5 md:py-0 md:h-[72px] border-b border-gray-200 flex items-center justify-between gap-2 bg-white shadow-sm shrink-0">
                <div className="flex items-center gap-2 md:gap-3 flex-grow min-w-0">
                  <button 
                    onClick={() => setActiveChat(null)} 
                    className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                  >
                    <BiArrowBack className="text-xl" />
                  </button>
                  <button
                    type="button"
                    onClick={() => otherUserData?.uid && navigate(`/user/${otherUserData.uid}`)}
                    className="flex items-center gap-2 md:gap-3 text-left overflow-hidden w-full group/btn"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold border border-blue-50 shrink-0">
                      {otherUserData?.name?.[0] || otherParticipant.name?.[0] || "?"}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h2 className="text-base md:text-lg font-bold text-gray-900 leading-tight truncate group-hover/btn:text-blue-600 transition-colors">
                        {otherUserData?.name || otherParticipant.name}
                      </h2>
                      {otherUserData?.isPublicContact && (
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] md:text-xs text-blue-600 font-medium truncate max-w-[80px] md:max-w-[150px]">{otherUserData.email}</p>
                          <p className="text-[10px] md:text-xs text-gray-500 font-medium truncate">{otherUserData.mobile}</p>
                        </div>
                      )}
                    </div>
                  </button>
                </div>

                {otherUserData?.isPublicContact && (
                  <div className="flex items-center gap-1 md:gap-3 shrink-0">
                    <a 
                      href={`mailto:${otherUserData.email}`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                      title="Send Email"
                    >
                      <BiEnvelope size={20} className="md:w-6 md:h-6" />
                    </a>
                    <a 
                      href={`tel:${otherUserData.mobile}`}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
                      title="Call Now"
                    >
                      <BiPhone size={20} className="md:w-6 md:h-6" />
                    </a>
                    <a 
                      href={`https://wa.me/${otherUserData.mobile.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-full transition-all"
                      title="Chat on WhatsApp"
                    >
                      <BiLogoWhatsapp size={22} className="md:w-[26px] md:h-[26px]" />
                    </a>
                  </div>
                )}
              </div>

              {/* Chat Messages */}
              <div
                ref={scrollContainerRef}
                className="flex-grow overflow-y-auto p-4 md:p-6 flex flex-col gap-3 scroll-smooth"
                style={{
                  backgroundImage:
                    "url('https://www.transparenttextures.com/patterns/cubes.png')",
                }}
              >
                {messages.length === 0 ? (
                  <div className="flex-grow flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl text-gray-500 text-sm font-semibold shadow-sm border border-gray-100 flex flex-col items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Start the conversation!
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === user.uid;
                    const msgDate = msg.createdAt?.toDate();
                    const showDateHeader = index === 0 || (messages[index-1].createdAt?.toDate() && msgDate && messages[index-1].createdAt.toDate().toDateString() !== msgDate.toDateString());
                    
                    return (
                      <React.Fragment key={msg.id}>
                        {showDateHeader && msgDate && (
                          <div className="flex justify-center my-4">
                            <span className="bg-gray-200/50 backdrop-blur-sm text-gray-600 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/50 shadow-sm">
                              {msgDate.toDateString() === new Date().toDateString() ? "Today" : 
                               msgDate.toDateString() === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" : 
                               msgDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${isMe ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-2 duration-300`}
                        >
                          <div
                            className={`max-w-[75%] md:max-w-[60%] px-4 py-2.5 shadow-sm text-sm md:text-base relative ${
                              isMe
                                ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                                : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                            }`}
                          >
                            <p className="leading-relaxed font-medium whitespace-pre-wrap break-words">{msg.text}</p>
                            <div className="flex items-center justify-end gap-2 mt-1">
                              {isMe && (
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-200 hover:text-white p-0.5"
                                  title="Delete message"
                                >
                                  <BiTrash size={12} />
                                </button>
                              )}
                              <p 
                                className={`text-[10px] font-bold ${
                                  isMe ? "text-blue-200" : "text-gray-400"
                                }`}
                              >
                                {msgDate ? 
                                  msgDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) 
                                  : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 md:p-5 bg-white shrink-0 border-t border-gray-100 flex shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                <form
                  onSubmit={handleSendMessage}
                  className="flex gap-2 md:gap-3 items-end w-full max-w-4xl mx-auto"
                >
                  <div className="flex-grow relative bg-gray-50 border-2 border-transparent focus-within:border-blue-200 focus-within:bg-white rounded-3xl transition-all shadow-inner overflow-hidden flex items-center min-h-[50px] md:min-h-[56px]">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (newMessage.trim() && !loadingChats) {
                               handleSendMessage(e);
                            }
                         }
                      }}
                      placeholder="Type a message..."
                      className="w-full px-5 py-3 md:py-4 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium resize-none max-h-[120px] custom-scrollbar text-sm md:text-base"
                      rows={1}
                      style={{ minHeight: "50px" }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || loadingChats}
                    className="flex-shrink-0 h-[50px] w-[50px] md:h-[56px] md:w-[56px] bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                  >
                    <BiSend size={24} className={`transform transition-transform ${newMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : ""}`} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-blue-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-xl font-medium text-gray-600">Select a conversation</p>
              <p className="text-sm mt-2 text-gray-500">
                Choose someone from the list to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
