import { BiShieldQuarter, BiGroup, BiRefresh } from "react-icons/bi";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 py-10 px-5 md:py-16 md:px-12 mb-8 shadow-xl">
      {/* Abstract Background Shapes */}
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-3/5 text-center md:text-left">
          <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Campus Marketplace
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight mb-4 md:mb-6">
            Everything you need for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">Campus Life.</span>
          </h1>
          <p className="text-blue-100 text-base md:text-xl opacity-90 max-w-xl mb-8 md:mb-10 leading-relaxed font-medium">
            Join thousands of students buying, selling, and exchanging pre-loved books, tech, and hostel essentials within our community.
          </p>
          
          <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
            <Link 
              to="/categories/all" 
              className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Start Shopping
            </Link>
            <Link 
              to="/sell" 
              className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-full border border-blue-400/30 shadow-lg hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all"
            >
              Sell an Item
            </Link>
          </div>

          <div className="mt-8 md:mt-12 flex flex-wrap justify-center md:justify-start gap-5 border-t border-white/10 pt-6 md:pt-8">
            <div className="flex items-center gap-3 text-blue-100">
              <BiShieldQuarter size={24} />
              <div className="text-left">
                <p className="text-white font-bold leading-none">Safe Trade</p>
                <p className="text-[11px] opacity-70">Verified Students</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <BiGroup size={24} />
              <div className="text-left">
                <p className="text-white font-bold leading-none">10k+ Active</p>
                <p className="text-[11px] opacity-70">Peer Community</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-blue-100">
              <BiRefresh size={24} />
              <div className="text-left">
                <p className="text-white font-bold leading-none">Quick Swap</p>
                <p className="text-[11px] opacity-70">Exchanges Welcomed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-2/5 relative animate-in zoom-in duration-700">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
             {/* Simulating a dynamic card */}
             <div className="bg-white rounded-2xl overflow-hidden mb-4">
                <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="Featured" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
             </div>
             <div className="flex justify-between items-end">
                <div>
                   <p className="text-blue-100 text-xs font-bold uppercase mb-1">Trending Item</p>
                   <h3 className="text-white text-xl font-bold">Scientific Calculator</h3>
                </div>
                <div className="text-white font-black text-2xl">₹950</div>
             </div>
             <div className="mt-4 flex gap-2">
                <div className="h-2 flex-grow bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-400 w-3/4 animate-pulse"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;

