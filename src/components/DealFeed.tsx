/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Deal, CategoryType, Sighting } from '../types';
import { Sparkles, Compass, AlertTriangle, TrendingUp, Search, Flame } from 'lucide-react';
import DealCard, { formatTimeRemaining } from './DealCard';

interface DealFeedProps {
  deals: Deal[];
  sightings: Sighting[];
  onSelectDeal: (id: string) => void;
  savedDealsSet: Set<string>;
  onToggleSaveDeal: (e: React.MouseEvent, id: string) => void;
  onPostNewDealClick: () => void;
  onSurpriseMeClick: () => void;
}

export default function DealFeed({
  deals,
  sightings,
  onSelectDeal,
  savedDealsSet,
  onToggleSaveDeal,
  onPostNewDealClick,
  onSurpriseMeClick
}: DealFeedProps) {
  const [activeCat, setActiveCat] = useState<'all' | CategoryType>('all');
  const [flashFilter, setFlashFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering deals safely
  let list = [...deals];
  if (activeCat !== 'all') {
    list = list.filter(d => d.cat === activeCat);
  }
  if (flashFilter) {
    list = list.filter(d => d.flash);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.shop.toLowerCase().includes(q)
    );
  }

  // Sort near to far
  list.sort((a,b) => a.dist - b.dist);

  // Expiring soon criteria (< 12 hours)
  const expiringList = deals
    .filter(d => d.expiry > 0 && d.expiry < 43200)
    .sort((a,b) => a.expiry - b.expiry)
    .slice(0, 4);

  // Density Hotspot levels nearby MM Alam and Liberty
  const densityZones = [
    { name: 'Liberty Market', density: 94, color: 'bg-brand-accent' },
    { name: 'MM Alam Road Strip', density: 78, color: 'bg-brand-amber' },
    { name: 'Hali Boulevard Core', density: 65, color: 'bg-brand-blue' },
    { name: 'Fortress Stadium Mall', density: 42, color: 'bg-brand-purple' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* LOCAL TOP SUB-NAVIGATION BAR */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-brand-border bg-brand-bg2 flex-shrink-0 select-none">
        <div className="flex items-center gap-2">
          <h1 className="font-syne font-extrabold text-2xl tracking-tight text-brand-text leading-none flex items-center gap-1.5">
            ⚡ Neardis Feed
          </h1>
        </div>

        {/* INPUT HEADER SEARCH SEARCH */}
        <div className="flex-1 max-w-md relative flex items-center">
          <Search className="w-4 h-4 text-brand-text3 absolute left-4 pointer-events-none select-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified deals, brands, or cafes nearby..."
            className="w-full bg-brand-surface border border-brand-border rounded-xl pl-11 pr-4 py-2 text-xs text-brand-text outline-none focus:border-brand-accent placeholder:text-brand-text3 transition-colors"
          />
        </div>

        {/* TOP CTA BUTTON SECTOR */}
        <div className="flex gap-2.5">
          <button 
            onClick={onSurpriseMeClick}
            className="text-xs bg-brand-surface border border-brand-border hover:border-brand-accent/50 text-brand-text rounded-xl py-2 px-3.5 cursor-pointer font-bold select-none duration-150 transform hover:scale-102 flex items-center gap-1"
          >
            🎲 Surprise Me
          </button>
          <button 
            onClick={onPostNewDealClick}
            className="text-xs bg-gradient-to-r from-brand-accent to-brand-accent2 text-white font-extrabold py-2 px-4 rounded-xl cursor-pointer select-none duration-150 shadow-lg shadow-brand-accent/15 hover:opacity-95 transform active:scale-97"
          >
            + Post Deal
          </button>
        </div>
      </header>

      {/* CHIPS FILTER CATEGORY SELECTOR BAR */}
      <div className="px-4 py-3 bg-brand-bg2/50 border-b border-brand-border flex-shrink-0 flex items-center gap-4 justify-between overflow-x-auto select-none">
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'food', 'fashion', 'electronics', 'beauty', 'sports', 'home'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase border cursor-pointer transition-all ${
                activeCat === cat 
                  ? 'bg-brand-surface2 border-brand-border text-brand-text' 
                  : 'bg-brand-surface/40 border-brand-border text-brand-text3 hover:text-brand-text2'
              }`}
            >
              {cat === 'all' ? '🍽️ All Deals' : cat}
            </button>
          ))}
        </div>

        {/* right floating checkbox chip toggle */}
        <button
          onClick={() => setFlashFilter(!flashFilter)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase border cursor-pointer select-none transition-all ${
            flashFilter 
              ? 'bg-brand-accent/12 border-brand-accent text-brand-accent shadow-md shadow-brand-accent/5' 
              : 'border-brand-border text-brand-text3 hover:border-brand-text2 hover:text-brand-text2'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Flash Only</span>
        </button>
      </div>

      <div className="text-[10px] px-4 py-1.5 border-b border-brand-border bg-brand-bg2/30 text-brand-text3 select-none flex items-center justify-between">
        <span>📍 Gulberg III • nearest & newest list models</span>
        <strong className="text-brand-text">{list.length} deals in filter scope</strong>
      </div>

      {/* TWO PANEL SPLIT ROW CONTAINER */}
      <div className="flex-grow overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* MAIN FEED SCROLL GRID COLUMN (75%) */}
        <div className="lg:col-span-8 overflow-y-auto p-4 md:p-6 scrollbar-thin">
          {list.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map(deal => (
                <DealCard 
                  key={deal.id}
                  deal={deal}
                  isSaved={savedDealsSet.has(deal.id)}
                  onToggleSave={onToggleSaveDeal}
                  onSelect={onSelectDeal}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center space-y-3.5">
              <span className="text-5xl block opacity-30 select-none">⚡</span>
              <h3 className="text-sm font-bold text-brand-text3 uppercase tracking-wide">Radar Clear of Deals</h3>
              <p className="text-xs text-brand-text2 max-w-sm mx-auto">No deals found matching the search or category filter. Try clearing categories or typing another brand name!</p>
            </div>
          )}
        </div>

        {/* FOOT-TRAFFIC HIGH-DENSITY SIDE PANEL (25%) */}
        <aside className="lg:col-span-4 bg-brand-bg2 border-t lg:border-t-0 lg:border-l border-brand-border overflow-y-auto p-4 md:p-6 space-y-6 flex-shrink-0 select-none hidden sm:block lg:max-h-none">
          {/* AREA DENSITIES LIST */}
          <div className="space-y-3.5">
            <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">🏢 Foot Traffic Hotspots</span>
            
            <div className="space-y-3">
              {densityZones.map((zone, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-medium">
                    <span className="text-brand-text">{zone.name}</span>
                    <span className="text-brand-text3">{zone.density} visitors/km²</span>
                  </div>
                  <div className="w-full bg-brand-bg3 rounded-full h-1.5 overflow-hidden">
                    <div className={`${zone.color} h-full rounded-full`} style={{ width: `${zone.density}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT USER SIGHTINGS STREAM */}
          <div className="space-y-3.5 border-t border-brand-border/60 pt-4">
            <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">👥 Scout Sightings Verified</span>
            
            <div className="space-y-2.5">
              {sightings.slice(0, 3).map(sig => (
                <div 
                  key={sig.id}
                  onClick={() => onSelectDeal(sig.dealId)}
                  className="p-3 bg-brand-surface border border-brand-border rounded-xl space-y-1 cursor-pointer hover:border-brand-border2 transition-all flex gap-3 select-none"
                >
                  <span className="text-2xl flex-shrink-0 bg-brand-bg3 p-1 rounded-lg border border-brand-border h-max mt-0.5">
                    {sig.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-brand-text2 font-semibold">
                      <strong className="text-brand-text">{sig.user}</strong> confirm: {sig.text}
                    </div>
                    <span className="text-[9px] text-brand-text3 block mt-1">{sig.time} ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TIMEOUT COMMUTE MINI TILES */}
          <div className="space-y-3.5 border-t border-brand-border/60 pt-4">
            <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">⏳ Expiring Rapidly</span>
            
            <div className="space-y-2">
              {expiringList.map(deal => (
                <div 
                  key={deal.id}
                  onClick={() => onSelectDeal(deal.id)}
                  className="p-2 bg-brand-surface border border-brand-border hover:border-brand-border2 hover:bg-brand-surface2 rounded-xl flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="text-2xl bg-brand-bg3 p-1.5 rounded-lg border border-brand-border flex-shrink-0 select-none">
                    {deal.emoji}
                  </div>
                  <div className="flex-grow min-w-0 pr-1">
                    <span className="text-[9px] text-brand-text3 uppercase font-bold leading-none block mb-0.5">{deal.shop}</span>
                    <strong className="text-xs text-brand-text truncate block leading-none">{deal.title}</strong>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[11px] text-brand-accent font-extrabold font-syne animate-pulse mb-0.5 mt-0.5 text-center">
                      -{deal.disc}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
