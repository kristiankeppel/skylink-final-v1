import React, { useState } from 'react';
import { 
  Plane, LayoutDashboard, Users, Plus, 
  ArrowRightLeft, Clock, ShieldCheck, ChevronRight 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('pilot');

  const stats = [
    { label: 'Active Trades', value: '24', icon: ArrowRightLeft, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Approval', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Crew Members', value: '142', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Fleet Ready', value: '98%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const trades = [
    { id: 1, pilot: 'Capt. Sarah Jenkins', route: 'LHR → JFK', date: 'Oct 24', status: 'Pending' },
    { id: 2, pilot: 'F.O. Mike Chen', route: 'SIN → DXB', date: 'Oct 25', status: 'Approved' },
  ];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b">
          <div className="bg-blue-600 p-2 rounded-lg"><Plane className="text-white w-6 h-6" /></div>
          <h1 className="text-xl font-bold text-blue-900 uppercase">SkyLink</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20}/> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('trades')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'trades' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ArrowRightLeft size={20}/> Trade Board
          </button>
        </nav>
        <div className="p-4 border-t">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Role</p>
            <p className="text-sm font-bold text-slate-700">{userRole === 'admin' ? 'Administrator' : 'Captain'}</p>
            <button 
              onClick={() => setUserRole(userRole === 'admin' ? 'pilot' : 'admin')} 
              className="text-xs text-blue-600 mt-2 font-bold hover:text-blue-800 underline block"
            >
              Toggle View
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'dashboard' ? 'Flight Deck' : 'Trade Board'}
          </h2>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all">
            <Plus size={18}/> Post Trade
          </button>
        </header>

        <div className="p-8 space-y-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">{s.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{s.value}</h3>
                  </div>
                  <div className={`${s.bg} ${s.color} p-3 rounded-xl`}><s.icon size={20}/></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
              <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ChevronRight size={16}/>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Crew Member</th>
                    <th className="px-8 py-4">Route</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trades.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {t.pilot.split(' ')[1][0]}
                          </div>
                          <span className="font-bold text-sm text-slate-700">{t.pilot}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-700">{t.route}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{t.date}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${t.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
