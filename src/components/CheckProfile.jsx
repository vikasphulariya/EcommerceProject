import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function CheckProfile({ children }) {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  if (user && !user.profileCompleted) {
    if (location.pathname !== "/complete-profile") {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  return children;
}
