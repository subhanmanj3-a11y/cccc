/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Deal, CategoryType } from '../types';
import { AlertTriangle, Tag, Bookmark, Trash2 } from 'lucide-react';
import DealCard from './DealCard';

interface SavedPageProps {
  deals: Deal[];
  savedDealsSet: Set<string>;
  onToggleSaveDeal: (e: React.MouseEvent, id: string) => void;
  onSelectDeal: (id: string) => void;
}

export default function SavedPage({
  deals,
  savedDealsSet,
  onToggleSaveDeal,
  onSelectDeal
}: SavedPageProps) {
  const [activeCat, setActiveCat] = useState<'all' | CategoryType>('all');

  const savedDeals = deals.filter(d => savedDealsSet.has(d.id));
  const filteredSaved = activeCat === 'all' 
    ? savedDeals 
    : savedDeals.filter(d => d.cat === activeCat);

  // Filter saved deals that will expire soon (< 4 hours)
  const expiringSoon = savedDeals.filter(d => d.expiry > 0 && d.expiry < 14400);

  const collections = [
    { id: 'all', label: 'All Saved', icon: '📁', count: savedDeals.length },
    { id: 'food', label: 'Food & Dining', icon: '🍽️', count: savedDeals.filter(d => d.cat === 'food').length },
    { id: 'fashion', label: 'Fashion Store', icon: '🛍️', count: savedDeals.filter(d => d.cat === 'fashion').length },
    { id: 'electronics', label: 'Tech & Mobiles', icon: '📱', count: savedDeals.filter(d => d.cat === 'electronics').length },
  ];

  return (
    <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden h-full select-none">
      {/* LEFT AREA: DIRECTORIES / COLLECTION CATEGORIES */}
      <aside className="lg:col-span-3 bg-brand-bg2 border-b lg:border-b-0 lg:border-r border-brand-border p-4 max-h-48 lg:max-h-none overflow-y-auto">
        <span className="text-[10px] text-brand-text3 uppercase font-bold tracking-wider block mb-3">Folders</span>
        
        <div className="space-y-1">
          {collections.map(col => (
            <button
              key={col.id}
              onClick={() => setActiveCat(col.id as any)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-colors cursor-pointer text-left select-none ${
                activeCat === col.id 
                  ? 'bg-brand-surface2 text-brand-text font-bold' 
                  : 'text-brand-text2 hover:bg-brand-surface hover:text-brand-text'
              }`}
            >
              <span>{col.icon}</span>
              <span className="flex-1 truncate">{col.label}</span>
              <span className="text-[10px] text-brand-text3 font-extrabold">{col.count}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* RIGHT AREA: SEARCH MATCHES LIST */}
      <main className="lg:col-span-9 overflow-y-auto p-4 md:p-6 space-y-6 flex-1 scrollbar-thin">
        {/* TOPBAR */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <div>
            <h1 className="font-syne font-extrabold text-2xl text-brand-text flex items-center gap-1.5 leading-none">
              📁 Saved Bookmarks
            </h1>
            <p className="text-xs text-brand-text2 mt-1">Folders containing active deals bookmarked on your account profile.</p>
          </div>
          <span className="text-xs text-brand-text3 font-bold uppercase">{savedDeals.length} bookmarked</span>
        </div>

        {/* EXPIRATION TIMELINE NOTICE */}
        {expiringSoon.length > 0 && (
          <div className="p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-2xl flex items-start gap-3">
            <span className="text-lg">⏳</span>
            <div>
              <strong className="text-xs text-brand-accent block font-bold">
                {expiringSoon.length} of your bookmarked deals expire soon!
              </strong>
              <div className="text-[10px] text-brand-text2 mt-1 space-y-1">
                {expiringSoon.map(d => (
                  <div key={d.id}>• {d.shop} - {d.title} (expires soon)</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTAINER SAVED PRODUCTS GRAPHIC GRID */}
        {filteredSaved.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSaved.map(deal => (
              <DealCard 
                key={deal.id}
                deal={deal}
                isSaved={true}
                onToggleSave={onToggleSaveDeal}
                onSelect={onSelectDeal}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3 p-4">
            <span className="text-4xl block opacity-30">📁</span>
            <h3 className="text-sm font-bold text-brand-text3 uppercase tracking-wide">No saved deals found in this folder</h3>
            <p className="text-xs text-brand-text3 max-w-sm mx-auto">Explore active flash deals on the feed and tap the bookmark ribbon to save them.</p>
          </div>
        )}
      </main>
    </div>
  );
}
