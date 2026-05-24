/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bookmark, Navigation, CheckCircle } from 'lucide-react';
import { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, id: string) => void;
  onSelect: (id: string) => void;
  key?: string;
}

export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Expired';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export default function DealCard({ deal, isSaved, onToggleSave, onSelect }: DealCardProps) {
  const [timeLeft, setTimeLeft] = useState(deal.expiry);

  useEffect(() => {
    setTimeLeft(deal.expiry);
  }, [deal.expiry]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const isUrgent = timeLeft > 0 && timeLeft < 3600;

  const tagColors: { [key: string]: string } = {
    food: 'bg-brand-green/12 text-brand-green',
    fashion: 'bg-brand-pink/12 text-brand-pink',
    electronics: 'bg-brand-blue/12 text-brand-blue',
    beauty: 'bg-brand-purple/12 text-brand-purple',
    sports: 'bg-brand-amber/12 text-brand-amber',
    home: 'bg-brand-teal/12 text-brand-teal',
  };

  return (
    <div
      onClick={() => onSelect(deal.id)}
      className={`bg-brand-surface border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 select-none group relative flex flex-col h-full ${
        deal.flash 
          ? 'border-brand-accent/50 glow-pulsing' 
          : 'border-brand-border hover:border-brand-border2'
      } hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/75`}
    >
      {deal.flash && (
        <span className="absolute top-3 left-3 bg-brand-accent text-white text-[9px] font-bold px-2.5 py-1 rounded-md z-10 letter-spacing-[0.5px]">
          🔥 FLASH
        </span>
      )}

      {/* CARD ACCENT COVER / ICON THUMBNAIL */}
      <div className="w-full h-32 bg-brand-bg3 flex items-center justify-center text-5xl relative overflow-hidden flex-shrink-0 select-none">
        <span className="group-hover:scale-110 transition-transform duration-300">{deal.emoji}</span>
        <div className="absolute top-3 right-3 bg-black/75 text-brand-accent font-extrabold text-sm py-1 px-2.5 rounded-lg border border-brand-accent/20">
          -{deal.disc}%
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] text-brand-text3 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <span>{deal.shop}</span>
            <CheckCircle className="w-3.5 h-3.5 text-brand-blue fill-brand-blue/10" />
          </div>

          <h3 className="text-sm font-semibold text-brand-text mb-3 line-clamp-2 leading-snug group-hover:text-brand-accent transition-colors">
            {deal.title}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-md font-semibold tracking-wide uppercase ${tagColors[deal.cat] || 'bg-brand-surface3 text-brand-text2'}`}>
              {deal.cat}
            </span>
            <span className="text-[10px] text-brand-text3 font-medium flex items-center gap-0.5">
              📍 {(deal.dist < 1) ? `${(deal.dist * 1000).toFixed(0)}m` : `${deal.dist.toFixed(1)}km`}
            </span>
            {deal.sightingsCount > 0 && (
              <span className="text-[10px] text-brand-text3">
                👥 {deal.sightingsCount} scouts
              </span>
            )}
          </div>

          <div className={`text-[11px] font-bold ${isUrgent ? 'text-brand-accent animate-pulse' : 'text-brand-amber'}`}>
            ⏰ {formatTimeRemaining(timeLeft)}
          </div>
        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-brand-border bg-brand-bg3/40 mt-auto flex-shrink-0">
        <span className="text-xs text-brand-green font-semibold flex items-center gap-1 mt-0.5">
          👍 {deal.worthit}% Worth It
        </span>
        <button
          onClick={(e) => onToggleSave(e, deal.id)}
          className={`p-1.5 rounded-lg border hover:bg-brand-surface cursor-pointer ring-offset-brand-surface ${
            isSaved 
              ? 'text-brand-accent border-brand-accent/40 bg-brand-accent/10' 
              : 'text-brand-text3 border-brand-border'
          } transition-all hover:scale-105`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}
