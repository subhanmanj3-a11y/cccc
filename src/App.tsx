/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  INITIAL_DEALS, 
  INITIAL_NOTIFS, 
  INITIAL_SIGHTINGS, 
  INITIAL_LOCS, 
  INITIAL_ROUTES 
} from './data';
import { Deal, NotificationItem, Sighting, SavedLocation, CommuteRoute } from './types';
import Sidebar from './components/Sidebar';
import DealFeed from './components/DealFeed';
import MapPage from './components/MapPage';
import RouteAlerts from './components/RouteAlerts';
import SavedPage from './components/SavedPage';
import NotificationsPage from './components/NotificationsPage';
import SurpriseMe from './components/SurpriseMe';
import BusinessDashboard from './components/BusinessDashboard';
import VerificationWizard from './components/VerificationWizard';
import ProfilePage from './components/ProfilePage';
import DealDetailModal from './components/DealDetailModal';
import { db, auth, isConfigured } from './firebase';

// Simple Firestore integration if available
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';

export default function App() {
  const [activePage, setActivePage] = useState<string>('feed');
  const [deals, setDeals] = useState<Deal[]>(() => {
    const local = localStorage.getItem('neardis_deals');
    return local ? JSON.parse(local) : INITIAL_DEALS;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const local = localStorage.getItem('neardis_notifs');
    return local ? JSON.parse(local) : INITIAL_NOTIFS;
  });
  const [sightings, setSightings] = useState<Sighting[]>(() => {
    const local = localStorage.getItem('neardis_sightings');
    return local ? JSON.parse(local) : INITIAL_SIGHTINGS;
  });
  const [routes, setRoutes] = useState<CommuteRoute[]>(() => {
    const local = localStorage.getItem('neardis_routes');
    return local ? JSON.parse(local) : INITIAL_ROUTES;
  });
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    const local = localStorage.getItem('neardis_saved_locations');
    return local ? JSON.parse(local) : INITIAL_LOCS;
  });

  const [savedDealsIds, setSavedDealsIds] = useState<Set<string>>(() => {
    const local = localStorage.getItem('neardis_saved_ids');
    return local ? new Set(JSON.parse(local)) : new Set(['2', '4', '7']);
  });

  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>('ahsan_khan_scout_3');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('neardis_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('neardis_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('neardis_sightings', JSON.stringify(sightings));
  }, [sightings]);

  useEffect(() => {
    localStorage.setItem('neardis_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('neardis_saved_locations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  useEffect(() => {
    localStorage.setItem('neardis_saved_ids', JSON.stringify(Array.from(savedDealsIds)));
  }, [savedDealsIds]);

  // Global Countdown Tick every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setDeals(prevDeals => 
        prevDeals.map(d => {
          if (d.expiry <= 0) return d;
          return { ...d, expiry: d.expiry - 1 };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- CONTROLLER HANDLERS ---
  const handleToggleSaveDeal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedDealsIds(prev => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
      } else {
        copy.add(id);
        // Dispatch alert confirmation notification
        const deal = deals.find(d => d.id === id);
        if (deal) {
          const newNotif: NotificationItem = {
            id: Date.now().toString(),
            type: 'deals',
            icon: '📁',
            bg: 'rgba(77,159,255,0.15)',
            title: 'Deal saved to bookmarks',
            desc: `"${deal.title}" was added to your profile collections folder.`,
            time: 'Just now',
            read: false
          };
          setNotifications(prevNotifs => [newNotif, ...prevNotifs]);
        }
      }
      return copy;
    });
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleLocationActive = (id: string) => {
    setSavedLocations(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
  };

  const handleAddRoute = (routeData: any) => {
    const newRoute: CommuteRoute = {
      id: Date.now().toString(),
      from: routeData.from,
      to: routeData.to,
      active: true,
      dealsCount: Math.floor(Math.random() * 8) + 1,
      alertRadius: routeData.alertRadius,
      startTime: routeData.startTime,
      endTime: routeData.endTime,
      categories: routeData.categories
    };
    setRoutes(prev => [newRoute, ...prev]);
  };

  const handleAddSighting = (dealId: string, text: string) => {
    const deal = deals.find(d => d.id === dealId);
    const newSighting: Sighting = {
      id: Date.now().toString(),
      dealId,
      user: '@you (Scout)',
      text,
      time: 'Just now',
      emoji: deal ? deal.emoji : '⚡'
    };
    setSightings(prev => [newSighting, ...prev]);

    // Update sightings Count
    setDeals(prevDeals => 
      prevDeals.map(d => d.id === dealId ? { ...d, sightingsCount: d.sightingsCount + 1 } : d)
    );
  };

  const handleAddDeal = (dealData: any) => {
    const id = (deals.length + 1).toString();
    const newDeal: Deal = {
      id,
      shop: 'Your Store',
      emoji: dealData.emoji,
      cat: dealData.cat,
      tag: `tag-${dealData.cat}`,
      title: dealData.title,
      disc: dealData.disc,
      orig: dealData.orig,
      price: dealData.price,
      dist: 0.1, // Posted deal is from local merchant, hence 100m
      expiry: 86400, // 24 hours
      flash: dealData.flash,
      rating: 5.0,
      worthit: 100,
      sightingsCount: 0,
      desc: dealData.desc,
      lat: 44,
      lng: 32,
      saved: false
    };

    setDeals(prev => [newDeal, ...prev]);
  };

  const handlePauseDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  const selectedDeal = deals.find(d => d.id === selectedDealId);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex bg-brand-bg min-h-screen text-brand-text select-none">
      
      {/* SIDEBAR NAVIGATION PANEL (DESKTOP OR TOUCH BOTTOM BAR) */}
      <Sidebar 
        activePage={activePage} 
        onPageChange={setActivePage} 
        unreadCount={unreadNotifsCount}
        userId={userId}
        onLoginRequest={() => setUserId(userId ? null : 'ahsan_khan_scout_3')}
      />

      {/* CORE WORKSPACE SCREEN */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
        
        {/* FLASHING BROADCASTING TEXT TICKER LOOPS */}
        <div className="bg-brand-accent/5 border-b border-brand-accent/15 py-2 px-4 flex items-center gap-4 select-none flex-shrink-0 overflow-hidden text-xs">
          <div className="font-syne font-extrabold text-brand-accent tracking-wider uppercase text-[9px] flex items-center gap-1.5 flex-shrink-0 select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            FLASH RADAR
          </div>

          <div className="flex-1 overflow-hidden relative h-5 flex items-center">
            <div className="animate-ticker">
              {deals.filter(d => d.flash).map(deal => (
                <span key={deal.id} className="text-brand-text2 font-medium">
                  🔥 <strong className="text-brand-text font-bold">{deal.shop}</strong>: <span className="text-brand-accent font-extrabold">-{deal.disc}% OFF</span> • {deal.title} • {(deal.dist * 1000).toFixed(0)}m away
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CONTAINER ROUTING WINDOWS */}
        <div className="flex-1 overflow-hidden bg-brand-bg relative">
          {activePage === 'feed' && (
            <DealFeed 
              deals={deals}
              sightings={sightings}
              onSelectDeal={setSelectedDealId}
              savedDealsSet={savedDealsIds}
              onToggleSaveDeal={handleToggleSaveDeal}
              onPostNewDealClick={() => setActivePage('business')}
              onSurpriseMeClick={() => setActivePage('surprise')}
            />
          )}

          {activePage === 'map' && (
            <MapPage 
              deals={deals}
              onSelectDeal={setSelectedDealId}
            />
          )}

          {activePage === 'flash' && (
            <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 h-full scrollbar-thin">
              <div className="border-b border-brand-border pb-4 flex items-center gap-2 select-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                </span>
                <h1 className="font-syne font-extrabold text-2xl text-brand-text leading-none uppercase tracking-wide">🔥 Live Flash Grid</h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {deals.filter(d => d.flash).map(deal => (
                  <div
                    key={deal.id}
                    onClick={() => setSelectedDealId(deal.id)}
                    className="bg-brand-surface border border-brand-accent/50 glow-pulsing rounded-2xl p-4 cursor-pointer relative flex flex-col justify-between hover:-translate-y-1 transition-all"
                  >
                    <span className="absolute top-3 left-3 bg-brand-accent text-white text-[9px] font-bold px-2.5 py-1 rounded">
                      🔥 FLASH
                    </span>

                    <div className="text-5xl text-center py-6 bg-brand-bg3/30 rounded-xl border border-brand-border">
                      {deal.emoji}
                    </div>

                    <div className="space-y-4 pt-4">
                      <div>
                        <span className="text-[10px] text-brand-text3 font-extrabold uppercase">{deal.shop}</span>
                        <h4 className="text-sm font-bold text-brand-text truncate block mt-0.5">{deal.title}</h4>
                      </div>

                      <div className="flex justify-between items-end border-t border-brand-border pt-3">
                        <div>
                          <span className="text-[10px] text-brand-text3 line-through">Rs {deal.orig}</span>
                          <div className="text-base font-extrabold text-brand-accent leading-none">Rs {deal.price}</div>
                        </div>
                        <span className="bg-brand-green/12 text-brand-green text-[9px] font-extrabold px-2 py-1 rounded">
                          👍 {deal.worthit}% OK
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePage === 'route' && (
            <RouteAlerts 
              deals={deals}
              routes={routes}
              onAddRoute={handleAddRoute}
              savedDealsSet={savedDealsIds}
              onToggleSaveDeal={handleToggleSaveDeal}
              onSelectDeal={setSelectedDealId}
            />
          )}

          {activePage === 'bookmarks' && (
            <SavedPage 
              deals={deals}
              savedDealsSet={savedDealsIds}
              onToggleSaveDeal={handleToggleSaveDeal}
              onSelectDeal={setSelectedDealId}
            />
          )}

          {activePage === 'notifications' && (
            <NotificationsPage 
              notifications={notifications}
              onMarkRead={handleMarkRead}
              onMarkAllRead={handleMarkAllRead}
            />
          )}

          {activePage === 'surprise' && (
            <SurpriseMe 
              deals={deals}
              onSelectDeal={setSelectedDealId}
            />
          )}

          {activePage === 'business' && (
            <BusinessDashboard 
              deals={deals}
              onAddDeal={handleAddDeal}
              onPauseDeal={handlePauseDeal}
            />
          )}

          {activePage === 'verify' && (
            <VerificationWizard />
          )}

          {activePage === 'profile' && (
            <ProfilePage 
              deals={deals}
              savedDealsSet={savedDealsIds}
              onToggleSaveDeal={handleToggleSaveDeal}
              onSelectDeal={setSelectedDealId}
              savedLocations={savedLocations}
              onToggleLocationActive={handleToggleLocationActive}
            />
          )}
        </div>
      </div>

      {/* DETAIL DIALOG SPEC SHEET MODAL */}
      {selectedDeal && (
        <DealDetailModal 
          deal={selectedDeal}
          isSaved={savedDealsIds.has(selectedDeal.id)}
          onToggleSave={handleToggleSaveDeal}
          onClose={() => setSelectedDealId(null)}
          onAddSighting={handleAddSighting}
        />
      )}
    </div>
  );
}
