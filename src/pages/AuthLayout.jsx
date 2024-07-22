import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className=" px-2 min-[320px]:px-2 min-[450px]:px-5 sm:px-7 md:px-10 lg:px-14">
        <Header />
      </div>
      <div className="authCuntainer flex flex-grow w-full justify-center">

      <Outlet />
      </div>
      <Footer />
      
    </div>
  );
}

export default AuthLayout;

