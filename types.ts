export enum Page {
  INTRO = 'INTRO',
  LOGIN = 'LOGIN',
  TUTORIAL = 'TUTORIAL',
  LOBBY = 'LOBBY',
  TOURNAMENT = 'TOURNAMENT',
  HISTORY = 'HISTORY',
  FRIENDS = 'FRIENDS',
  SHOP = 'SHOP',
  RANK = 'RANK',
  PROFILE = 'PROFILE',
  GAME = 'GAME',
  REWARD = 'REWARD',
  STREAK = 'STREAK',
}

export interface User {
  username: string;
  level: number;
  avatarUrl: string;
  coins: number;
  gems: number;
  streakDays: number;
  xp: number;
  maxXp: number;
}

export interface TableItem {
  id: string;
  title: string;
  imageUrl: string;
  winAmount: number;
  entryCost: number;
  playersCurrent: number;
  playersMax: number;
  isLocked: boolean;
  isComingSoon: boolean;
  category: 'REGULAR' | 'ELITE';
}

export interface NavItem {
  id: Page;
  label: string;
  iconUrl: string;
}