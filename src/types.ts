/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryType = 'all' | 'food' | 'fashion' | 'electronics' | 'beauty' | 'sports' | 'home';

export interface Deal {
  id: string;
  shop: string;
  emoji: string;
  cat: CategoryType;
  tag: string;
  title: string;
  disc: number;
  dist: number; // in km
  expiry: number; // in seconds remaining
  flash: boolean;
  rating: number;
  worthit: number; // % rating
  sightingsCount: number;
  desc: string;
  lat: number;
  lng: number;
  saved: boolean;
  orig: number;
  price: number;
}

export interface Sighting {
  id: string;
  dealId: string;
  user: string;
  text: string;
  time: string;
  emoji: string;
}

export interface NotificationItem {
  id: string;
  type: 'deals' | 'expiry' | 'sightings' | 'route';
  icon: string;
  bg: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export interface SavedLocation {
  id: string;
  name: string;
  icon: string;
  address: string;
  active: boolean;
}

export interface CommuteRoute {
  id: string;
  from: string;
  to: string;
  active: boolean;
  dealsCount: number;
  alertRadius: number;
  startTime: string;
  endTime: string;
  categories: string[];
}

export interface BusinessStats {
  views: number;
  redemptions: number;
  rating: number;
  activeDeals: number;
}
