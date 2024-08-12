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
import { loadCartFromCloudAsync } from "./app/store/cartSlice.js";
import ProductPage from "./pages/ProductPage/ProductPage.jsx";
import { loadwishlistFromCloudAsync } from "./app/store/wishlistSlice.js";
import Profile from "./pages/profile/Profile.jsx";
import ProtectedPage from "./pages/protectedPage.jsx";
import { auth, db } from "./app/firebase/firebase.js";
import { doc, onSnapshot } from "firebase/firestore";
import Wishlist from "./pages/wishlist/Wishlist.jsx";
import Cart from "./pages/cart/Cart.jsx";
import AboutUs from "./pages/About/AboutUs.jsx";
import CategoryPage from "./pages/categoryPage/CategoryPage.jsx";
import ContactUs from "./pages/contactUs/ContactUs.jsx";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route key={""} path="/" errorElement={<NoPage />} element={<PageLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/product/:productID" element={<ProductPage />} />
      <Route path="/categories/:categoryName" element={<CategoryPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedPage>
            <Profile />
          </ProtectedPage>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedPage>
            <Wishlist />
          </ProtectedPage>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedPage>
            <Cart />
          </ProtectedPage>
        }
      />
      <Route path="/contact-us" element={<ContactUs />} />
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
      <Route path="/about-us" element={<AboutUs />} />
    </Route>,
  ])
);
function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDataFromLocal();
  }, []);

  const getDataFromLocal = async () => {
    auth.onAuthStateChanged(async (user) => {
      // console.log(user.emailVerified);
      if (user && user.emailVerified) {
        await loadUserDataFromCloudAsync(user);
      } else {
        dispatch(removeUser());
      }
      setTimeout(() => {
        setLoading(false);
      }, 100);
    });
  };

  const loadUserDataFromCloudAsync = async (user) => {
    const userDocRef = doc(db, "users", user.uid);
    await onSnapshot(userDocRef, (doc) => {
      console.log(doc.data());
      dispatch(setUser({ ...doc.data(), email: user.email }));
      dispatch(loadCartFromCloudAsync());
      dispatch(loadwishlistFromCloudAsync());
    });
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
        autoClose={1500}
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

