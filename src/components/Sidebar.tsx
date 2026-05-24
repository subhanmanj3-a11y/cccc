/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Compass, 
  Map, 
  Zap, 
  Navigation, 
  Bookmark, 
  Bell, 
  Gift, 
  Briefcase, 
  ShieldCheck, 
  User 
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  unreadCount: number;
  userId: string | null;
  onLoginRequest: () => void;
}

export default function Sidebar({ 
  activePage, 
  onPageChange, 
  unreadCount, 
  userId, 
  onLoginRequest 
}: SidebarProps) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Compass, badge: false },
    { id: 'map', label: 'Map', icon: Map, badge: false },
    { id: 'flash', label: 'Flash', icon: Zap, badge: false },
    { id: 'route', label: 'Route', icon: Navigation, badge: false },
    { id: 'bookmarks', label: 'Saved', icon: Bookmark, badge: false },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: true },
    { id: 'surprise', label: 'Surprise', icon: Gift, badge: false },
    { id: 'business', label: 'Biz', icon: Briefcase, badge: false },
    { id: 'verify', label: 'Verify', icon: ShieldCheck, badge: false },
    { id: 'profile', label: 'Profile', icon: User, badge: false },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col items-center w-20 bg-brand-bg2 border-r border-brand-border py-6 flex-shrink-0 select-none overflow-y-auto z-50 gap-1 h-screen sticky top-0">
        <div 
          onClick={() => onPageChange('feed')}
          className="font-syne font-extrabold text-xl bg-gradient-to-br from-brand-accent to-brand-accent2 bg-clip-text text-transparent mb-6 tracking-tighter cursor-pointer hover:scale-105 transition-transform"
        >
          N
        </div>

        <nav className="flex-1 flex flex-col gap-1 w-full px-2 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`relative group w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-brand-surface2 text-brand-accent' 
                    : 'text-brand-text3 hover:bg-brand-surface hover:text-brand-text'
                } cursor-pointer`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-accent rounded-full ring-2 ring-brand-bg2" />
                )}
                <span className="absolute left-16 bg-brand-surface3 text-brand-text text-[11px] font-medium py-1 px-2.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-xl border border-brand-border whitespace-nowrap z-50">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-2 w-full flex flex-col items-center">
          <div className="w-10 h-0.5 bg-brand-border mb-4" />
          {userId ? (
            <button 
              onClick={() => onPageChange('profile')}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-accent2 flex items-center justify-center font-bold text-xs text-white hover:opacity-90 cursor-pointer shadow-lg"
            >
              AK
            </button>
          ) : (
            <button 
              onClick={onLoginRequest}
              className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center font-bold text-xs text-brand-text hover:border-brand-accent cursor-pointer transition-colors"
              title="Sign In"
            >
              ⚙️
            </button>
          )}
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-bg2/90 backdrop-blur-md border-t border-brand-border px-3 py-1 flex justify-around items-center h-16 z-50 select-none pb-safe">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
                isActive ? 'text-brand-accent' : 'text-brand-text3 hover:text-brand-text2'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.id === 'notifications' && unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-accent rounded-full ring-1 ring-brand-bg2" />
                )}
              </div>
              <span className="text-[9px] font-semibold tracking-wide uppercase">{item.label}</span>
            </button>
          );
        })}
        {/* Profile Button on Mobile Navigation */}
        <button
          onClick={() => onPageChange('profile')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors ${
            activePage === 'profile' || activePage === 'business' || activePage === 'surprise' || activePage === 'verify'
              ? 'text-brand-accent'
              : 'text-brand-text3'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-semibold tracking-wide uppercase">More</span>
        </button>
      </nav>
    </>
  );
}
