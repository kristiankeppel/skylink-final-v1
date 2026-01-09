import React, { useState, useEffect } from 'react';
import { 
  Calendar, LayoutDashboard, Users, ArrowLeftRight, Settings, 
  ShieldCheck, Clock, Plane, ChevronRight, Search, Plus, 
  Bell, CheckCircle2, AlertTriangle, LogIn, LogOut, Info
} from 'lucide-react';

// Firebase Imports
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, onSnapshot, setDoc, 
  updateDoc, addDoc, query
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut 
} from 'firebase/auth';

// --- Firebase Configuration ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'skylink-airline-demo';

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('pilot');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trips, setTrips] = useState([]);
  const [adminConfig, setAdminConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Authentication (Rule 3)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Authentication failed:", err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Data Sync (Rule 1 & 2)
  useEffect(() => {
    if (!user) return;

    // Listen to Public Trade Board
    const tripsRef = collection(db, 'artifacts', appId, 'public', 'data', 'trips');
    const unsubscribeTrips = onSnapshot(tripsRef, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in memory (Rule 2)
      setTrips(tripsData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    }, (err) => console.error("Trips sync error:", err));

    // Listen to Global Airline Configuration
    const configDoc = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'global');
    const unsubscribeConfig = onSnapshot(configDoc, (snapshot) => {
      if (snapshot.exists()) {
        setAdminConfig(snapshot.data());
      } else {
        // Init default parameters if none exist
        const defaultConfig = {
          maxDutyDay: 14,
          minRestPeriod: 10,
          maxFlightTimeMonth: 100,
          biddingOpen: true,
          airlineName: "Global Airways"
        };
        setDoc(configDoc, defaultConfig);
      }
    }, (err) => console.error("Config sync error:", err));

    return () => {
      unsubscribeTrips();
      unsubscribeConfig();
    };
  }, [user]);

  // --- Actions ---

  const postTripToBoard = async () => {
    if (!user) return;
    const newTrip = {
      dep: 'JFK',
      arr: 'LHR',
      start: '2024-06-20 20:00',
      end: '2024-06-21 08:30',
      credit: '8:30',
      status: 'Open',
      postedBy: user.uid,
      posterName: `Pilot ${user.uid.slice(0, 5)}`,
      createdAt: Date.now()
    };
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'trips'), newTrip);
    } catch (err) {
      console.error("Could not post trip:", err);
    }
  };

  const updateConfig = async (key, val) => {
    if (!user) return;
    const configDoc = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'global');
    await updateDoc(configDoc, { [key]: val });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <Plane className="animate-spin text-blue-400 mb-4" size={40} />
      <p className="font-bold tracking-widest animate-pulse uppercase">Establishing Secure Uplink...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 h-screen text-white flex flex-col p-6 fixed left-0 top-0 shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Plane className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter">SkyLink</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'My Roster' },
            { id: 'swaps', icon: ArrowLeftRight, label: 'Trade Board' },
            { id: 'admin', icon: Settings, label: 'Admin Panel' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 p-3 w-full rounded-xl transition-all font-bold text-sm ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <item.icon size={18}/>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-2xl mb-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Authenticated ID</p>
            <p className="text-xs font-mono text-blue-400 truncate">{user?.uid}</p>
          </div>
          <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-slate-500 hover:text-white text-sm font-bold">
            <LogOut size={16}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? 'Flight Deck' : activeTab === 'swaps' ? 'Trade Board' : 'Operations'}
            </h1>
            <p className="text-slate-500 font-medium">
              {adminConfig?.airlineName || 'Syncing Airline...'} Operations Portal
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="h-2.5 w-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Syncing</span>
            </div>
          </div>
        </header>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="p-3 bg-blue-50 w-fit rounded-2xl text-blue-600 mb-4"><Clock size={24}/></div>
                <h3 className="text-slate-400 text-xs font-black uppercase mb-1">Monthly Credit</h3>
                <p className="text-4xl font-black text-slate-900">74:15</p>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{width: '74%'}} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="p-3 bg-orange-50 w-fit rounded-2xl text-orange-600 mb-4"><ShieldCheck size={24}/></div>
                <h3 className="text-slate-400 text-xs font-black uppercase mb-1">Legal Rest</h3>
                <p className="text-4xl font-black text-slate-900">{adminConfig?.minRestPeriod}h</p>
                <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-tighter">Current Requirement</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="p-3 bg-purple-50 w-fit rounded-2xl text-purple-600 mb-4"><Bell size={24}/></div>
                <h3 className="text-slate-400 text-xs font-black uppercase mb-1">Trade Notifications</h3>
                <p className="text-4xl font-black text-slate-900">3</p>
                <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-tighter">Pending Action</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black">Upcoming Duty Roster</h2>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">JUNE 2024</span>
              </div>
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem]">
                <div className="bg-slate-50 p-6 rounded-full mb-4"><Calendar className="text-slate-300" size={40}/></div>
                <p className="font-black text-slate-800 text-lg">No Active Roster Synced</p>
                <p className="text-slate-400 text-sm max-w-xs text-center mt-2">Your schedule will appear here once connected to the Airline CMS.</p>
              </div>
            </div>
          </div>
        )}

        {/* Trade Board Tab */}
        {activeTab === 'swaps' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
              <div>
                <h2 className="text-2xl font-black">Trade Board</h2>
                <p className="text-slate-400 text-sm">Post trips to the collective pilot pot for swapping.</p>
              </div>
              <button 
                onClick={postTripToBoard}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-600/40 flex items-center gap-2 transition-all active:scale-95"
              >
                <Plus size={20}/> Post New Trip
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {trips.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[2rem] border border-slate-100">
                  <Info className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-bold italic">No active trades on the board. Be the first to post!</p>
                </div>
              ) : (
                trips.map(trip => (
                  <div key={trip.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <Plane size={32} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-2xl font-black text-slate-900">{trip.dep}</span>
                          <ChevronRight size={18} className="text-slate-300"/>
                          <span className="text-2xl font-black text-slate-900">{trip.arr}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{trip.start}</p>
                          <span className="h-1 w-1 bg-slate-200 rounded-full" />
                          <p className="text-xs font-bold text-blue-600 uppercase tracking-tighter">Posted by {trip.posterName}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credit</p>
                        <p className="text-xl font-mono font-black text-slate-800">{trip.credit}</p>
                      </div>
                      <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 rounded-xl font-black transition-colors">
                        Request
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Admin Tab */}
        {activeTab === 'admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white"><Settings size={20}/></div>
                Global Duty Parameters
              </h3>
              
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Max Duty Period</label>
                    <span className="text-3xl font-black text-blue-600">{adminConfig?.maxDutyDay || 14}h</span>
                  </div>
                  <input 
                    type="range" min="8" max="16" 
                    value={adminConfig?.maxDutyDay || 14} 
                    onChange={(e) => updateConfig('maxDutyDay', parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="mt-4 text-xs text-slate-400 font-medium leading-relaxed">
                    Adjusting this parameter immediately enforces the limit for all pilot schedule validation and swap eligibility.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Min Legal Rest</label>
                    <span className="text-3xl font-black text-blue-600">{adminConfig?.minRestPeriod || 10}h</span>
                  </div>
                  <input 
                    type="range" min="8" max="14" 
                    value={adminConfig?.minRestPeriod || 10} 
                    onChange={(e) => updateConfig('minRestPeriod', parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-4">Bidding Status</h3>
                  <div className="flex items-center gap-4 p-5 bg-slate-800 rounded-3xl border border-slate-700">
                    <div className="h-4 w-4 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
                    <span className="font-black text-sm uppercase tracking-widest text-slate-200">Bidding is Active</span>
                  </div>
                  <button className="mt-8 w-full py-4 bg-blue-600 rounded-2xl font-black hover:bg-blue-500 transition-colors">
                    Close Bidding Period
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-10">
                  <Calendar size={200} />
                </div>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">System Alerts</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl text-orange-700 border border-orange-100">
                    <AlertTriangle size={18}/>
                    <p className="text-xs font-bold">3 Crew members approaching 7-day duty limit.</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-blue-700 border border-blue-100">
                    <CheckCircle2 size={18}/>
                    <p className="text-xs font-bold">All JFK → LHR sectors for June are staffed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
