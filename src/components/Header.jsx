import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { BiSearch, BiMessageRounded, BiMenu, BiX } from "react-icons/bi";
import ProfileBtn from "./ProfileBtn";
import { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import SearchBtn from "./SearchBtn";
function Header() {
  const [searchActive, setSearchActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="relative z-50">
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
                  to="/study-material"
                  className={({ isActive }) =>
                    `text-black ${
                      isActive ? "text-blue-600" : ""
                    } hover:text-blue-500 transition duration-300 font-medium`
                  }
                >
                  Study Material
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
              
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2 text-gray-800 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors ml-1"
                onClick={() => setMobileMenuOpen(true)}
              >
                <BiMenu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center p-2 shadow-sm">
                <img src={logo} alt="logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">UniMart</span>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors border border-gray-100"
            >
              <BiX size={28} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <nav className="flex flex-col gap-6 text-2xl font-black tracking-tight text-gray-900">
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? "text-blue-600" : "hover:text-blue-600"}>Home</NavLink>
              <NavLink to="/categories/all" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? "text-blue-600" : "hover:text-blue-600"}>All Products</NavLink>
              <NavLink to="/categories" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? "text-blue-600" : "hover:text-blue-600"}>Categories</NavLink>
              <NavLink to="/deals" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? "text-blue-600" : "hover:text-blue-600"}>Campus Deals</NavLink>
              <NavLink to="/study-material" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? "text-blue-600" : "hover:text-blue-600"}>Study Material</NavLink>
              <div className="w-full h-1 bg-gray-50 rounded-full my-4"></div>
              <NavLink to="/my-listings" onClick={() => setMobileMenuOpen(false)} className={({isActive}) => isActive ? "text-blue-600" : "hover:text-blue-600"}>My Listings</NavLink>
              <NavLink to="/sell" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 mt-4 flex items-center gap-2">
                Start Selling <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md uppercase tracking-wider ml-auto">Free</span>
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

