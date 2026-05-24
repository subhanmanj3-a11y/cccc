/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Deal, CommuteRoute } from '../types';
import { Navigation, Bell, Plus, Check, MapPin, Compass } from 'lucide-react';
import DealCard from './DealCard';

interface RouteAlertsProps {
  deals: Deal[];
  routes: CommuteRoute[];
  onAddRoute: (routeData: any) => void;
  savedDealsSet: Set<string>;
  onToggleSaveDeal: (e: React.MouseEvent, id: string) => void;
  onSelectDeal: (id: string) => void;
}

export default function RouteAlerts({
  deals,
  routes,
  onAddRoute,
  savedDealsSet,
  onToggleSaveDeal,
  onSelectDeal
}: RouteAlertsProps) {
  const [startPoint, setStartPoint] = useState('Gulberg III');
  const [endPoint, setEndPoint] = useState('Liberty Market');
  const [alertRadius, setAlertRadius] = useState(400);
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:30');
  const [selectedCats, setSelectedCats] = useState<string[]>(['food']);

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startPoint.trim() || !endPoint.trim()) {
      alert("Please fill in both start and end locations.");
      return;
    }

    const newRoute = {
      from: startPoint.trim(),
      to: endPoint.trim(),
      alertRadius,
      startTime,
      endTime,
      categories: selectedCats,
    };

    onAddRoute(newRoute);
    alert("Commute route saved successfully! Radar alert triggers automatically between specified active hours.");
  };

  const handleToggleCat = (cat: string) => {
    setSelectedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Only display deals along morning commutes matching alert properties
  const routeDeals = deals.filter(deal => {
    // food or matching category index
    return selectedCats.includes(deal.cat) || deal.dist < 0.6;
  }).slice(0, 4);

  return (
    <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden h-full select-none">
      {/* LEFT SECTION - SCROLL LIST */}
      <div className="lg:col-span-8 overflow-y-auto p-4 md:p-6 space-y-6 flex-1 max-h-[60vh] lg:max-h-none">
        <div>
          <h1 className="font-syne font-extrabold text-2xl text-brand-text flex items-center gap-1.5 leading-none">
            🚗 Scout Commute Alerts
          </h1>
          <p className="text-xs text-brand-text2 mt-1">Configure active alerts along your travel route. We notify you of active flash deals before you drive past them!</p>
        </div>

        {/* ROUTES CARDS LIST */}
        <div className="space-y-3">
          <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider">Your Traveling Routes</span>
          
          <div className="space-y-2.5">
            {routes.map(route => (
              <div 
                key={route.id}
                className="bg-brand-surface border border-brand-border rounded-xl p-4 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="text-sm font-bold text-brand-text flex items-center gap-1">
                    <span>{route.from}</span>
                    <span className="text-brand-text3">➜</span>
                    <span>{route.to}</span>
                  </div>
                  <div className="text-[10px] text-brand-text2 font-semibold">
                    ⏲️ Active: {route.startTime} - {route.endTime} • Alert Radius: {route.alertRadius}m
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded ${
                    route.active 
                      ? 'bg-brand-accent/15 text-brand-accent animate-pulse' 
                      : 'bg-brand-surface2 text-brand-text3'
                  }`}>
                    {route.active ? '📡 ACTIVE' : 'PAUSED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MATCHED DEALS FOR COMMUTE */}
        <div className="space-y-4">
          <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">Deals Along Your Travel Path</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {routeDeals.map(deal => (
              <DealCard 
                key={deal.id}
                deal={deal}
                isSaved={savedDealsSet.has(deal.id)}
                onToggleSave={onToggleSaveDeal}
                onSelect={onSelectDeal}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - CONTROL CONFIGURE BLOCK */}
      <aside className="lg:col-span-4 bg-brand-bg2 border-t lg:border-t-0 lg:border-l border-brand-border overflow-y-auto p-4 md:p-6 space-y-6 flex-shrink-0">
        <div>
          <h3 className="text-sm font-extrabold text-brand-text uppercase font-syne flex items-center gap-1">
            <Bell className="w-4 h-4 text-brand-accent" /> Configure Route Alert
          </h3>
          <p className="text-[10px] text-brand-text3 mt-1">Add a travel route to scan Lahore for active deals</p>
        </div>

        <form onSubmit={handleAddRoute} className="space-y-4 text-xs font-semibold text-brand-text2">
          {/* FROM INPUT */}
          <div className="space-y-1">
            <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wider block">Start Point</label>
            <input 
              type="text" 
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              placeholder="e.g. Home (Gulberg III)" 
              className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text outline-none focus:border-brand-accent"
            />
          </div>

          {/* TO INPUT */}
          <div className="space-y-1">
            <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wider block">End Destination</label>
            <input 
              type="text" 
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              placeholder="e.g. Liberty Market Offices" 
              className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text outline-none focus:border-brand-accent"
            />
          </div>

          {/* SLIDER RADIUS */}
          <div className="space-y-2">
            <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wider block">Alert Threshold Radius</label>
            <input 
              type="range" 
              min={100} 
              max={1000} 
              step={100}
              value={alertRadius}
              onChange={(e) => setAlertRadius(parseInt(e.target.value))}
              className="w-full accent-brand-accent cursor-pointer bg-brand-border h-1.5 rounded-lg"
            />
            <div className="text-[10px] text-brand-text font-bold text-center">
              Alert Trigger: <span className="text-brand-accent">{alertRadius} meters</span> of path
            </div>
          </div>

          {/* TIMER SECTORS */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wider block">Scanning Windows Schedule</label>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-brand-bg3 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text block"
              />
              <input 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-brand-bg3 border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-text block"
              />
            </div>
          </div>

          {/* SEARCH CATEGORIES */}
          <div className="space-y-2">
            <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wider block">Exclude / Include Categories</label>
            <div className="flex gap-1.5 flex-wrap">
              {['food', 'fashion', 'electronics', 'beauty', 'sports', 'home'].map(cat => {
                const isActive = selectedCats.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCat(cat)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase border cursor-pointer select-none transition-all ${
                      isActive 
                        ? 'bg-brand-accent/12 border-brand-accent text-brand-accent' 
                        : 'bg-brand-bg3 border-brand-border text-brand-text3 hover:text-brand-text2'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            className="w-full bg-brand-surface2 hover:bg-brand-surface3 text-brand-accent border border-brand-border font-extrabold text-xs py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4" /> Save Route Alert
          </button>
        </form>
      </aside>
    </div>
  );
}
