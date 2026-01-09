import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Menu,
  X,
  Phone,
  Globe,
  AlertCircle,
  Bell,
  User,
  Ticket
} from 'lucide-react';

/**
 * ERROR BOUNDARY
 * Prevents "Blank White Screen" by catching JS errors during render.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Application Error</h1>
          <p className="text-slate-600 mb-6 max-w-md">The application failed to render. This is often due to a configuration error or a missing dependency in the environment.</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all">
            Reload Application
          </button>
          <pre className="mt-8 p-4 bg-slate-200 rounded text-xs text-left overflow-auto max-w-full">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchType, setSearchType] = useState('round-trip');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* --- HEADER --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Plane className="text-white w-6 h-6 rotate-45" />
            </div>
            <span className={`text-2xl font-black tracking-tighter ${isScrolled ? 'text-blue-900' : 'text-white'}`}>
              SKYLINK
            </span>
          </div>

          {/* Desktop Nav */}
          <div className={`hidden lg:flex items-center gap-8 font-semibold text-sm tracking-wide ${isScrolled ? 'text-slate-600' : 'text-white/90'}`}>
            <a href="#" className="hover:text-blue-500 transition-colors">BOOK</a>
            <a href="#" className="hover:text-blue-500 transition-colors">MANAGE</a>
            <a href="#" className="hover:text-blue-500 transition-colors">CHECK-IN</a>
            <a href="#" className="hover:text-blue-500 transition-colors">FLIGHT STATUS</a>
          </div>

          <div className="flex items-center gap-4">
            <button className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>
              <Search size={20} />
            </button>
            <button className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${isScrolled ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-blue-900'}`}>
              <User size={18} /> SIGN IN
            </button>
            <button className="lg:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className={isScrolled ? 'text-slate-900' : 'text-white'} /> : <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative h-[85vh] min-h-[600px] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover"
            alt="SkyLink Wings"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest uppercase">Global Network Now Open</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-none mb-6">
              SKY IS NOT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">THE LIMIT.</span>
            </h1>
            <p className="text-lg text-blue-100/80 mb-10 max-w-lg leading-relaxed">
              Experience the new standard of premium travel. With over 150 destinations worldwide, we bring the world closer to you.
            </p>
            
            {/* Quick Search Widget */}
            <div className="bg-white rounded-3xl p-2 shadow-2xl flex flex-col md:flex-row items-stretch gap-2 max-w-3xl">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-slate-100">
                <MapPin className="text-blue-600" size={20} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Departure</span>
                  <input type="text" placeholder="Where from?" className="text-slate-900 font-bold outline-none bg-transparent placeholder:text-slate-300" />
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 py-3 border-r border-slate-100">
                <div className="bg-slate-100 p-1.5 rounded-full absolute -ml-6 hidden md:block border-4 border-white">
                  <Plane size={14} className="text-blue-600" />
                </div>
                <MapPin className="text-blue-600" size={20} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Arrival</span>
                  <input type="text" placeholder="Where to?" className="text-slate-900 font-bold outline-none bg-transparent placeholder:text-slate-300" />
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2">
                SEARCH <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- STATS / FEATURES --- */}
      <div className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Clock />, title: "Real-time Tracking", desc: "Monitor your flight status with second-by-second updates." },
            { icon: <ShieldCheck />, title: "Secure Booking", desc: "Enterprise-grade encryption for all your travel transactions." },
            { icon: <Ticket />, title: "Easy Reschedule", desc: "Life happens. Change your plans with zero hassle via our app." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 group hover:-translate-y-2 transition-all duration-300">
              <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- DESTINATIONS --- */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-blue-600 font-bold text-sm tracking-[0.2em] uppercase">Featured</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">TRENDING DESTINATIONS</h2>
          </div>
          <button className="text-slate-400 hover:text-blue-600 font-bold text-sm flex items-center gap-2 transition-colors">
            EXPLORE ALL <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { city: "Tokyo", price: "840", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop" },
            { city: "Paris", price: "520", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop" },
            { city: "New York", price: "410", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop" },
            { city: "Dubai", price: "730", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" }
          ].map((dest, i) => (
            <div key={i} className="relative h-96 rounded-[2.5rem] overflow-hidden group cursor-pointer">
              <img src={dest.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={dest.city} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="text-blue-400 font-bold text-xs tracking-widest uppercase">Starting From</span>
                <div className="flex justify-between items-end">
                  <h3 className="text-white text-2xl font-black">{dest.city}</h3>
                  <span className="text-white font-bold text-xl">${dest.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-400 py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
               <div className="flex items-center gap-2 mb-6">
                <Plane className="text-blue-500 w-6 h-6 rotate-45" />
                <span className="text-white text-xl font-black tracking-tighter">SKYLINK</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Providing world-class aviation services since 1998. Your safety and comfort are our highest priorities.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                  <Globe size={18} />
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
                  <Phone size={18} />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">SERVICES</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Cargo Services</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Charters</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Fleet Details</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">In-flight Dining</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">ABOUT</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Our History</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Newsroom</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Sustainability</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Careers</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">NEWSLETTER</h4>
              <p className="text-sm mb-4">Get the latest flight deals directly to your inbox.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-slate-800 border-none rounded-xl px-4 py-2 w-full text-white text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                <button className="bg-blue-600 text-white p-2 rounded-xl">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold tracking-widest uppercase">
            <span>© 2024 SKYLINK AIRWAYS GLOBAL</span>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
