import React from "react";
import { useSelector } from "react-redux";
import AuthNeeded from "./AuthNeeded"; // Adjust the path as needed
// import ComponentA from "./ComponentA"; // Adjust the path as needed

function ProtectedPage({ children }) {
  const isLoggedIn = useSelector((state) => state.user.user);
  uss

  return isLoggedIn ? <> {children}</> : <AuthNeeded />;
}

export default ProtectedPage;

