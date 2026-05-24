/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Deal } from '../types';
import { Gift, Sparkles, Navigation, Award, RotateCcw } from 'lucide-react';

interface SurpriseMeProps {
  deals: Deal[];
  onSelectDeal: (id: string) => void;
}

export default function SurpriseMe({ deals, onSelectDeal }: SurpriseMeProps) {
  const [spinning, setSpinning] = useState(false);
  const [pickedDeal, setPickedDeal] = useState<Deal | null>(null);
  const [history, setHistory] = useState<any[]>([
    { id: '1', emoji: '☕', shop: 'Café Zest', title: '50% off Beverages', when: 'Yesterday' },
    { id: '2', emoji: '🍔', shop: 'Burger Bros', title: 'Double Burger Buy-1-Get-1', when: '3 days ago' }
  ]);

  const handleSurpriseSpin = () => {
    // Filter nearby, high rating deals
    const pool = deals.filter(d => d.dist <= 0.6 && d.rating >= 4.2);
    if (!pool.length) {
      alert("No matching high-tier deals within immediate reach (500m) of Lahore Gulberg right now.");
      return;
    }

    setSpinning(true);
    setPickedDeal(null);

    // Simulate real-time randomized scrolling ticks
    setTimeout(() => {
      const idx = Math.floor(Math.random() * pool.length);
      const chosen = pool[idx];
      setSpinning(false);
      setPickedDeal(chosen);

      // Add to history list
      setHistory(prev => [
        {
          id: Date.now().toString(),
          emoji: chosen.emoji,
          shop: chosen.shop,
          title: chosen.title,
          when: 'Just now'
        },
        ...prev
      ]);
    }, 1800);
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto max-w-2xl mx-auto space-y-6">
      <div className="border-b border-brand-border pb-4">
        <h1 className="font-syne font-extrabold text-2xl text-brand-text flex items-center gap-1.5 leading-none">
          🎁 Neardis Surprise Dispenser
        </h1>
        <p className="text-xs text-brand-text2 mt-1">
          Let our automated scout index crawl active verified listings and extract one surprise value within 500 meters of Lahore Gulberg!
        </p>
      </div>

      <div className="bg-gradient-to-br from-brand-surface to-brand-bg2 border border-brand-border rounded-3xl p-6 relative overflow-hidden text-center shadow-xl">
        {/* Glow backdrop decorative item */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-radial from-brand-accent/10 to-transparent rounded-full blur-xl pointer-events-none" />

        <div className="space-y-6 relative">
          <div className="text-5xl mx-auto flex items-center justify-center p-3 bg-brand-bg3/50 border border-brand-border rounded-2xl w-20 h-20 shadow-inner">
            {spinning ? (
              <span className="animate-spin duration-300">⚙️</span>
            ) : pickedDeal ? (
              pickedDeal.emoji
            ) : (
              '🎁'
            )}
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-brand-text font-syne uppercase">
              {spinning 
                ? 'Locating active scouts...' 
                : pickedDeal 
                  ? pickedDeal.title 
                  : 'Ready for a discover?'
              }
            </h2>
            <p className="text-xs text-brand-text2 max-w-md mx-auto">
              {spinning 
                ? 'Evaluating local parameters...' 
                : pickedDeal 
                  ? `${pickedDeal.shop} • Worth rating: ${pickedDeal.worthit}%` 
                  : 'Matches highest rated active deals in Lahore.'
              }
            </p>
          </div>

          {pickedDeal && (
            <div className="bg-brand-bg3 border border-brand-border p-4 rounded-xl text-left flex gap-3 items-center animate-fadeIn">
              <span className="text-4xl">{pickedDeal.emoji}</span>
              <div className="flex-1 min-w-0">
                <strong className="text-xs text-brand-accent block uppercase font-bold tracking-wider leading-none mb-1">
                  -{pickedDeal.disc}% OFF • {pickedDeal.shop}
                </strong>
                <h4 className="text-sm font-semibold text-brand-text truncate leading-none mb-1">
                  {pickedDeal.title}
                </h4>
                <p className="text-[10px] text-brand-text3 leading-snug">
                  ✨ {pickedDeal.dist} km near you • {pickedDeal.rating} rating ★
                </p>
              </div>
              <button 
                onClick={() => onSelectDeal(pickedDeal.id)}
                className="bg-brand-accent hover:opacity-90 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center cursor-pointer shadow-lg"
              >
                View
              </button>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <button
              onClick={handleSurpriseSpin}
              disabled={spinning}
              className="bg-gradient-to-r from-brand-accent to-brand-accent2 hover:opacity-95 text-white font-bold text-sm py-3 px-8 rounded-xl cursor-pointer disabled:opacity-50 select-none flex items-center gap-1.5 shadow-lg shadow-brand-accent/20"
            >
              <Sparkles className="w-4 h-4" />
              {spinning ? 'Filtering live lists...' : 'Surprise Me!'}
            </button>
          </div>
          
          <span className="text-[9px] text-brand-text3 uppercase font-extrabold block">
            Picks only highest values within 500m • Min rating 4.3 ★
          </span>
        </div>
      </div>

      {/* RECENT HISTORIES */}
      <div className="space-y-3">
        <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider">Historical Picks</span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {history.map((h, idx) => (
            <div 
              key={h.id} 
              className="p-3 bg-brand-surface border border-brand-border rounded-xl flex items-center gap-3"
            >
              <div className="text-2xl bg-brand-bg3 p-1.5 rounded-lg border border-brand-border flex-shrink-0">
                {h.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] text-brand-text3 font-medium block leading-none mb-1">{h.when} ago</span>
                <strong className="text-xs text-brand-text block truncate mb-0.5">{h.shop}</strong>
                <p className="text-[10px] text-brand-text2 truncate leading-none">{h.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
