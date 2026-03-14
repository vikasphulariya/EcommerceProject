import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <div className=" px-2 min-[320px]:px-2 min-[450px]:px-5 sm:px-7 md:px-10 lg:px-14 bg-white sticky top-0 z-50 shadow-sm">
        <Header />
      </div>
      <div className="authCuntainer flex flex-grow w-full justify-center bg-[#f8f9fc] relative overflow-hidden">
        {/* Subtle background decoration for auth pages */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-60"></div>
        </div>
        <div className="relative z-10 w-full flex justify-center">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AuthLayout;

