/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { NotificationItem } from '../types';
import { CheckCheck, MessageSquare, AlertTriangle, Zap, Flame, Compass } from 'lucide-react';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationsPage({
  notifications,
  onMarkRead,
  onMarkAllRead
}: NotificationsPageProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'deals' | 'expiry' | 'sightings' | 'route'>('all');

  const filteredNotifs = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'deals', label: 'New Deals' },
    { id: 'expiry', label: 'Expiring soon' },
    { id: 'sightings', label: 'Sightings' },
    { id: 'route', label: 'Route Alerts' },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto max-w-2xl mx-auto space-y-6 select-none h-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border pb-4 gap-3">
        <div>
          <h1 className="font-syne font-extrabold text-2xl text-brand-text flex items-center gap-1.5 leading-none">
            📣 Active Radar Feeds
          </h1>
          <p className="text-xs text-brand-text2 mt-1">Real-time alerts, sightings updates, and time-sensitive warnings near you.</p>
        </div>
        <button
          onClick={onMarkAllRead}
          className="text-xs bg-brand-surface border border-brand-border hover:border-brand-accent/50 text-brand-text rounded-xl py-2 px-4 cursor-pointer flex items-center gap-1.5 select-none duration-150 active:scale-95"
        >
          <CheckCheck className="w-3.5 h-3.5 text-brand-accent" /> Mark All Read
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 border-b border-brand-border overflow-x-auto select-none pl-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`capitalize py-2 px-3 rounded-lg font-medium text-xs border transition-all cursor-pointer ${
              activeTab === t.id 
                ? 'bg-brand-surface2 text-brand-text border-brand-border' 
                : 'border-transparent text-brand-text2 hover:bg-brand-surface hover:text-brand-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ALERTS FEED CONTAINER */}
      <div className="space-y-2">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => onMarkRead(notif.id)}
              className={`p-4 rounded-xl border transition-all flex gap-4 cursor-pointer select-none items-start relative ${
                notif.read 
                  ? 'bg-brand-surface/40 border-brand-border/60 hover:border-brand-border2' 
                  : 'bg-brand-accent/4 border-brand-accent/35 border-l-3 border-l-brand-accent hover:bg-brand-accent/6'
              }`}
            >
              {/* ACCENT GRAPHICS ROUND ICON */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: notif.bg }}
              >
                {notif.icon}
              </div>

              <div className="flex-1 min-w-0 pr-6">
                <h4 className="text-sm font-bold text-brand-text leading-tight mb-1">{notif.title}</h4>
                <p className="text-xs text-brand-text2 leading-relaxed">{notif.desc}</p>
                <span className="text-[10px] text-brand-text3 font-medium block mt-2">{notif.time}</span>
              </div>

              {/* UNREAD BLUE TARGET SPHERE */}
              {!notif.read && (
                <div className="absolute top-4 right-4 w-2 w-2 h-2 rounded-full bg-brand-accent animate-ping" />
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center space-y-3">
            <span className="text-4xl block opacity-30">🔔</span>
            <h3 className="text-sm font-bold text-brand-text3 uppercase tracking-wide">Radar currently sterile</h3>
            <p className="text-xs text-brand-text3 max-w-sm mx-auto">You have no unread notifications or expiring route warnings in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
