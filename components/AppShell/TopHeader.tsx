import React from 'react';
import { User } from '../../types';

/* ── Local assets (downloaded from Figma) ────────────────────────────── */
const iconFriends  = '/assets/topbar-friends.png';
const iconTable    = '/assets/topbar-table.png';
const iconCalendar = '/assets/topbar-calendar.png';
const iconXP       = '/assets/topbar-xp.png';
const iconCoin     = '/assets/topbar-coin.png';
const iconSettings = '/assets/topbar-settings.png';
const iconAdd      = '/assets/topbar-add.svg';

/* ── Mock stats (until real data is wired) ───────────────────────────── */
const STATS = [
  { icon: iconFriends, value: 200, label: 'friends' },
  { icon: iconTable,   value: 60,  label: 'tables' },
  { icon: iconCalendar,value: 30,  label: 'checkins' },
];

/* ── Helpers ─────────────────────────────────────────────────────────── */
const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + 'B';
  if (num >= 1_000_000)     return Math.floor(num / 1_000_000) + 'M';
  if (num >= 1_000)         return Math.floor(num / 1_000) + 'K';
  return num.toString();
};

/* ── Sub-components ──────────────────────────────────────────────────── */

/** Stat chip: icon + number */
const StatChip: React.FC<{ icon: string; value: number; className?: string }> = ({ icon, value, className = '' }) => (
  <div className={`flex items-center gap-0.5 ${className}`}>
    <img src={icon} alt="" className="w-5 h-5 md:w-[36px] md:h-[36px] object-contain" />
    <span className="text-white font-semibold text-xs md:text-lg tracking-tight min-w-[30px] md:min-w-[54px] text-center">
      {value}
    </span>
  </div>
);

/** XP progress bar (golden) */
const XPBar: React.FC<{ pct?: number }> = ({ pct = 50 }) => (
  <div className="flex items-center">
    <img src={iconXP} alt="XP" className="w-5 h-5 md:w-[31px] md:h-[30px] object-contain relative z-10 -mr-1" />
    {/* Outer beige track */}
    <div className="h-[15px] md:h-[18px] w-[80px] md:w-[115px] bg-[#ffeabd] rounded-r-[5px] flex flex-col justify-center py-[3px]">
      {/* Inner gold fill */}
      <div
        className="h-[10px] md:h-[12px] bg-[#ffc300] rounded-r-[3px] flex flex-col justify-center px-[2px] py-[3px]"
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
const CoinPill: React.FC<{ coins: number }> = ({ coins }) => (
  <div className="relative flex items-center">
    {/* Coin icon overlapping the pill */}
    <img src={iconCoin} alt="Coins" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] object-contain relative z-10" />
    {/* Dark pill */}
    <div
      className="flex items-center gap-1 h-[19px] md:h-[31px] pl-3 md:pl-4 pr-0.5 md:pr-1 -ml-3 md:-ml-4
                 rounded-r-[5px] relative overflow-hidden"
      style={{
        background: 'linear-gradient(to top, rgba(80,0,0,0.7), rgba(98,0,0,0.7))',
      }}
    >
      <span className="text-white font-medium text-xs md:text-lg tracking-tight text-center min-w-[60px] md:min-w-[100px]">
        {formatNumber(coins)}
      </span>
      <img src={iconAdd} alt="+" className="w-[15px] h-[15px] md:w-[23px] md:h-[23px] object-contain" />
      {/* Inner shadow */}
      <div className="absolute inset-0 pointer-events-none rounded-[inherit]"
        style={{ boxShadow: 'inset -2.85px 2.85px 5.7px rgba(0,0,0,0.25)' }}
      />
    </div>
  </div>
);

/* ── Main Component ──────────────────────────────────────────────────── */
interface TopHeaderProps {
  user: User;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ user, onOpenSettings, onOpenProfile }) => {
  const xpPct = Math.round((user.xp / user.maxXp) * 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm pointer-events-auto">
      {/* ─── Desktop: single row ─── */}
      <div className="hidden md:flex items-center justify-between h-[70px] px-6 lg:px-12">
        {/* Left: Profile */}
        <div className="flex items-center gap-5 cursor-pointer group" onClick={onOpenProfile}>
          <div className="w-[60px] h-[60px] rounded-[3px] overflow-hidden border border-[#831A1A] bg-brand-dark shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
            <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover object-top" style={{ objectPosition: 'center 8%' }} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white font-semibold text-xl tracking-tight leading-none">{user.username}</span>
            <span className="text-white/80 font-medium text-sm tracking-tight">lv.{user.level}</span>
          </div>
        </div>

        {/* Right: stats, XP, coins, settings */}
        <div className="flex items-center gap-6">
          {/* Stats: friends, tables, checkins */}
          {STATS.map((s) => (
            <StatChip key={s.label} icon={s.icon} value={s.value} />
          ))}

          {/* XP Bar */}
          <XPBar pct={xpPct} />

          {/* Coin pill */}
          <CoinPill coins={user.coins} />

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors active:scale-95 flex-shrink-0"
          >
            <img src={iconSettings} alt="Settings" className="w-9 h-9 object-contain" />
          </button>
        </div>
      </div>

      {/* ─── Mobile: two rows ─── */}
      <div className="flex md:hidden flex-col gap-2.5 px-2.5 py-2.5">
        {/* Row 1: Profile + Coin + Settings */}
        <div className="flex items-center justify-between">
          {/* Profile */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={onOpenProfile}>
            <div className="w-[50px] h-[50px] rounded-[3px] overflow-hidden border border-[#831A1A] bg-brand-dark shadow-lg flex-shrink-0">
              <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" style={{ objectPosition: 'center 8%' }} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-white font-semibold text-lg tracking-tight leading-none">{user.username}</span>
              <span className="text-white/80 font-semibold text-sm tracking-tight">lv.{user.level}</span>
            </div>
          </div>

          {/* Coin + Settings */}
          <div className="flex items-center gap-5">
            <CoinPill coins={user.coins} />
            <button
              onClick={onOpenSettings}
              className="w-[25px] h-[25px] flex items-center justify-center flex-shrink-0"
            >
              <img src={iconSettings} alt="Settings" className="w-[25px] h-[25px] object-contain" />
            </button>
          </div>
        </div>

        {/* Row 2: XP bar left, stats right */}
        <div className="flex items-center justify-between">
          {/* XP Bar */}
          <XPBar pct={xpPct} />

          {/* Stats row */}
          <div className="flex items-center gap-2.5">
            {STATS.map((s) => (
              <StatChip key={s.label} icon={s.icon} value={s.value} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
