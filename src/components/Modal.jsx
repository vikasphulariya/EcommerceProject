import { useEffect } from "react";

function Modal({ children, classNameContainer, onClose, isOpen }) {
  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    });
    return () => {
      document.removeEventListener("keypress");
    };
  }, []);

  return (
    <div className={`${isOpen ? "" : "none"} w-screen h-screen absolute`}>
      <div className="w-full h-full bg-gray-200 bg-opacity-30">
        <div className={` bg-white p-2    ${classNameContainer}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;

