import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

function PageLayout({ children }) {
  const location = useLocation();
  const isMessagesPage = location.pathname === "/messages";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow  relative px-2 min-[320px]:px-2 min-[450px]:px-5 sm:px-7 md:px-10 lg:px-14">
        <Header />
        <Outlet/>
        {children}
      </div>
      {!isMessagesPage && <Footer />}
    </div>
  );
}

export default PageLayout;
