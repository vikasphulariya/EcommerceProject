import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import PageLayout from "./pages/PageLayout.jsx";
import NoPage from "./pages/NoPage.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import AuthLayout from "./pages/AuthLayout.jsx";
import SignIn from "./pages/Auth/SignIn.jsx";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserAuthenticated from "./pages/userAuthenticated.jsx";
import { CustomProvider } from "rsuite";
import { useDispatch } from "react-redux";
import { removeUser, setUser } from "./app/store/userSlice.js";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route key={""} path="/" ErrorBoundary={"scsd"} errorElement={<NoPage />} element={<PageLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<Home />} />
    </Route>,
    <Route key="s" path="/" element={<AuthLayout />}>
      <Route
        path="/login"
        element={
          <UserAuthenticated>
            <Login />
          </UserAuthenticated>
        }
      />
      <Route
        path="/register"
        element={
          <UserAuthenticated>
            <SignIn />
          </UserAuthenticated>
        }
      />
    </Route>,
  ])
);
function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataFromLocal();
  }, []);

  const getDataFromLocal = () => {
    const data = localStorage.getItem("User");
    const user = JSON.parse(data);
    if (user && user.emailVerified) {
      dispatch(setUser(user));
    } else {
      dispatch(removeUser());
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="  w-full h-screen grid place-items-center">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  return (
    <>
      <CustomProvider>
        <RouterProvider router={router} />
      </CustomProvider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </>
  );
}

export default App;

