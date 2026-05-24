/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Navigation, Bookmark, Zap, ThumbsUp, PlusCircle } from 'lucide-react';
import { Deal } from '../types';
import { formatTimeRemaining } from './DealCard';

interface DealDetailModalProps {
  deal: Deal;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
  onClose: () => void;
  onAddSighting: (dealId: string, comment: string) => void;
}

export default function DealDetailModal({ 
  deal, 
  isSaved, 
  onToggleSave, 
  onClose, 
  onAddSighting 
}: DealDetailModalProps) {
  const [timeLeft, setTimeLeft] = useState(deal.expiry);
  const [sightingText, setSightingText] = useState('');
  const [localSightings, setLocalSightings] = useState([
    { id: '1', user: '@momin_scout', text: 'Confirmed active! Staff is honoring the price tag.', time: '5m' },
    { id: '2', user: '@shop_laore', text: 'Still in stock, plenty of sizes left.', time: '14m' },
    { id: '3', user: '@burger_fan', text: 'Queue is exceptionally short today. Took 2 minutes.', time: '28m' }
  ]);

  useEffect(() => {
    setTimeLeft(deal.expiry);
  }, [deal.id, deal.expiry]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sightingText.trim()) return;
    
    // Add locally to view immediate feedback
    const newSighting = {
      id: Date.now().toString(),
      user: '@you (Scout)',
      text: sightingText.trim(),
      time: 'Just now'
    };
    setLocalSightings([newSighting, ...localSightings]);
    onAddSighting(deal.id, sightingText.trim());
    setSightingText('');
  };

  const savings = deal.orig - deal.price;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 overflow-y-auto select-none md:p-6 animate-fadeIn">
      <div className="w-full max-w-4xl bg-brand-bg2 border border-brand-border rounded-3xl overflow-hidden shadow-2xl flex flex-col md:max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border relative bg-brand-bg2">
          <div className="flex items-center gap-1.5">
            <span className="font-syne font-extrabold text-brand-accent tracking-wider text-xs">NEARDIS DETAIL</span>
            <span className="text-brand-text3">•</span>
            <span className="text-[11px] text-brand-text2 font-bold uppercase">{deal.cat}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-3 border border-brand-border text-brand-text rounded-lg hover:border-brand-accent/50 cursor-pointer text-xs"
          >
            ← Close
          </button>
        </div>

        {/* CONTAINER GRIDS */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12">
          {/* MAIN COLUMN */}
          <div className="md:col-span-7 p-6 space-y-6">
            <div className="relative w-full h-48 rounded-2xl bg-brand-bg3 border border-brand-border flex items-center justify-center text-7xl select-none">
              <span>{deal.emoji}</span>
              <span className="absolute top-4 right-4 bg-brand-accent/15 border border-brand-accent/40 text-brand-accent text-lg font-extrabold px-3 py-1 rounded-xl">
                -{deal.disc}%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-brand-text3 text-xs gap-1">
                <span className="font-bold tracking-wider uppercase text-brand-text2">{deal.shop}</span>
                <CheckCircle className="w-3.5 h-3.5 text-brand-blue fill-brand-blue/10" />
                <span>• Lahore, Pakistan</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-brand-text leading-tight">
                {deal.title}
              </h1>
            </div>

            <p className="text-sm text-brand-text2 leading-relaxed">
              {deal.desc}
            </p>

            {/* COMPARE PRICING TILES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-brand-bg3 rounded-2xl border border-brand-border text-center">
                <span className="text-xs text-brand-text3 block mb-1">Original Price</span>
                <span className="text-sm text-brand-text3 line-through font-medium">Rs {deal.orig.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-brand-bg3 rounded-2xl border border-brand-border text-center">
                <span className="text-xs text-brand-accent block mb-1">Neardis Deal</span>
                <span className="text-xl font-bold text-brand-text block">Rs {deal.price.toLocaleString()}</span>
                <span className="text-[10px] text-brand-green font-semibold">Save Rs {savings.toLocaleString()}</span>
              </div>
            </div>

            {/* VERDICT SLIDER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-text3 uppercase font-bold tracking-wide">Community Consensus</span>
                <span className="text-brand-green font-semibold">{deal.worthit}% Say "Worth It"</span>
              </div>
              <div className="w-full bg-brand-border rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-brand-green h-full rounded-full transition-all duration-300"
                  style={{ width: `${deal.worthit}%` }}
                />
              </div>
              <span className="text-[10px] text-brand-text3 block mt-1">Based on {deal.sightingsCount * 3 + 4} votes • Average Rating: {deal.rating} ★</span>
            </div>

            {/* PRIMARY CONTROL CTA PANEL */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => alert(`Directions to ${deal.shop} in Lahore! Open in Google Maps.`)}
                className="flex-1 bg-gradient-to-r from-brand-accent to-brand-accent2 text-white font-bold text-sm py-3 px-6 rounded-xl hover:opacity-95 cursor-pointer shadow-lg shadow-brand-accent/15 flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Get Real-time Directions
              </button>
              <button 
                onClick={(e) => onToggleSave(e, deal.id)}
                className={`flex-shrink-0 text-sm font-semibold rounded-xl border py-3 px-5 transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  isSaved 
                    ? 'border-brand-accent/40 bg-brand-accent/10 text-brand-accent' 
                    : 'border-brand-border text-brand-text2 hover:text-brand-text'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Deal Saved' : 'Save Deal'}
              </button>
            </div>
          </div>

          {/* SIDE PANEL COLUMN */}
          <div className="md:col-span-5 border-t md:border-t-0 md:border-l border-brand-border p-6 space-y-6 bg-brand-surface/40 select-none">
            {/* TIMER TILE */}
            <div className="space-y-1">
              <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">⏰ TIME REMAINING</span>
              <div className="text-3xl font-extrabold tracking-tight text-brand-accent uppercase font-syne">
                {formatTimeRemaining(timeLeft)}
              </div>
            </div>

            {/* DISTANCE TILE */}
            <div className="space-y-1">
              <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">📍 HYPERLOCAL DISTANCE</span>
              <div className="text-lg font-bold text-brand-text">
                {deal.dist < 1 ? `${(deal.dist * 1000).toFixed(0)} meters` : `${deal.dist.toFixed(2)} km`} away
              </div>
            </div>

            {/* SIGHTINGS LOG CONTAINER */}
            <div className="space-y-4">
              <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block">👥 LATEST SCOUT SIGHTINGS ({localSightings.length})</span>
              
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {localSightings.map(sig => (
                  <div key={sig.id} className="p-3 bg-brand-surface border border-brand-border rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-brand-text">{sig.user}</strong>
                      <span className="text-[10px] text-brand-text3">{sig.time} ago</span>
                    </div>
                    <p className="text-brand-text2 leading-snug">{sig.text}</p>
                  </div>
                ))}
              </div>

              {/* POST SIGHTING INPUT FORM */}
              <form onSubmit={handleSightingSubmit} className="space-y-2 pt-2">
                <input 
                  type="text" 
                  value={sightingText}
                  onChange={(e) => setSightingText(e.target.value)}
                  placeholder="Spot this deal? Add a sighting update..." 
                  className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-text outline-none focus:border-brand-accent placeholder:text-brand-text3"
                />
                <button 
                  type="submit"
                  className="w-full bg-brand-surface2 hover:bg-brand-surface3 text-brand-accent font-semibold text-xs py-2 px-4 rounded-xl border border-brand-border cursor-pointer flex items-center justify-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Broadcast Instant Sighting
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
