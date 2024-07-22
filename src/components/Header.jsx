import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { BiBasket, BiSearch } from "react-icons/bi";
import ProfileBtn from "./ProfileBtn";
import CartBtnHeader from "./CartBtnHeader";
function Header() {
  return (
    <div>
      <nav>
        <div className="nav-wrapper py-2 flex border-b items-center  justify-between">
          <div className="logo">
            <Link
              href="/"
              className="brand-logo flex items-center gap-2 text-xl    w-8 h-8"
            >
              <img src={logo} alt="logo " className=" object-contain" />
              <span className=" text-nowrap">Noobie Store</span>
            </Link>
          </div>
          <div className="header-links text-xl hidden sm:flex">
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
                to="/products"
                className={({ isActive }) =>
                  `text-black ${
                    isActive ? "text-blue-600" : ""
                  } hover:text-blue-500 transistion duration-300`
                }
              >
                Products
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `text-black ${
                    isActive ? "text-blue-600" : ""
                  } hover:text-blue-500 transistion duration-300`
                }
              >
                Contact Us
              </NavLink>
              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  `text-black ${
                    isActive ? "text-blue-600" : ""
                  } hover:text-blue-500 transistion duration-300`
                }
              >
                FAQ
              </NavLink>
            </ul>
          </div>
          <div className="header-btns flex text-2xl gap-3 items-center">
            <button>
              <BiSearch />
            </button>

            <CartBtnHeader />
            <ProfileBtn />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;

