import { Outlet } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PageLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow px-2 min-[320px]:px-2 min-[450px]:px-5 sm:px-7 md:px-10 lg:px-14">
        <Header />
        <Outlet/>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default PageLayout;
