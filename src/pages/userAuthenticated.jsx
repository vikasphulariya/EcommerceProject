import { useEffect, useState } from "react";
import { auth } from "../app/firebase/firebase";
import { useNavigate } from "react-router";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

function UserAuthenticated({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (user && user.emailVerified) {
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 300);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="  w-full grid place-items-center">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  return <>{children}</>;
}

export default UserAuthenticated;

