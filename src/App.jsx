import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plane, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  CreditCard,
  Menu,
  X,
  Phone,
  Globe,
  AlertCircle
} from 'lucide-react';

// --- Error Boundary Component ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("App Crash:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-600 mb-6">The application encountered an unexpected error. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Main Application Component ---
const App = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const destinations = [
    { id: 1, city: 'Santorini', country: 'Greece', price: 499, img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=800' },
    { id: 2, city: 'Kyoto', country: 'Japan', price: 820, img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800' },
    { id: 3, city: 'Maldives', country: 'South Asia', price: 1200, img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Plane className="text-white w-6 h-6" />
            </div>
            <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-blue-900' : 'text-white'}`}>
              SkyLink
            </span>
          </div>

          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center gap-8 font-medium ${scrolled ? 'text-slate-600' : 'text-white/90'}`}>
            <a href="#" className="hover:text-blue-500 transition-colors">Book</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Check-in</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Manage</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Status</a>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Sign In
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className={scrolled ? 'text-slate-900' : 'text-white'} /> : <Menu className={scrolled ? 'text-slate-900' : 'text-white'} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-4 flex flex-col gap-4 md:hidden">
            <a href="#" className="p-2 font-medium text-slate-700">Book</a>
            <a href="#" className="p-2 font-medium text-slate-700">Check-in</a>
            <a href="#" className="p-2 font-medium text-slate-700">Manage</a>
            <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Sign In</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover scale-105"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Higher standards,<br />
            <span className="text-blue-400">further horizons.</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-xl">
            Experience the pinnacle of air travel with SkyLink. Premium service, 
            global connectivity, and memories that last a lifetime.
          </p>

          {/* Booking Widget */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-slate-800 max-w-4xl animate-in zoom-in-95 duration-700 delay-200">
            <div className="flex gap-4 mb-6 border-b border-slate-100 pb-4">
              <button 
                onClick={() => setActiveTab('flights')}
                className={`flex items-center gap-2 font-semibold pb-2 border-b-2 transition-all ${activeTab === 'flights' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <Plane size={18} /> Flights
              </button>
              <button 
                onClick={() => setActiveTab('hotels')}
                className={`flex items-center gap-2 font-semibold pb-2 border-b-2 transition-all ${activeTab === 'hotels' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                <MapPin size={18} /> Hotels
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">From</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                  <MapPin size={18} className="text-blue-600" />
                  <input type="text" placeholder="Origin City" className="bg-transparent outline-none w-full text-sm font-medium" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">To</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                  <MapPin size={18} className="text-blue-600" />
                  <input type="text" placeholder="Destination" className="bg-transparent outline-none w-full text-sm font-medium" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Depart</label>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                  <Calendar size={18} className="text-blue-600" />
                  <input type="date" className="bg-transparent outline-none w-full text-sm font-medium" />
                </div>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30">
                  <Search size={18} /> Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Explore the World</h2>
            <p className="text-slate-500">Curated destinations for your next escape</p>
          </div>
          <button className="hidden md:flex items-center gap-1 text-blue-600 font-bold hover:gap-2 transition-all">
            View All <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <div key={dest.id} className="group cursor-pointer">
              <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                <img 
                  src={dest.img} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={dest.city}
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-bold text-sm shadow-sm">
                  From ${dest.price}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{dest.city}</h3>
              <p className="text-slate-500">{dest.country}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <ShieldCheck className="text-blue-600 w-8 h-8" />
            </div>
            <h4 className="font-bold mb-2">Safe & Secure</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Top-tier safety protocols for your peace of mind.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <Clock className="text-green-600 w-8 h-8" />
            </div>
            <h4 className="font-bold mb-2">Punctuality First</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Voted #1 for on-time arrivals in the industry.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="bg-purple-50 p-4 rounded-full mb-4">
              <Users className="text-purple-600 w-8 h-8" />
            </div>
            <h4 className="font-bold mb-2">Priority Boarding</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Save time and fly relaxed with our elite services.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="bg-orange-50 p-4 rounded-full mb-4">
              <CreditCard className="text-orange-600 w-8 h-8" />
            </div>
            <h4 className="font-bold mb-2">Flexi-Pay</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Book now, pay later with easy installment options.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Plane className="text-blue-400 w-8 h-8" />
              <span className="text-2xl font-bold tracking-tight">SkyLink</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Redefining air travel for the modern explorer. Fly beyond your expectations with world-class hospitality.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 text-lg">Support</h5>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Refund Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Bag Allowance</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Travel Advisory</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-lg">Company</h5>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Our Fleet</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-lg">Contact</h5>
            <div className="space-y-4 text-slate-400 text-sm">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-blue-400" />
                <span>+1 (800) SKY-LINK</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-blue-400" />
                <span>support@skylink.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} SkyLink Airways. All rights reserved. Privacy | Terms | Cookies
        </div>
      </footer>
    </div>
  );
};

// Root Export with Error Boundary Guard
export default function SafeApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
