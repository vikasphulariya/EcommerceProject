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
    setTimeout(() => {
      if (user && user.emailVerified) {
        navigate("/", { replace: true });
      } else {
        setLoading(false);
      }
    }, 300);
  }, [user]);

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

