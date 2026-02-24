import { TableItem, User } from './types';

export const MOCK_USER: User = {
  username: "PlayerOne",
  level: 42,
  avatarUrl: "https://raw.githubusercontent.com/marcelorm81/Mahjongtest/afb595361641b3816c22a8d3890663558894a17a/img%20-%20avatar.png",
  coins: 125000,
  gems: 450,
  streakDays: 5,
  xp: 3400,
  maxXp: 5000
};

export const MOCK_TABLES: TableItem[] = [
  {
    id: '1',
    title: 'Bamboo Grove',
    imageUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/03197f34f198d9fcbc52c8a1433b1916b9f04cf8/basic.webp',
    winAmount: 5000,
    entryCost: 2000,
    playersCurrent: 2,
    playersMax: 3,
    isLocked: false,
    isComingSoon: false,
    category: 'REGULAR'
  },
  {
    id: '2',
    title: 'Food Market',
    imageUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/3149293f5ccaff19c1a4dd0c716c9a8080a8c46f/foodmarket.webp',
    videoUrl: '/assets/market.webm',
    winAmount: 10000,
    entryCost: 4000,
    playersCurrent: 1,
    playersMax: 3,
    isLocked: false,
    isComingSoon: false,
    category: 'REGULAR'
  },
  {
    id: '6',
    title: 'Beach Paradise',
    imageUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/5c6ac17796838551de30890843f764167f6964a3/beach.webp',
    videoUrl: '/assets/beach1.webm',
    winAmount: 2000,
    entryCost: 500,
    playersCurrent: 1,
    playersMax: 3,
    isLocked: false,
    isComingSoon: false,
    category: 'REGULAR'
  },
  {
    id: '4',
    title: 'Square',
    imageUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/5c6ac17796838551de30890843f764167f6964a3/square_new.webp',
    winAmount: 100000,
    entryCost: 50000,
    playersCurrent: 0,
    playersMax: 3,
    isLocked: false,
    isComingSoon: false,
    category: 'ELITE'
  },
  {
    id: '3',
    title: 'Neon Nights',
    imageUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/5c6ac17796838551de30890843f764167f6964a3/disco.webp',
    winAmount: 25000,
    entryCost: 10000,
    playersCurrent: 3,
    playersMax: 3,
    isLocked: false,
    isComingSoon: false,
    category: 'REGULAR'
  },
  {
    id: '5',
    title: 'Lost City',
    imageUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/5c6ac17796838551de30890843f764167f6964a3/lostcity.webp',
    winAmount: 500000,
    entryCost: 200000,
    playersCurrent: 0,
    playersMax: 3,
    isLocked: false,
    isComingSoon: true,
    category: 'ELITE'
  }
];