/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Deal, SavedLocation } from '../types';
import { Award, CheckCircle, Navigation, MapPin, Badge, Bell } from 'lucide-react';
import DealCard from './DealCard';

interface ProfilePageProps {
  deals: Deal[];
  savedDealsSet: Set<string>;
  onToggleSaveDeal: (e: React.MouseEvent, id: string) => void;
  onSelectDeal: (id: string) => void;
  savedLocations: SavedLocation[];
  onToggleLocationActive: (id: string) => void;
}

export default function ProfilePage({
  deals,
  savedDealsSet,
  onToggleSaveDeal,
  onSelectDeal,
  savedLocations,
  onToggleLocationActive
}: ProfilePageProps) {
  // Push Notification States
  const [pushStates, setPushStates] = useState([
    { id: 'p1', label: 'Flash Deals Near Me', active: true },
    { id: 'p2', label: 'Saved Deals Expiring Alert', active: true },
    { id: 'p3', label: 'New Deals on my Routes', active: true },
    { id: 'p4', label: 'Sighting Appraisals Confirmations', active: false },
    { id: 'p5', label: 'Weekend Roundups Summary', active: true }
  ]);

  const handleTogglePushState = (id: string) => {
    setPushStates(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const recentViewed = deals.slice(4, 7);

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto max-w-2xl mx-auto space-y-6 select-none h-full">
      {/* HEADER BAR */}
      <div className="border-b border-brand-border pb-4 flex justify-between items-center">
        <div>
          <h1 className="font-syne font-extrabold text-2xl text-brand-text flex items-center gap-1.5 leading-none">
            👤 Scout Coordinates
          </h1>
          <p className="text-xs text-brand-text2 mt-1">Manage physical safe-zones, push triggers, and redeem history.</p>
        </div>
      </div>

      {/* USER ID HEADER */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-center select-none shadow-xl">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent2 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg flex-shrink-0">
          AK
        </div>
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 justify-center sm:justify-start">
            <h2 className="font-syne font-extrabold text-lg text-brand-text">Ahsan Khan</h2>
            <span className="bg-brand-blue/15 text-brand-blue border border-brand-blue/30 text-[9px] font-bold py-0.5 px-2 rounded-md uppercase self-center max-w-[90px]">
              ✔ Verified user
            </span>
          </div>
          <p className="text-[11px] text-brand-text2 font-semibold">📍 Gulberg III, Lahore • Scout Level 3 Member</p>
          <div className="flex gap-1 justify-center sm:justify-start pt-1 font-bold text-[9px] uppercase">
            <span className="bg-brand-surface2 py-0.5 px-2 rounded text-brand-green">Scout Champion</span>
            <span className="bg-brand-surface2 py-0.5 px-2 rounded text-brand-blue">Coffee Fan</span>
          </div>
        </div>
        <div className="sm:text-right text-xs">
          <div className="text-brand-green font-bold">Scout Level 3</div>
          <span className="text-[10px] text-brand-text3 mt-1 block">Joined Lahore January 2024</span>
        </div>
      </div>

      {/* SCOUT LIFETIME STATS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-brand-surface border border-brand-border p-3 text-center rounded-xl">
          <div className="text-xl font-extrabold text-brand-accent">47</div>
          <span className="text-[9px] text-brand-text3 font-extrabold uppercase mt-1 block">Redemptions</span>
        </div>
        <div className="bg-brand-surface border border-brand-border p-3 text-center rounded-xl">
          <div className="text-xl font-extrabold text-brand-blue">23</div>
          <span className="text-[9px] text-brand-text3 font-extrabold uppercase mt-1 block">Sightings</span>
        </div>
        <div className="bg-brand-surface border border-brand-border p-3 text-center rounded-xl">
          <div className="text-xl font-extrabold text-brand-green">12</div>
          <span className="text-[9px] text-brand-text3 font-extrabold uppercase mt-1 block">Saved folders</span>
        </div>
      </div>

      {/* SAVED PHYSICAL RADAR LOCATIONS */}
      <div className="space-y-3">
        <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">Radar Anchor Locations</span>
        
        <div className="space-y-2">
          {savedLocations.map(loc => (
            <div 
              key={loc.id} 
              className="p-3 bg-brand-surface border border-brand-border rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl bg-brand-bg3 p-1 rounded-lg border border-brand-border">{loc.icon}</span>
                <div>
                  <strong className="text-xs text-brand-text block">{loc.name}</strong>
                  <span className="text-[9px] text-brand-text3 font-medium block mt-0.5 uppercase tracking-wide">{loc.address}</span>
                </div>
              </div>

              {/* TOGGLERS */}
              <button 
                onClick={() => onToggleLocationActive(loc.id)}
                className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                  loc.active ? 'bg-brand-accent' : 'bg-brand-border'
                }`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  loc.active ? 'translate-x-[20px]' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* NOTIFICATIONS SETTINGS PANEL */}
      <div className="space-y-3">
        <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">Scanning Windows Radar Alerts</span>
        
        <div className="bg-brand-surface border border-brand-border rounded-xl p-4 divide-y divide-brand-border/60">
          {pushStates.map(push => (
            <div key={push.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span className="text-xs font-semibold text-brand-text2">{push.label}</span>
              <button 
                onClick={() => handleTogglePushState(push.id)}
                className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                  push.active ? 'bg-brand-accent' : 'bg-brand-border'
                }`}
              >
                <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  push.active ? 'translate-x-[20px]' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RECENTS LOGLIST */}
      <div className="space-y-3">
        <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">Recently Viewed Deals</span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recentViewed.map(deal => (
            <div 
              key={deal.id}
              onClick={() => onSelectDeal(deal.id)}
              className="p-3 bg-brand-surface border border-brand-border rounded-xl hover:bg-brand-surface2 hover:border-brand-border2 cursor-pointer flex items-center gap-3 transition-colors"
            >
              <span className="text-3xl bg-brand-bg3 p-1 rounded-xl border border-brand-border flex-shrink-0">{deal.emoji}</span>
              <div className="flex-1 min-w-0">
                <strong className="text-xs text-brand-text block truncate leading-none mb-1">{deal.shop}</strong>
                <p className="text-[10px] text-brand-text2 truncate leading-none">{deal.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
