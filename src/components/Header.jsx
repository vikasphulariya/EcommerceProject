import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { BiSearch, BiMessageRounded } from "react-icons/bi";
import ProfileBtn from "./ProfileBtn";
import { useState } from "react";
import { CgClose } from "react-icons/cg";
import SearchBtn from "./SearchBtn";
function Header() {
  const [searchActive, setSearchActive] = useState(false);
  return (
    <div>
      <nav>
        <div className="nav-wrapper py-2 flex border-b items-center  justify-between">
          <div className="logo shrink-0">
            <Link
              to="/"
              className="brand-logo flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                <img src={logo} alt="logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tighter hidden sm:block">UniMart</span>
            </Link>
          </div>
          {searchActive ? null : (
            <div className="header-links text-xl hidden md:flex">
              <ul className=" flex gap-10">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-black ${
                      isActive ? "text-blue-600" : ""
                    } hover:text-blue-500 transistion duration-300`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to="/categories/all"
                  className={({ isActive }) =>
                    `text-black ${
                      isActive ? "text-blue-600" : ""
                    } hover:text-blue-500 transition duration-300 font-medium`
                  }
                >
                  Products
                </NavLink>
                <NavLink
                  to="/categories"
                  className={({ isActive }) =>
                    `text-black ${
                      isActive ? "text-blue-600" : ""
                    } hover:text-blue-500 transition duration-300 font-medium`
                  }
                >
                  Categories
                </NavLink>
                <NavLink
                  to="/deals"
                  className={({ isActive }) =>
                    `text-black ${
                      isActive ? "text-blue-600" : ""
                    } hover:text-blue-500 transition duration-300 font-medium`
                  }
                >
                  Campus Deals
                </NavLink>
                <NavLink
                  to="/my-listings"
                  className={({ isActive }) =>
                    `text-black ${
                      isActive ? "text-blue-600" : ""
                    } hover:text-blue-500 transition duration-300 font-medium`
                  }
                >
                  My Listings
                </NavLink>
              </ul>
            </div>
          )}
          <div className="header-btns flex text-2xl gap-4 items-center">
            <div className="flex items-center gap-2">
              <SearchBtn
                setSearchActive={setSearchActive}
                searchActive={searchActive}
              />
              <Link to="/messages" className="text-gray-800 hover:text-blue-600 transition-colors relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100">
                <BiMessageRounded />
              </Link>
              <ProfileBtn />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;

