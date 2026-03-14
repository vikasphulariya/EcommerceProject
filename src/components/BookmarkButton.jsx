import React from "react";
import { BiBookmark, BiBookmarkMinus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { addBookmarkAsync, removeBookmarkAsync } from "../app/store/bookmarkSlice";
import { toast } from "react-toastify";

function BookmarkButton({ material }) {
  const user = useSelector((state) => state.user.user);
  const isBookmarked = useSelector((state) =>
    state.bookmarks.items.some((item) => item.id === material.id)
  );
  const dispatch = useDispatch();

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info("Please login to bookmark materials");
      return;
    }

    if (isBookmarked) {
      dispatch(removeBookmarkAsync(material.id));
      toast.success("Removed from bookmarks");
    } else {
      dispatch(addBookmarkAsync(material));
      toast.success("Material bookmarked!");
    }
  };

  return (
    <button
      onClick={handleBookmarkClick}
      className={`p-2.5 rounded-xl border transition-all active:scale-90 flex items-center justify-center ${
        isBookmarked 
          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" 
          : "bg-white text-gray-400 border-gray-100 hover:border-blue-200 hover:text-blue-600"
      }`}
      title={isBookmarked ? "Remove Bookmark" : "Save Material"}
    >
      {isBookmarked ? <BiBookmarkMinus size={20} /> : <BiBookmark size={20} />}
    </button>
  );
}

export default BookmarkButton;
