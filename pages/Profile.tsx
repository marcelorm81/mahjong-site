import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Page } from '../types';

// ── Local assets ──────────────────────────────────────────────────────────────
const imgJenny      = '/assets/profile-jenny.webp';
const imgBusy       = '/assets/profile-busy.webp';
const imgBubbleTea  = '/assets/profile-bubbletea.webp';
const imgLight      = '/assets/profile-light.svg';
const imgShadow     = '/assets/profile-shadow.svg';
const imgAddMore    = '/assets/profile-add-more.svg';
const imgSelector   = '/assets/profile-selector.svg';
const imgArrowLeft  = '/assets/profile-arrow-left.svg';
const imgArrowRight = '/assets/profile-arrow-right.svg';

// ── Types ─────────────────────────────────────────────────────────────────────
type ProfileTab = 'Character' | 'Table Cloths' | 'Background';

interface CharacterCard {
  id: string;
  name: string;
  img: string;
  owned: boolean;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const CHARACTERS: CharacterCard[] = [
  { id: 'jenny',      name: 'Jenny Kong',      img: imgJenny,     owned: true  },
  { id: 'busy',       name: '"Busy"ness Man',  img: imgBusy,      owned: true  },
  { id: 'bubbletea',  name: 'Bubble Tea Girl', img: imgBubbleTea, owned: true  },
  { id: 'add1',       name: 'Add more',        img: '',           owned: false },
  { id: 'add2',       name: 'Add more',        img: '',           owned: false },
  { id: 'add3',       name: 'Add more',        img: '',           owned: false },
];

const STATS = [
  { label: 'Total Hands',    value: '1,500'  },
  { label: 'Hands Won',      value: '850'    },
  { label: 'Tournament Won', value: '500'    },
  { label: 'Win Rate',       value: '66.67%' },
];

const TABS: ProfileTab[] = ['Character', 'Table Cloths', 'Background'];

// ── Shared styles ─────────────────────────────────────────────────────────────
const glassWindow: React.CSSProperties = {
  background: 'linear-gradient(167deg, rgba(50,0,0,0.55) 3%, rgba(80,0,0,0.3) 83%)',
  backdropFilter: 'blur(5px)',
};

// ── Sub-components ────────────────────────────────────────────────────────────

/** Character card in the 3×2 grid */
const CharCard: React.FC<{
  char: CharacterCard;
  selected: boolean;
  onClick: () => void;
  onGoToShop?: () => void;
  mobile?: boolean;
}> = ({ char, selected, onClick, onGoToShop, mobile }) => {
  const isAdd = !char.owned;

  return (
    <button
      onClick={isAdd ? onGoToShop : onClick}
      className={`relative flex flex-col items-center overflow-hidden rounded-lg transition-all
        ${mobile ? 'gap-2 px-2 py-3' : 'gap-2 px-2 py-3'}
        ${selected
          ? 'border-4 border-white bg-white/10'
          : 'border border-white/50 bg-white/10'
        }
      `}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      {isAdd ? (
        <>
          {/* Plus icon */}
          <div className={`flex items-center justify-center ${mobile ? 'w-12 h-12' : 'w-14 h-14'}`}>
            <img src={imgAddMore} alt="Add more" className="w-full h-full object-contain" />
          </div>
          <p className={`text-white font-semibold text-center ${mobile ? 'text-xs' : 'text-sm'}`}>
            Add more
          </p>
        </>
      ) : (
        <>
          {/* Character image */}
          <div className={`relative overflow-hidden ${mobile ? 'w-12 h-12' : 'w-[88px] h-[88px]'}`}>
            <img
              src={char.img}
              alt={char.name}
              className="absolute inset-0 w-full object-cover object-top"
              style={{ height: '150%', top: '-2%' }}
            />
          </div>
          <p className={`text-white font-semibold text-center leading-tight ${mobile ? 'text-xs' : 'text-sm'}`}>
            {char.name}
          </p>
        </>
      )}
    </button>
  );
};

/** Tab button */
const TabBtn: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  mobile?: boolean;
}> = ({ label, active, onClick, mobile }) => (
  <button
    onClick={onClick}
    className={`relative flex-1 font-semibold uppercase tracking-wide transition-all rounded-tl-xl rounded-tr-xl
      ${mobile ? 'py-2 text-[11px]' : 'py-3 text-base'}
      ${active
        ? 'bg-gradient-to-b from-[#d00501] to-[#8c0000] text-white shadow-[inset_0px_2px_4px_rgba(255,255,255,0.25)]'
        : 'bg-gradient-to-b from-[#500000] to-[#620000] text-white/50 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.25)]'
      }`}
    style={{ backdropFilter: 'blur(5px)' }}
  >
    {label}
  </button>
);

/** Stats panel */
const StatsPanel: React.FC<{ mobile?: boolean }> = ({ mobile }) => (
  <div
    className="rounded-xl border border-white/60 p-3"
    style={glassWindow}
  >
    <p className={`text-white font-semibold mb-2 ${mobile ? 'text-sm' : 'text-base'}`}>STATS</p>
    <div
      className="rounded-md overflow-hidden shadow-[inset_-1px_1px_2px_rgba(0,0,0,0.25)]"
      style={{ backdropFilter: 'blur(5px)', background: '#620000' }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`flex items-center justify-between px-3 text-white
            ${mobile ? 'py-1.5 text-xs' : 'py-1.5 text-sm'}
            ${i < STATS.length - 1 ? 'border-b border-white/10' : ''}
          `}
        >
          <span className="font-medium">{s.label}</span>
          <span className="font-semibold">{s.value}</span>
        </div>
      ))}
    </div>
  </div>
);

/** Shared progress bar track with inner shadow + dark empty area */
const ProgressTrack: React.FC<{
  pct: number;
  fillColor: string;
  trackColor: string;
  height: number;
  delay?: number;
}> = ({ pct, fillColor, trackColor, height, delay = 0.3 }) => (
  <div
    className="w-full rounded-full overflow-hidden relative"
    style={{
      height,
      background: trackColor,
      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.55), inset 0 1px 3px rgba(0,0,0,0.4)',
    }}
  >
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
      className="h-full rounded-full relative overflow-hidden"
      style={{ background: fillColor }}
    >
      {/* Shine highlight */}
      <div
        className="absolute inset-x-0 top-0 rounded-full"
        style={{
          height: '55%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
    </motion.div>
  </div>
);

/** Level + XP bars — equal width, side by side */
const LevelBars: React.FC<{ user: User; mobile?: boolean }> = ({ user, mobile }) => {
  const xpPct = Math.round((user.xp / user.maxXp) * 100);
  const barH = mobile ? 13 : 16;
  return (
    <div className="flex gap-3 w-full">
      {/* LEFT: Level bar — equal flex-1 */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <span className={`text-white/60 font-medium ${mobile ? 'text-[10px]' : 'text-xs'}`}>Level</span>
          <span className={`text-white font-bold ${mobile ? 'text-xs' : 'text-sm'}`}>lv.{user.level}</span>
        </div>
        <ProgressTrack
          pct={54}
          fillColor="linear-gradient(90deg, #e6a23c, #ffc300)"
          trackColor="#2a0000"
          height={barH}
          delay={0.3}
        />
      </div>

      {/* RIGHT: XP bar — equal flex-1, topbar icon + beige track */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <span className={`text-white/60 font-medium ${mobile ? 'text-[10px]' : 'text-xs'}`}>XP</span>
          <span className={`text-white font-bold ${mobile ? 'text-xs' : 'text-sm'}`}>{user.xp.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <img
            src="/assets/topbar-xp.webp"
            alt="XP"
            className="object-contain relative z-10 flex-shrink-0"
            style={{ width: barH + 6, height: barH + 6, marginRight: -(barH / 2) }}
          />
          {/* Beige track with inner shadow */}
          <div
            className="flex-1 rounded-r-[5px] flex flex-col justify-center py-[3px] relative overflow-hidden"
            style={{
              height: barH,
              background: '#ffeabd',
              boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.25)',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
              className="h-full rounded-r-[3px] relative overflow-hidden"
              style={{ background: '#ffc300' }}
            >
              <div
                className="absolute inset-x-0 top-0 rounded-r-[2px]"
                style={{
                  height: '55%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)',
                  filter: 'blur(0.5px)',
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
interface ProfileProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  onNavigate: (page: Page) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onNavigate }) => {
  const [activeTab, setActiveTab]     = useState<ProfileTab>('Character');
  const [selectedChar, setSelectedChar] = useState('jenny');

  const ownedChars = CHARACTERS.filter(c => c.owned);
  const activeCharObj = CHARACTERS.find(c => c.id === selectedChar) ?? CHARACTERS[0];

  const handleCardClick = (char: CharacterCard) => {
    if (!char.owned) return;
    setSelectedChar(char.id);
    // Update the top-bar avatar to the selected character image
    onUpdateUser({ avatarUrl: char.img });
  };

  return (
    <>
      {/* ───────────────────────── DESKTOP ───────────────────────────── */}
      <div className="hidden md:flex w-full max-w-[1400px] mx-auto px-6 pb-6 gap-0 items-start">

        {/* Left: full-height character display — takes ~45% so the character is big */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative w-[45%] xl:w-[48%] shrink-0 flex flex-col items-center justify-end pb-8"
          style={{ minHeight: 'calc(100vh - 210px)' }}
        >
          {/* Character image — fills the bulk of the left panel */}
          <div className="relative z-10 flex-1 w-full flex items-end justify-center" style={{ minHeight: 380 }}>
            <img
              src={activeCharObj.img}
              alt={activeCharObj.name}
              className="w-full max-w-[340px] xl:max-w-[400px] h-auto object-contain object-bottom drop-shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 280px)' }}
            />
            {/* Shadow under character */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-10 pointer-events-none">
              <img
                src={imgShadow}
                alt=""
                className="w-full h-full object-contain opacity-50"
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* Arrow buttons */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => {
              const idx = ownedChars.findIndex(c => c.id === selectedChar);
              const prev = ownedChars[(idx - 1 + ownedChars.length) % ownedChars.length];
              setSelectedChar(prev.id);
              onUpdateUser({ avatarUrl: prev.img });
            }}
          >
            <img src={imgArrowLeft} alt="Previous" className="w-full h-full object-contain" onError={e => { e.currentTarget.style.display = 'none'; }} />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => {
              const idx = ownedChars.findIndex(c => c.id === selectedChar);
              const next = ownedChars[(idx + 1) % ownedChars.length];
              setSelectedChar(next.id);
              onUpdateUser({ avatarUrl: next.img });
            }}
          >
            <img src={imgArrowRight} alt="Next" className="w-full h-full object-contain" onError={e => { e.currentTarget.style.display = 'none'; }} />
          </button>

          {/* Selector dots */}
          <div className="relative z-10 flex gap-2 mb-5 mt-3">
            {ownedChars.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedChar(c.id); onUpdateUser({ avatarUrl: c.img }); }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${selectedChar === c.id ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>

          {/* MY STYLE button */}
          <button
            className="relative z-10 overflow-hidden text-white uppercase px-10 py-4 rounded-[6px] border border-white transition-opacity hover:opacity-80 active:scale-95"
            style={{
              fontFamily: "'Teachers', sans-serif",
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: '-0.6px',
              width: 204,
            }}
          >
            {/* Radial gradient fill — white from center, 20% opacity */}
            <span
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
              }}
            />
            <span className="relative z-10">My Style</span>
          </button>
        </motion.div>

        {/* Right: info + tabs + grid + stats — compact column */}
        <div className="flex-1 flex flex-col gap-2.5 pt-6 pl-6 xl:pl-8 min-w-0">

          {/* Username + tagline + bars */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/60 p-3 flex flex-col gap-3"
            style={glassWindow}
          >
            {/* Username in Clash Display */}
            <div>
              <h2 className="font-['Clash_Display',sans-serif] text-white font-semibold leading-[0.85] text-4xl tracking-tight">
                {user.username}
              </h2>
              <p className="text-white/60 font-medium text-sm mt-0.5">Player Tagline</p>
            </div>
            <LevelBars user={user} />
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1.5">
            {TABS.map(t => (
              <TabBtn key={t} label={t} active={activeTab === t} onClick={() => setActiveTab(t)} />
            ))}
          </div>

          {/* Tab content: Character grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-white/60 overflow-hidden p-3"
              style={glassWindow}
            >
              {activeTab === 'Character' ? (
                <div className="grid grid-cols-3 gap-3">
                  {CHARACTERS.map(char => (
                    <CharCard
                      key={char.id}
                      char={char}
                      selected={selectedChar === char.id}
                      onClick={() => handleCardClick(char)}
                      onGoToShop={() => onNavigate(Page.SHOP)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-white/30 text-sm uppercase tracking-wider">
                  Coming Soon
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <StatsPanel />
          </motion.div>

        </div>
      </div>

      {/* ───────────────────────── MOBILE ────────────────────────────── */}
      <div className="md:hidden flex flex-col items-center w-full px-4 pb-4">

        {/* Character full-body (centered) */}
        <div className="relative w-full flex justify-center" style={{ height: 280 }}>
          <img
            src={activeCharObj.img}
            alt={activeCharObj.name}
            className="relative z-10 h-full w-auto object-contain drop-shadow-2xl"
          />

          {/* Shadow */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-8 z-10 pointer-events-none">
            <img
              src={imgShadow}
              alt=""
              className="w-full h-full object-contain opacity-50"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Selector dots */}
        <div className="flex gap-2 mt-2 mb-3">
          {ownedChars.map(c => (
            <button
              key={c.id}
              onClick={() => { setSelectedChar(c.id); onUpdateUser({ avatarUrl: c.img }); }}
              className={`w-2 h-2 rounded-full transition-all ${selectedChar === c.id ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>

        {/* MY STYLE button */}
        <button
          className="relative overflow-hidden text-white uppercase py-3 px-8 rounded-[6px] border border-white mb-4 transition-opacity hover:opacity-80 active:scale-95"
          style={{
            fontFamily: "'Teachers', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: '-0.6px',
            minWidth: 160,
          }}
        >
          {/* Radial gradient fill */}
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          <span className="relative z-10">My Style</span>
        </button>

        {/* Username info glass panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-xl border border-white p-4 flex flex-col gap-3 mb-3"
          style={glassWindow}
        >
          <div>
            <h2 className="font-['Clash_Display',sans-serif] text-white font-semibold text-3xl leading-[0.85] tracking-tight">
              {user.username}
            </h2>
            <p className="text-white/70 text-sm mt-1">Player tagline</p>
          </div>
          <LevelBars user={user} mobile />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1.5 w-full mb-0">
          {TABS.map(t => (
            <TabBtn key={t} label={t} active={activeTab === t} onClick={() => setActiveTab(t)} mobile />
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full rounded-b-xl border border-t-0 border-white overflow-hidden p-3 mb-3"
            style={glassWindow}
          >
            {activeTab === 'Character' ? (
              <div className="grid grid-cols-3 gap-2">
                {CHARACTERS.map(char => (
                  <CharCard
                    key={char.id}
                    char={char}
                    selected={selectedChar === char.id}
                    onClick={() => handleCardClick(char)}
                    onGoToShop={() => onNavigate(Page.SHOP)}
                    mobile
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-28 text-white/30 text-xs uppercase tracking-wider">
                Coming Soon
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <StatsPanel mobile />
        </motion.div>

        <div className="h-6" />
      </div>
    </>
  );
};
