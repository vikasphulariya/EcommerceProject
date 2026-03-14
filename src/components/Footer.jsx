import { BiCopyright, BiLogoFacebookCircle, BiLogoTwitter, BiLogoInstagram, BiLogoLinkedin, BiSend } from "react-icons/bi";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 w-full pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center p-2 shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
              <img src={logo} alt="UniMart Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">UniMart</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            The ultimate campus marketplace for students. Buy, sell, and trade within your community with trust and ease.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
              <BiLogoFacebookCircle size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1">
              <BiLogoTwitter size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all transform hover:-translate-y-1">
              <BiLogoInstagram size={20} />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all transform hover:-translate-y-1">
              <BiLogoLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Marketplace</h4>
          <ul className="flex flex-col gap-4 text-sm font-bold">
            <li><Link to="/categories/all" className="hover:text-blue-500 transition-colors">All Products</Link></li>
            <li><Link to="/deals" className="hover:text-blue-500 transition-colors">Campus Deals</Link></li>
            <li><Link to="/categories" className="hover:text-blue-500 transition-colors">Categories</Link></li>
            <li><Link to="/sell" className="hover:text-blue-500 transition-colors">Start Selling</Link></li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Resources</h4>
          <ul className="flex flex-col gap-4 text-sm font-bold">
            <li><Link to="/how-it-works" className="hover:text-blue-500 transition-colors">How It Works</Link></li>
            <li><Link to="/contact-us" className="hover:text-blue-500 transition-colors">Contact Support</Link></li>
            <li><Link to="/faq" className="hover:text-blue-500 transition-colors">Common Questions</Link></li>
            <li><Link to="/safety" className="hover:text-blue-500 transition-colors">Safety Tips</Link></li>
          </ul>
        </div>

        {/* Newsletter / Contact */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Contact</h4>
          <div className="flex flex-col gap-5">
             <div className="flex items-center gap-3 text-sm font-medium">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-blue-500">
                  <HiOutlineMail size={18} />
                </div>
                <span>support@unimart.edu</span>
             </div>
             <div className="flex items-center gap-3 text-sm font-medium">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-blue-500">
                  <HiOutlinePhone size={18} />
                </div>
                <span>+1 (234) 567-890</span>
             </div>
             
             {/* Simple Email Signup (Visual Only) */}
             <div className="mt-4 relative">
                <input 
                  type="email" 
                  placeholder="Ask us anything..." 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-xs outline-none focus:border-blue-500 transition-colors"
                />
                <button className="absolute right-2 top-1.5 bottom-1.5 px-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors">
                  <BiSend size={16} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-800/50 px-4 py-2 rounded-full">
          <BiCopyright size={14} className="text-blue-500" />
          <span>2024 UniMart Marketplace. Exclusive for verified students.</span>
        </div>
        
        <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-gray-500">
          <Link to="/terms" className="hover:text-blue-500 transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy</Link>
          <button className="hover:text-blue-500 transition-colors">Report Bug</button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
