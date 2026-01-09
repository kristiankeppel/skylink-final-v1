/**
 * CORE LOGIC: FAA PART 117 LEGALITY ENGINE
 * Validates FDP limits, Rest requirements, and Cumulative caps.
 * Ref:
 */

interface DutyPeriod {
  reportTime: Date;
  releaseTime: Date;
  segments: number;
  isAugmented: boolean;
  flightTimeMinutes: number;
}

class LegalityEngine {
  // Table B: Unaugmented FDP Limits (simplified for example)
  private static getTableBLimit(reportHour: number, segments: number): number {
    if (reportHour >= 0 && reportHour < 4) return 9;
    if (reportHour >= 5 && reportHour < 6) return segments <= 4? 12 : 11.5;
    if (reportHour >= 7 && reportHour < 12) return segments <= 2? 14 : 13;
    if (reportHour >= 13 && reportHour < 17) return 12;
    return 9; // Default conservative limit
  }

  static validateAssignment(pilot: any, newDuty: DutyPeriod, history: DutyPeriod): { legal: boolean; reason?: string } {
    const reportHour = newDuty.reportTime.getHours();
    const fdpDuration = (newDuty.releaseTime.getTime() - newDuty.reportTime.getTime()) / (1000 * 60 * 60);

    // 1. Daily FDP Limit Check [4]
    const limit = this.getTableBLimit(reportHour, newDuty.segments);
    if (fdpDuration > limit) return { legal: false, reason: `FDP exceeds Table B limit of ${limit} hours` };

    // 2. Cumulative Flight Time (100h in 28 days) [5]
    const twentyEightDaysAgo = new Date(newDuty.reportTime.getTime() - 28 * 24 * 60 * 60 * 1000);
    const cumulativeFlight = history
     .filter(d => d.reportTime > twentyEightDaysAgo)
     .reduce((sum, d) => sum + d.flightTimeMinutes, 0) + newDuty.flightTimeMinutes;
    
    if (cumulativeFlight > 100 * 60) return { legal: false, reason: "Exceeds 100 flight hours in 672 consecutive hours" };

    // 3. Minimum Rest Check (10 hours with 8 hours sleep opportunity) [5]
    if (history.length > 0) {
      const lastRelease = history[history.length - 1].releaseTime;
      const restDuration = (newDuty.reportTime.getTime() - lastRelease.getTime()) / (1000 * 60 * 60);
      if (restDuration < 10) return { legal: false, reason: "Required 10-hour rest period not met" };
    }

    return { legal: true };
  }
}

/**
 * DATABASE SCHEMA (PostgreSQL / SQL)
 * Ref:
 */

/*
CREATE TABLE pilots (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  seniority_rank INT UNIQUE,
  base VARCHAR(10),
  fleet_type VARCHAR(20),
  qualifications TEXT
);

CREATE TABLE pairings (
  id UUID PRIMARY KEY,
  pairing_number VARCHAR(20),
  report_time TIMESTAMP,
  release_time TIMESTAMP,
  credit_minutes INT,
  segments INT,
  layover_city VARCHAR(10)
);

CREATE TABLE roster (
  id UUID PRIMARY KEY,
  pilot_id UUID REFERENCES pilots(id),
  pairing_id UUID REFERENCES pairings(id),
  status VARCHAR(20) -- 'AWARDED', 'TRADING', 'DROPPED'
);

CREATE TABLE trades (
  id UUID PRIMARY KEY,
  offering_pilot_id UUID REFERENCES pilots(id),
  receiving_pilot_id UUID REFERENCES pilots(id),
  offered_pairing_id UUID REFERENCES pairings(id),
  desired_pairing_id UUID REFERENCES pairings(id),
  status VARCHAR(20) -- 'PENDING', 'APPROVED', 'DENIED'
);
*/

/**
 * FRONT-END: PILOT INTERFACE (React Snippet)
 * Ref:
 */

import React, { useState } from 'react';

const PilotDashboard = () => {
  const = useState('roster');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Header */}
      <nav className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold tracking-tight">SkyFlow CrewConnect</h1>
        <div className="flex gap-6">
          <button onClick={() => setActiveTab('roster')} className={activeTab === 'roster'? 'border-b-2' : ''}>My Roster</button>
          <button onClick={() => setActiveTab('bidding')} className={activeTab === 'bidding'? 'border-b-2' : ''}>Bid System</button>
          <button onClick={() => setActiveTab('trades')} className={activeTab === 'trades'? 'border-b-2' : ''}>Trade Board</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-6 max-w-6xl mx-auto">
        {activeTab === 'roster' && (
          <section className="animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Monthly Roster: April 2026</h2>
            <div className="grid grid-cols-7 gap-2">
              {/* Simplified Calendar Component */}
              {[...Array(30)].map((_, i) => (
                <div key={i} className="bg-white p-4 h-32 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-gray-400 text-sm">{i + 1}</span>
                  {i === 12 && (
                    <div className="mt-2 bg-blue-100 text-blue-800 p-2 rounded text-xs font-bold">
                      FLT 402: JFK-LAX <br/> (08:00 - 14:30)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'trades' && (
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Open Trade Board</h2>
            <div className="space-y-4">
              {/* Trade Card Example [6] */}
              <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-bold">Pairing #D3007 (JFK-MIA)</p>
                  <p className="text-sm text-gray-500">Pilot: Capt. Sarah Miller (Seniority: 452)</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-600 font-bold">Split Available</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Request Swap</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

/**
 * BACK-END ADMIN PANEL: SETTING OPERATIONAL PARAMETERS
 */

const AdminPanel = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">Airline Operations Control Center</h2>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Legality Config [7] */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900">Compliance & Limits</h3>
            <div className="flex justify-between items-center">
              <span>FAA Part 117 Rules</span>
              <input type="checkbox" checked className="toggle-checkbox" readOnly />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Max Monthly Flight Credit</label>
              <input type="number" defaultValue="85" className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Default Reserve Guarantee</label>
              <input type="number" defaultValue="75" className="w-full border p-2 rounded" />
            </div>
          </div>

          {/* Bidding Parameters [3, 8] */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-900">PBS Solver Settings</h3>
            <div>
              <label className="block text-sm text-gray-600">Seniority Processing Order</label>
              <select className="w-full border p-2 rounded">
                <option>Strict Seniority (Standard)</option>
                <option>Weighted Fairness (Custom)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600">Denial Mode 1 Threshold</label>
              <input type="text" defaultValue="Min Credit Value" className="w-full border p-2 rounded" />
            </div>
          </div>
        </div>
        
        <button className="mt-8 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
          Push Roster Update to Fleet
        </button>
      </div>
    </div>
  );
};
