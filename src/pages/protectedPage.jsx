import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuthNeeded from "./AuthNeeded"; // Adjust the path as needed
import { ClipLoader } from "react-spinners";
// import ComponentA from "./ComponentA"; // Adjust the path as needed

function ProtectedPage({ children }) {
  const isLoggedIn = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }, []);
  if (loading)
    return (
      <>
        <div className="  w-full grid place-items-center">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      </>
    );

  return isLoggedIn ? <> {children}</> : <AuthNeeded />;
}

export default ProtectedPage;

