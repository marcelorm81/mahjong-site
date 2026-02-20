import React from 'react';
import { User, Page } from '../../types';

/* ── Local assets (downloaded from Figma) ────────────────────────────── */
const iconFriends  = '/assets/topbar-friends.png';
const iconTable    = '/assets/topbar-table.png';
const iconCalendar = '/assets/topbar-calendar.png';
const iconXP       = '/assets/topbar-xp.png';
const iconCoin     = '/assets/topbar-coin.png';
const iconSettings = '/assets/topbar-settings.png';
const iconAdd      = '/assets/topbar-add.svg';

/* ── Helpers ─────────────────────────────────────────────────────────── */
const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + 'B';
  if (num >= 1_000_000)     return Math.floor(num / 1_000_000) + 'M';
  if (num >= 1_000)         return Math.floor(num / 1_000) + 'K';
  return num.toString();
};

/* ── Sub-components ──────────────────────────────────────────────────── */

/** Clickable stat chip: icon + number — navigates to a page on tap */
const StatChip: React.FC<{
  icon: string;
  value: number;
  page: Page;
  onNavigate: (page: Page) => void;
  className?: string;
}> = ({ icon, value, page, onNavigate, className = '' }) => (
  <button
    onClick={() => onNavigate(page)}
    className={`flex items-center gap-0.5 hover:opacity-80 active:scale-95 transition-all ${className}`}
    aria-label={`Go to ${page}`}
  >
    <img src={icon} alt="" className="w-5 h-5 md:w-[36px] md:h-[36px] short:w-5 short:h-5 object-contain" />
    <span className="text-white font-semibold text-xs md:text-lg short:text-xs tracking-tight min-w-[30px] md:min-w-[54px] short:min-w-[30px] text-center">
      {value}
    </span>
  </button>
);

/** XP progress bar (golden) */
const XPBar: React.FC<{ pct?: number }> = ({ pct = 50 }) => (
  <div className="flex items-center">
    <img src={iconXP} alt="XP" className="w-5 h-5 md:w-[31px] md:h-[30px] short:w-5 short:h-5 object-contain relative z-10 -mr-1" />
    {/* Outer beige track */}
    <div className="h-[15px] md:h-[18px] short:h-[15px] w-[80px] md:w-[115px] short:w-[80px] bg-[#ffeabd] rounded-r-[5px] flex flex-col justify-center py-[3px]">
      {/* Inner gold fill */}
      <div
        className="h-[10px] md:h-[12px] short:h-[10px] bg-[#ffc300] rounded-r-[3px] flex flex-col justify-center px-[2px] py-[3px]"
        style={{ width: `${pct}%` }}
      >
        {/* Highlight shine */}
        <div className="w-full h-[8px] rounded-r-[2px]"
          style={{
            background: 'linear-gradient(180deg, white 18.75%, #ffd986 55%)',
            filter: 'blur(0.8px)',
          }}
        />
      </div>
    </div>
  </div>
);

/** Coin balance pill with add button */
const CoinPill: React.FC<{ coins: number; onAddCoins?: () => void }> = ({ coins, onAddCoins }) => (
  <div className="relative flex items-center">
    {/* Coin icon overlapping the pill */}
    <img src={iconCoin} alt="Coins" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] short:w-[30px] short:h-[30px] object-contain relative z-10" />
    {/* Dark pill */}
    <div
      className="flex items-center gap-1 h-[19px] md:h-[31px] short:h-[19px] pl-3 md:pl-4 short:pl-3 pr-0.5 md:pr-1 short:pr-0.5 -ml-3 md:-ml-4 short:-ml-3
                 rounded-r-[5px] relative overflow-hidden"
      style={{
        background: 'linear-gradient(to top, rgba(80,0,0,0.7), rgba(98,0,0,0.7))',
      }}
    >
      <span className="text-white font-medium text-xs md:text-lg short:text-xs tracking-tight text-center min-w-[60px] md:min-w-[100px] short:min-w-[60px]">
        {formatNumber(coins)}
      </span>
      <button
        onClick={onAddCoins}
        className="flex items-center justify-center active:scale-90 transition-transform relative z-10"
        aria-label="Buy Star Points"
      >
        <img src={iconAdd} alt="+" className="w-[15px] h-[15px] md:w-[23px] md:h-[23px] short:w-[15px] short:h-[15px] object-contain" />
      </button>
      {/* Inner shadow */}
      <div className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{ boxShadow: 'inset -2.85px 2.85px 5.7px rgba(0,0,0,0.25)' }}
      />
    </div>
  </div>
);

/* ── Stat definitions: icon, value, destination page ─────────────────── */
const STATS = [
  { icon: iconFriends,  value: 200, page: Page.FRIENDS,    label: 'friends'  },
  { icon: iconTable,    value: 60,  page: Page.LOBBY,      label: 'tables'   },
  { icon: iconCalendar, value: 30,  page: Page.TOURNAMENT, label: 'checkins' },
];

/* ── Main Component ──────────────────────────────────────────────────── */
interface TopHeaderProps {
  user: User;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onAddCoins?: () => void;
  onNavigate: (page: Page) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  onOpenSettings,
  onOpenProfile,
  onAddCoins,
  onNavigate,
}) => {
  const xpPct = Math.round((user.xp / user.maxXp) * 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm pointer-events-auto">
      {/* ─── Desktop: single row ─── */}
      <div className="hidden md:flex items-center justify-between h-[70px] short:h-[44px] px-6 lg:px-12 short:px-4">
        {/* Left: Profile */}
        <div className="flex items-center gap-5 short:gap-3 cursor-pointer group" onClick={onOpenProfile}>
          <div className="w-[60px] h-[60px] short:w-[36px] short:h-[36px] rounded-[3px] overflow-hidden border border-[#831A1A] bg-brand-dark shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover object-top" style={{ objectPosition: 'center 8%' }} />
          </div>
          <div className="flex flex-col gap-1 short:gap-0">
            <span className="text-white font-semibold text-xl short:text-sm tracking-tight leading-none">{user.username}</span>
            <span className="text-white/80 font-medium text-sm short:text-xs tracking-tight">lv.{user.level}</span>
          </div>
        </div>

        {/* Right: stats, XP, coins, settings */}
        <div className="flex items-center gap-6 short:gap-3">
          {/* Clickable stats */}
          {STATS.map((s) => (
            <StatChip key={s.label} icon={s.icon} value={s.value} page={s.page} onNavigate={onNavigate} />
          ))}

          {/* XP Bar */}
          <XPBar pct={xpPct} />

          {/* Coin pill */}
          <CoinPill coins={user.coins} onAddCoins={onAddCoins} />

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 short:w-6 short:h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors active:scale-95 flex-shrink-0"
          >
            <img src={iconSettings} alt="Settings" className="w-9 h-9 short:w-6 short:h-6 object-contain" />
          </button>
        </div>
      </div>

      {/* ─── Mobile: two rows (compact on small portrait / short landscape) ─── */}
      <div className="flex md:hidden flex-col gap-2.5 compact:gap-1 short:gap-0.5 px-2.5 py-2.5 compact:py-1.5 short:py-1">
        {/* Row 1: Profile + Coin + Settings */}
        <div className="flex items-center justify-between">
          {/* Profile */}
          <div className="flex items-center gap-4 compact:gap-2 short:gap-2 cursor-pointer" onClick={onOpenProfile}>
            <div className="w-[50px] h-[50px] compact:w-[36px] compact:h-[36px] short:w-[30px] short:h-[30px] rounded-[3px] overflow-hidden border border-[#831A1A] bg-brand-dark shadow-lg flex-shrink-0">
              <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" style={{ objectPosition: 'center 8%' }} />
            </div>
            <div className="flex flex-col gap-1 compact:gap-0 short:gap-0">
              <span className="text-white font-semibold text-lg compact:text-sm short:text-xs tracking-tight leading-none">{user.username}</span>
              <span className="text-white/80 font-semibold text-sm compact:text-xs short:text-[10px] tracking-tight">lv.{user.level}</span>
            </div>
          </div>

          {/* Coin + Settings */}
          <div className="flex items-center gap-5 compact:gap-3 short:gap-2">
            <CoinPill coins={user.coins} onAddCoins={onAddCoins} />
            <button
              onClick={onOpenSettings}
              className="w-[25px] h-[25px] compact:w-[20px] compact:h-[20px] short:w-[18px] short:h-[18px] flex items-center justify-center flex-shrink-0"
            >
              <img src={iconSettings} alt="Settings" className="w-[25px] h-[25px] compact:w-[20px] compact:h-[20px] short:w-[18px] short:h-[18px] object-contain" />
            </button>
          </div>
        </div>

        {/* Row 2: XP bar left, clickable stats right */}
        <div className="flex items-center justify-between">
          {/* XP Bar */}
          <XPBar pct={xpPct} />

          {/* Clickable stats row */}
          <div className="flex items-center gap-2.5 short:gap-1.5">
            {STATS.map((s) => (
              <StatChip key={s.label} icon={s.icon} value={s.value} page={s.page} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
