/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Deal } from '../types';
import { ShieldCheck, MapPin, ZoomIn, ZoomOut, Compass, Sparkles } from 'lucide-react';

interface MapPageProps {
  deals: Deal[];
  onSelectDeal: (id: string) => void;
}

export default function MapPage({ deals, onSelectDeal }: MapPageProps) {
  const [heatmapOn, setHeatmapOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeals = deals.filter(deal => 
    deal.shop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      {/* LOCAL TOPBAR */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border bg-brand-bg2 p-4 gap-3 flex-shrink-0">
        <div>
          <h1 className="font-syne font-extrabold text-lg text-brand-text flex items-center gap-1.5 leading-none">
            📍 Hyperlocal Discovery Grid
          </h1>
          <p className="text-[11px] text-brand-text3 mt-1 uppercase font-semibold">Lahore Gulberg Area</p>
        </div>

        <div className="flex items-center gap-3">
          {/* HEATMAP CONTROLLERS */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-text2 font-medium">Density Heatmap</span>
            <button 
              onClick={() => setHeatmapOn(!heatmapOn)}
              className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                heatmapOn ? 'bg-brand-accent' : 'bg-brand-border'
              }`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                heatmapOn ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </header>

      {/* TWO PANEL SPLIT CONTAINER */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* SIDE LIST BAR */}
        <aside className="lg:col-span-3 bg-brand-bg2 border-r border-brand-border flex flex-col overflow-hidden max-h-48 lg:max-h-none">
          <div className="p-3 border-b border-brand-border flex-shrink-0">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store map pins..."
              className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2 text-xs text-brand-text outline-none focus:border-brand-accent placeholder:text-brand-text3"
            />
          </div>
          <div className="p-2 border-b border-brand-border text-[10px] text-brand-text3 font-semibold uppercase tracking-wider flex justify-between">
            <span>{filteredDeals.length} Deals In Radar</span>
            <span>Radius: 2km</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
            {filteredDeals.map(deal => (
              <div
                key={deal.id}
                onClick={() => onSelectDeal(deal.id)}
                className="p-2 bg-brand-surface border border-brand-border rounded-xl hover:bg-brand-surface2 hover:border-brand-border2 cursor-pointer transition-all flex gap-3 items-center group select-none"
              >
                <div className="text-2xl bg-brand-bg3 p-1.5 rounded-lg border border-brand-border flex-shrink-0 group-hover:scale-110 transition-transform">
                  {deal.emoji}
                </div>
                <div className="flex-1 min-width-0">
                  <div className="text-[10px] text-brand-text3 font-bold uppercase truncate leading-none mb-1">
                    {deal.shop}
                  </div>
                  <h4 className="text-xs font-semibold text-brand-text truncate leading-none">
                    {deal.title}
                  </h4>
                  <div className="text-[9px] text-brand-accent font-bold mt-1">
                    {deal.disc}% OFF • {deal.dist} km
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* MAP CANVAS GRID */}
        <main className="lg:col-span-9 relative bg-brand-bg3 overflow-hidden flex-1">
          {/* GRID BASE */}
          <div className="absolute inset-0 opacity-40 select-none pointer-events-none"
               style={{
                 backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
                 backgroundSize: `${16 * zoomLevel}px ${16 * zoomLevel}px`
               }} 
          />

          {/* SIMULATED HIGHWAY ROAD NETWORKS */}
          <div className="absolute inset-x-0 top-[40%] h-12 bg-brand-bg4 border-y border-brand-border select-none pointer-events-none flex items-center justify-center">
            <span className="text-[9px] text-brand-text3 tracking-widest font-bold uppercase">Main Boulevard Gulberg</span>
          </div>
          <div className="absolute inset-x-0 top-[15%] h-6 bg-brand-bg4 border-y border-brand-border select-none pointer-events-none flex items-center justify-center">
            <span className="text-[8px] text-brand-text3 tracking-wider font-semibold">MM Alam Link Rd</span>
          </div>
          <div className="absolute inset-y-0 left-[25%] w-10 bg-brand-bg4 border-x border-brand-border select-none pointer-events-none flex items-center justify-center">
            <span className="text-[8px] text-brand-text3 tracking-wider font-semibold rotate-90 whitespace-nowrap">Hali Road</span>
          </div>
          <div className="absolute inset-y-0 left-[68%] w-8 bg-brand-bg4 border-x border-brand-border select-none pointer-events-none flex items-center justify-center">
            <span className="text-[8px] text-brand-text3 tracking-wider font-semibold rotate-90 whitespace-nowrap">Ghalib Road</span>
          </div>

          {/* SIMULATED AREA BUILDINGS LAYOUT (LANDMARKS) */}
          <div className="absolute left-[5%] top-[5%] w-[15%] h-[9%] bg-brand-surface2 border border-brand-border rounded-xl p-1 flex flex-col justify-center items-center pointer-events-none select-none">
            <span className="text-[10px] text-brand-text font-bold">Pace Mall</span>
            <span className="text-[8px] text-brand-text3 uppercase">Retail Zone</span>
          </div>
          <div className="absolute left-[40%] top-[4%] w-[22%] h-[9%] bg-brand-surface2 border border-brand-border rounded-xl p-1 flex flex-col justify-center items-center pointer-events-none select-none">
            <span className="text-[10px] text-brand-text font-bold">Monal Rooftop</span>
            <span className="text-[8px] text-brand-text3 uppercase">Dining Plaza</span>
          </div>
          <div className="absolute left-[78%] top-[5%] w-[15%] h-[9%] bg-brand-surface2 border border-brand-border rounded-xl p-1 flex flex-col justify-center items-center pointer-events-none select-none">
            <span className="text-[10px] text-brand-text font-bold">Liberty Plaza</span>
            <span className="text-[8px] text-brand-text3 uppercase">Commercial</span>
          </div>
          <div className="absolute left-[4%] top-[20%] w-[18%] h-[12%] bg-brand-surface2 border border-brand-border rounded-xl p-1 flex flex-col justify-center items-center pointer-events-none select-none">
            <span className="text-[10px] text-brand-text font-bold">Mall One</span>
            <span className="text-[8px] text-brand-text3 uppercase">Boutique Cent</span>
          </div>
          <div className="absolute left-[38%] top-[22%] w-[25%] h-[12%] bg-brand-surface2 border border-brand-border rounded-xl p-1 flex flex-col justify-center items-center pointer-events-none select-none">
            <span className="text-[10px] text-brand-text font-bold">M.M. Alam Rd Strip</span>
            <span className="text-[8px] text-brand-text3 uppercase">Cafes & Stores</span>
          </div>

          {/* HEAT BLOB HIGHLIGHT OVERLAYS */}
          {heatmapOn && (
            <div className="absolute inset-0 select-none pointer-events-none animate-fadeIn transition-opacity duration-300">
              <div className="absolute left-[12%] top-[18%] w-48 h-48 bg-radial from-brand-accent/25 to-transparent rounded-full blur-xl" />
              <div className="absolute left-[45%] top-[8%] w-56 h-56 bg-radial from-brand-accent2/25 to-transparent rounded-full blur-xl" />
              <div className="absolute left-[62%] top-[45%] w-60 h-60 bg-radial from-brand-amber/20 to-transparent rounded-full blur-xl" />
              <div className="absolute left-[30%] top-[65%] w-40 h-40 bg-radial from-brand-purple/20 to-transparent rounded-full blur-xl" />
            </div>
          )}

          {/* ACTIVE MAP PINS */}
          {filteredDeals.map(deal => (
            <button
              key={deal.id}
              onClick={() => onSelectDeal(deal.id)}
              className="absolute cursor-pointer transition-all duration-150 hover:scale-115 hover:z-30 select-none group"
              style={{
                left: `${deal.lng}%`,
                top: `${deal.lat}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className={`px-2.5 py-1.5 rounded-xl text-[10px] text-white font-extrabold flex items-center gap-1 shadow-lg pointer-events-none border border-black/40 ${
                deal.flash ? 'bg-brand-accent pin-flash' : 'bg-brand-surface3'
              }`}>
                <span>{deal.emoji}</span>
                <span>-{deal.disc}%</span>
              </div>
              {/* Tail marker */}
              <div className={`w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 mx-auto ${
                deal.flash ? 'border-t-brand-accent' : 'border-t-brand-surface3'
              }`} />
            </button>
          ))}

          {/* PULSING ACTIVE BLUE USER SIGNAL */}
          <div 
            className="absolute left-[48%] top-[52%] -translate-x-1/2 -translate-y-1/2 z-10 p-4"
            title="Ahsan (Scout Tracker)"
          >
            <div className="w-4 h-4 rounded-full bg-brand-blue border-3 border-white ring-8 ring-brand-blue/20" />
            <div className="absolute left-1/2 top-4 bg-brand-blue text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md -translate-x-1/2 mt-1 truncate max-w-[50px] uppercase">
              YOU
            </div>
          </div>

          {/* ZOOM CONTROL OVERLAYS */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 1, 5))}
              className="w-10 h-10 bg-brand-bg2 border border-brand-border rounded-xl flex items-center justify-center text-brand-text hover:border-brand-accent active:scale-95 cursor-pointer font-bold duration-150 shadow-xl"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 1, 1))}
              className="w-10 h-10 bg-brand-bg2 border border-brand-border rounded-xl flex items-center justify-center text-brand-text hover:border-brand-accent active:scale-95 cursor-pointer font-bold duration-150 shadow-xl"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button 
              onClick={() => alert("Recentering scout geolocation signals...")}
              className="w-10 h-10 bg-brand-bg2 border border-brand-border rounded-xl flex items-center justify-center text-brand-text hover:border-brand-accent active:scale-95 cursor-pointer font-bold duration-150 shadow-xl"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>

          {/* BOTTOM MAP LEGENDS */}
          <div className="absolute bottom-4 left-4 bg-brand-bg2/90 border border-brand-border backdrop-blur-md rounded-2xl p-3 max-w-[280px] text-[10px] space-y-2.5 shadow-2xl z-30 select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
              <span className="text-brand-text font-bold">Active Flash Deal (High Glow)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-surface3 border border-brand-border" />
              <span className="text-brand-text2 font-semibold">Standard Verified Deal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
              <span className="text-brand-text2 font-semibold">Your Geo Location (Scout Radar)</span>
            </div>

            <div className="pt-2 border-t border-brand-border">
              <div className="flex justify-between items-center text-[9px] text-brand-text3 font-extrabold uppercase mb-1">
                <span>Foot Traffic Hotspots</span>
                <span>Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-brand-text3">Low</span>
                <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-brand-accent/10 to-brand-accent" />
                <span className="text-[9px] text-brand-text3">High</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
