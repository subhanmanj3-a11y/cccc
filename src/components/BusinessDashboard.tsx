/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Deal } from '../types';
import { 
  BarChart, 
  Sparkles, 
  PlusCircle, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Eye, 
  Activity, 
  AlertTriangle 
} from 'lucide-react';

interface BusinessDashboardProps {
  deals: Deal[];
  onAddDeal: (dealData: any) => void;
  onPauseDeal: (id: string) => void;
}

export default function BusinessDashboard({ deals, onAddDeal, onPauseDeal }: BusinessDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'analytics' | 'insights' | 'occupancy'>('overview');
  
  // Submit Deal Form States
  const [formTitle, setFormTitle] = useState('');
  const [formDiscount, setFormDiscount] = useState('30');
  const [formCategory, setFormCategory] = useState('food');
  const [formDescription, setFormDescription] = useState('');
  const [formOriginal, setFormOriginal] = useState('1000');
  const [formFlash, setFormFlash] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  // Simulated Occupancy Toggles
  const [occupancySignals, setOccupancySignals] = useState([
    { id: 'o1', label: 'Limited Stock!', desc: 'Displays prompt alerting clients to purchase quickly.', icon: '🏷️', active: true },
    { id: 'o2', label: 'Tables Vacant', desc: 'Alerts dine-in users about available seating counts.', icon: '🪑', active: false },
    { id: 'o3', label: 'Minimal Wait Time', desc: 'Signals quick checkouts during busy Lahore lunch times.', icon: '⚡', active: true },
    { id: 'o4', label: 'Sold Out Alert', desc: 'Suspends direct navigation requests without deleting deal.', icon: '🚫', active: false }
  ]);

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Please provide a Deal Title.");
      return;
    }

    const disc = parseInt(formDiscount) || 30;
    const orig = parseInt(formOriginal) || 1000;
    const price = Math.round(orig * (1 - disc / 100));

    const newDeal = {
      title: formTitle.trim(),
      emoji: formCategory === 'food' ? '🍔' : formCategory === 'fashion' ? '🛍️' : formCategory === 'electronics' ? '📱' : '🎁',
      disc,
      orig,
      price,
      cat: formCategory,
      desc: formDescription.trim() || 'No special terms. Instant discount verified on billing.',
      flash: formFlash,
    };

    onAddDeal(newDeal);
    setPostSuccess(true);
    setFormTitle('');
    setFormDescription('');
    setFormFlash(false);
    setTimeout(() => setPostSuccess(false), 4000);
  };

  const handleToggleOccupancy = (id: string) => {
    setOccupancySignals(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
      {/* TOPBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-syne font-extrabold text-2xl text-brand-text">Neardis Business Portal</h1>
            <span className="bg-brand-blue/15 text-brand-blue border border-brand-blue/30 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
              ✔ Verified Merchant
            </span>
          </div>
          <p className="text-xs text-brand-text2 mt-1">Configure live store signals, analyze reach, and broadcast custom deals instantly.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-accent"></span>
          </span>
          <span className="text-xs text-brand-text2 font-bold uppercase tracking-wide">3 active broadcasts</span>
        </div>
      </div>

      {/* DASHBOARD TABS NAVBAR */}
      <div className="tabs flex gap-2 border-b border-brand-border overflow-x-auto select-none pl-0">
        {(['overview', 'deals', 'analytics', 'insights', 'occupancy'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab capitalize py-2 px-4 rounded-xl font-medium text-xs transition-all cursor-pointer border ${
              activeTab === tab 
                ? 'bg-brand-surface2 text-brand-text border-brand-border' 
                : 'border-transparent text-brand-text2 hover:bg-brand-surface hover:text-brand-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* RENDER CONTENT DEPENDING ON ACTIVE TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* METRIC CARD GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
              <span className="text-[10px] text-brand-text3 font-bold uppercase block mb-1">Total Profile Views</span>
              <div className="text-2xl font-extrabold font-syne text-brand-blue">2,847</div>
              <span className="text-[10px] text-brand-green font-semibold mt-1 inline-block">📈 +23% this week</span>
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
              <span className="text-[10px] text-brand-text3 font-bold uppercase block mb-1">Instant Redemptions</span>
              <div className="text-2xl font-extrabold font-syne text-brand-green">312</div>
              <span className="text-[10px] text-brand-green font-semibold mt-1 inline-block">📈 +18% vs yesterday</span>
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
              <span className="text-[10px] text-brand-text3 font-bold uppercase block mb-1">Average Sighting Rating</span>
              <div className="text-2xl font-extrabold font-syne text-brand-amber">4.7 ★</div>
              <span className="text-[10px] text-brand-green font-semibold mt-1 inline-block">📈 +0.2 user trust</span>
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
              <span className="text-[10px] text-brand-text3 font-bold uppercase block mb-1">Active Deal Reach</span>
              <div className="text-2xl font-extrabold font-syne text-brand-accent">3 Lists</div>
              <span className="text-[10px] text-brand-text3 font-semibold mt-1 inline-block">2 items pending review</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WEEK PEAK CHARTS */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-brand-text flex items-center gap-1.5 leading-none">
                  <TrendingUp className="w-4 h-4 text-brand-accent" /> Hourly Traffic Engagements
                </h3>
                <p className="text-[10px] text-brand-text3 mt-1 uppercase font-semibold">Broadcasting response by hour</p>
              </div>

              {/* BAR CHART GRAPHIC */}
              <div className="flex items-end gap-1.5 h-36 pt-2 select-none">
                {[30, 20, 55, 75, 95, 88, 98, 82, 60, 42, 30, 18].map((height, idx) => {
                  const label = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p'][idx];
                  const isPeak = height >= 88;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div 
                        className={`w-full rounded-t-md transition-all duration-300 pointer-events-none ${
                          isPeak ? 'bg-brand-accent animate-pulse' : 'bg-brand-accent/25'
                        }`}
                        style={{ height: `${height}%` }}
                        title={`${label}: ${height}`}
                      />
                      <span className="text-[8px] text-brand-text3 font-bold uppercase mt-1.5">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BREAKDOWN FUNNEL PROGRESS LIST */}
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-brand-text flex items-center gap-1.5 leading-none">
                  <Eye className="w-4 h-4 text-brand-blue" /> Consumer Interaction Breakdown
                </h3>
                <p className="text-[10px] text-brand-text3 mt-1 uppercase font-semibold">Funnel conversion this week</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Map Pin Views', count: '2,847 (100%)', bar: 'w-full', color: 'bg-brand-blue' },
                  { label: 'Scout Bookmarks', count: '486 (17%)', bar: 'w-[17%]', color: 'bg-brand-purple' },
                  { label: 'Directions Requested', count: '312 (11.6%)', bar: 'w-[11.6%]', color: 'bg-brand-green' },
                  { label: 'Sighting Appraisals', count: '94 (3%)', bar: 'w-[3%]', color: 'bg-brand-amber' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-brand-text2">{item.label}</span>
                      <span className="text-brand-text3">{item.count}</span>
                    </div>
                    <div className="w-full bg-brand-bg3 rounded-full h-2 overflow-hidden">
                      <div className={`${item.color} h-full rounded-full ${item.bar}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {/* MANAGE LIST */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-sm font-bold text-brand-text mb-2 block uppercase tracking-wide">Your Broadcasts</h3>
            {deals.slice(0, 3).map(deal => (
              <div key={deal.id} className="bg-brand-surface border border-brand-border rounded-xl p-4 flex gap-4 items-center">
                <div className="text-4xl bg-brand-bg3 p-2 rounded-xl border border-brand-border flex-shrink-0">
                  {deal.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-brand-text truncate mb-1">{deal.title}</h4>
                  <p className="text-[10px] text-brand-text3 uppercase font-semibold">
                    {deal.cat} • -{deal.disc}% Off • {deal.orig} Rs
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] bg-brand-green/12 text-brand-green font-bold py-0.5 px-2 rounded">
                      👍 {deal.worthit}% Appraised
                    </span>
                    <span className="text-[9px] text-brand-text3">
                      👥 {deal.sightingsCount} sightings
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                  <span className="text-[8px] bg-brand-accent text-white font-extrabold px-1.5 py-0.5 rounded uppercase">
                    LIVE
                  </span>
                  <button 
                    onClick={() => onPauseDeal(deal.id)}
                    className="bg-brand-surface2 border border-brand-border text-brand-accent font-semibold text-[10px] py-1 px-2.5 rounded hover:bg-brand-surface3 cursor-pointer mt-1"
                  >
                    Pause
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CREATE OFFER FORM PANEL */}
          <div className="lg:col-span-6 bg-brand-surface border border-brand-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-1.5 mb-1">
              <PlusCircle className="w-5 h-5 text-brand-accent" />
              <h3 className="text-sm font-extrabold text-brand-text uppercase font-syne">Create Hyperlocal Offer</h3>
            </div>

            {postSuccess && (
              <div className="p-3 bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs rounded-xl text-center font-bold">
                ✓ Deal broadcasted to neighborhood scouts successfully! Pending review within 2hrs.
              </div>
            )}

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide mb-1.5 block">Deal Offer Title</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 50% Off all Espresso Drinks!"
                  className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2 text-xs text-brand-text outline-none focus:border-brand-accent placeholder:text-brand-text3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide mb-1.5 block">Original Price (Rs)</label>
                  <input 
                    type="number" 
                    value={formOriginal}
                    onChange={(e) => setFormOriginal(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2 text-xs text-brand-text outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide mb-1.5 block">Discount %</label>
                  <input 
                    type="number" 
                    value={formDiscount}
                    onChange={(e) => setFormDiscount(e.target.value)}
                    placeholder="30"
                    className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2 text-xs text-brand-text outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide mb-1.5 block">Category Filter</label>
                <select 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2 text-xs text-brand-text outline-none focus:border-brand-accent"
                >
                  <option value="food">🍽️ Food & Drinks</option>
                  <option value="fashion">🛍️ Fashion & Outlets</option>
                  <option value="electronics">📱 Electronics & Accessories</option>
                  <option value="beauty">💇‍♀️ Beauty & Hair Glows</option>
                  <option value="sports">🏋️‍♂️ Gym & Athletic Equipment</option>
                  <option value="home">🛋️ Home & Plants Decor</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-brand-text3 font-bold uppercase tracking-wide mb-1.5 block">Details Description</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Items or services included, dine-in restriction details..."
                  className="w-full bg-brand-bg3 border border-brand-border rounded-xl px-4 py-2 text-xs text-brand-text h-20 resize-none outline-none focus:border-brand-accent placeholder:text-brand-text3"
                />
              </div>

              <div className="flex items-center gap-2 py-1">
                <button
                  type="button"
                  onClick={() => setFormFlash(!formFlash)}
                  className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${
                    formFlash ? 'bg-brand-accent' : 'bg-brand-border'
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    formFlash ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
                <span className="text-xs text-brand-text2 font-semibold">Enable Flash Deal Glow (Broadcaster Ticker)</span>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-brand-accent to-brand-accent2 text-white font-bold text-sm py-3.5 rounded-xl hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/15"
              >
                Broadcast Active Neighborhood Feed Deal
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-brand-text flex items-center gap-1.5 leading-none">
                <BarChart className="w-4 h-4 text-brand-blue" /> Consumer Reach History (Last 7 Days)
              </h3>
              <p className="text-[10px] text-brand-text3 mt-1 uppercase font-semibold">Broadcasting response by day</p>
            </div>

            {/* SEVEN DAY GRAPH */}
            <div className="flex items-end gap-3 h-40 pt-2 select-none">
              {[62, 45, 80, 58, 88, 95, 72].map((height, idx) => {
                const label = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx];
                const isPeak = height >= 85;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 pointer-events-none ${
                        isPeak ? 'bg-brand-green' : 'bg-brand-green/25'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-brand-text2 font-bold uppercase mt-2">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
              <span className="text-xs text-brand-text3 block mb-1">Engaged Day</span>
              <div className="text-xl font-bold text-brand-green">Saturday</div>
              <span className="text-[10px] text-brand-text2 mt-1 block">Peak engagement at 6:00-9:00 PM</span>
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
              <span className="text-xs text-brand-text3 block mb-1">Average App Dwell</span>
              <div className="text-xl font-bold text-brand-blue">3.2 Seconds</div>
              <span className="text-[10px] text-brand-text2 mt-1 block">Per layout card view</span>
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4">
              <span className="text-xs text-brand-text3 block mb-1">Route Conversions</span>
              <div className="text-xl font-bold text-brand-amber">11.4 %</div>
              <span className="text-[10px] text-brand-text2 mt-1 block">Routes matched to merchant clicks</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {/* CATEGORY TRENDS PROGRESS LIST */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-brand-text leading-none">Neighborhood Category Trends</h3>
              <p className="text-[10px] text-brand-text3 mt-1 uppercase font-semibold">User categories search ratio in Gulberg III</p>
            </div>

            <div className="space-y-4 pt-1">
              {[
                { label: 'Food & Drinks', value: 78, color: 'bg-brand-green' },
                { label: 'Fashion Outlets', value: 62, color: 'bg-brand-pink' },
                { label: 'Electronics', value: 55, color: 'bg-brand-blue' },
                { label: 'Beauty Salon Services', value: 41, color: 'bg-brand-purple' },
                { label: 'Gym/Membership', value: 28, color: 'bg-brand-amber' }
              ].map((trend, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[10px] text-brand-text3 font-extrabold w-4">{idx + 1}</span>
                  <span className="text-xs font-semibold text-brand-text w-32 truncate">{trend.label}</span>
                  <div className="flex-1 bg-brand-bg3 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${trend.color}`} style={{ width: `${trend.value}%` }} />
                  </div>
                  <span className="text-xs text-brand-text2 font-bold w-10 text-right">{trend.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* SIMULATED COMPETITORS */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-brand-text leading-none">Competitor Activity Status</h3>
              <p className="text-[10px] text-brand-text3 mt-1 uppercase font-semibold">Anonymized nearby merchants</p>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Competitor Boutique A', distance: '120m', dealsCount: 5, avgDisc: 38, active: true },
                { name: 'Competitor Bistro B', distance: '400m', dealsCount: 2, avgDisc: 25, active: false },
                { name: 'Competitor Salon C', distance: '850m', dealsCount: 8, avgDisc: 45, active: true }
              ].map((co, idx) => (
                <div key={idx} className="p-3 bg-brand-bg3 rounded-xl border border-brand-border flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-brand-text">{co.name} <span className="text-[9px] text-brand-text3">({co.distance})</span></h4>
                    <p className="text-[10px] text-brand-text2 mt-1">{co.dealsCount} active offerings • Average {co.avgDisc}% OFF</p>
                  </div>
                  <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-md ${
                    co.active ? 'bg-brand-green/12 text-brand-green' : 'bg-brand-surface3 text-brand-text2'
                  }`}>
                    {co.active ? 'ACTIVE' : 'QUIET'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'occupancy' && (
        <div className="max-w-xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-sm font-bold text-brand-text flex items-center gap-1.5 leading-none">
              <Activity className="w-4 h-4 text-brand-accent animate-pulse" /> Live Store Occupancy Signals
            </h3>
            <p className="text-xs text-brand-text2 mt-1">
              Select verified attributes to display live markers on your deal listings. Highlighting table availabilities or short queues dramatically boosts impulse visits.
            </p>
          </div>

          <div className="space-y-3">
            {occupancySignals.map((o) => (
              <div key={o.id} className="bg-brand-surface border border-brand-border rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="text-2xl bg-brand-bg3 p-1.5 rounded-lg border border-brand-border flex-shrink-0">
                  {o.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-brand-text">{o.label}</h4>
                  <p className="text-[10px] text-brand-text2 mt-0.5 leading-snug">{o.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleOccupancy(o.id)}
                  className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer flex-shrink-0 ${
                    o.active ? 'bg-brand-accent' : 'bg-brand-border'
                  }`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    o.active ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs rounded-xl flex items-start gap-2.5">
            <span className="text-lg">💡</span>
            <p className="leading-relaxed">
              <strong>Merchant Insight:</strong> Lahore retail outlets utilizing active queue and stock notifications report a **2.4x average gain** in off-peak customer drop-ins.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
