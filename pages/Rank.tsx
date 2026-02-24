import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ── Local avatar assets (public/assets/) ─────────────────────────────────────
const avatarUncleCai     = "/assets/avatar-uncle-cai.webp";
const avatarAnneWan      = "/assets/avatar-anne-wan.webp";
const avatarBangJohnsson = "/assets/avatar-bang-johnsson.webp";
const avatarMrsChen      = "/assets/avatar-mrs-chen.webp";
const avatarPonPon       = "/assets/avatar-pon-pon.webp";
const avatarEchoTong     = "/assets/avatar-echo-tong.webp";
const avatarTonyKong     = "/assets/avatar-tony-kong.webp";
const avatarMasterZendo  = "/assets/avatar-master-zendo.webp";
const avatarMrWon        = "/assets/avatar-mr-won.webp";
const avatarRacheal      = "/assets/avatar-racheal.webp";

// ── Data ─────────────────────────────────────────────────────────────────────
interface RankEntry {
  rank: number;
  username: string;
  level: number;
  score: number;
  avatarUrl: string;
}

const MOCK_RANKINGS: RankEntry[] = [
  { rank: 1,  username: 'Uncle Cai',      level: 50, score: 2000000, avatarUrl: avatarUncleCai },
  { rank: 2,  username: 'Anne Wan',       level: 50, score: 1630000, avatarUrl: avatarAnneWan },
  { rank: 3,  username: 'Bang Johnsson',  level: 50, score: 1230000, avatarUrl: avatarBangJohnsson },
  { rank: 4,  username: 'Mrs Chen',       level: 50, score: 1100000, avatarUrl: avatarTonyKong },
  { rank: 5,  username: 'Pon Pon',        level: 50, score: 980000,  avatarUrl: avatarPonPon },
  { rank: 6,  username: 'Echo T\u00f3ng', level: 50, score: 965000,  avatarUrl: avatarEchoTong },
  { rank: 7,  username: 'Tony Kong',      level: 50, score: 900000,  avatarUrl: avatarTonyKong },
  { rank: 8,  username: 'Master Zendo',   level: 50, score: 870000,  avatarUrl: avatarAnneWan },
  { rank: 9,  username: 'Mr. Won',        level: 50, score: 840000,  avatarUrl: avatarBangJohnsson },
  { rank: 10, username: 'Racheal',        level: 50, score: 720000,  avatarUrl: avatarRacheal },
];

// Top 3 coloured borders
const RANK_BORDER_COLORS: Record<number, string> = {
  1: '#ffc300',  // gold
  2: '#e6e6e6',  // silver
  3: '#e06118',  // bronze
};

const formatScore = (n: number) => n.toLocaleString();

type Tab = 'BANG_BANG' | 'BANG_BANG_2';

const TAB_LABELS: Record<Tab, string> = {
  BANG_BANG:   'Bang Bang Tables',
  BANG_BANG_2: 'Bang Bang Tables',
};

// ── Glass window style ───────────────────────────────────────────────────────
const glassWindow: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
  backdropFilter: 'blur(12px)',
};

// ── Inner shadow applied to each row ─────────────────────────────────────────
const rowInsetShadow: React.CSSProperties = {
  boxShadow: 'inset -2px 2px 4px rgba(0,0,0,0.25)',
};

// ── Component ────────────────────────────────────────────────────────────────
export const Rank: React.FC = () => {
  const [tab, setTab] = useState<Tab>('BANG_BANG');

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 short:py-2">

      {/* ── Title ── */}
      <h1 className="text-center text-white font-bold uppercase tracking-widest text-lg md:text-xl short:text-base mb-6 short:mb-3">
        RANK
      </h1>

      {/* ── Tab Selector ── */}
      <div className="flex justify-center mb-6 short:mb-3">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex bg-black/60 backdrop-blur-md rounded-full p-1 relative"
        >
          {/* Sliding active pill with red gradient */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full"
            style={{
              background: 'linear-gradient(180deg, #D00501 0%, #8B0000 100%)',
            }}
            layoutId="rank-tab-pill"
            animate={{
              left: tab === 'BANG_BANG' ? 4 : '50%',
              width: 'calc(50% - 4px)',
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          />
          {(['BANG_BANG', 'BANG_BANG_2'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative z-10 px-5 md:px-6 py-1.5 rounded-full font-bold text-[11px] md:text-sm uppercase tracking-wide transition-colors whitespace-nowrap ${
                tab === t ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ── Leaderboard Glass Container ── */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-white/30 overflow-hidden"
        style={glassWindow}
      >
        <div className="flex flex-col gap-2 p-3 md:p-4">
          {MOCK_RANKINGS.map((entry, i) => {
            const isTop3 = entry.rank <= 3;
            const borderColor = RANK_BORDER_COLORS[entry.rank];

            return (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 md:gap-4 rounded-lg px-3 md:px-4 py-2.5 md:py-3 ${
                  isTop3 ? '' : 'bg-[#620000]'
                }`}
                style={{
                  ...(isTop3
                    ? {
                        border: `2px solid ${borderColor}`,
                        backgroundColor: 'rgba(98, 0, 0, 0.6)',
                      }
                    : {}),
                  ...rowInsetShadow,
                }}
              >
                {/* Rank number */}
                <span className="shrink-0 w-10 md:w-12 text-white/70 font-bold text-xs md:text-sm text-center">
                  No. {entry.rank}
                </span>

                {/* Avatar */}
                <div className="shrink-0 w-[48px] h-[48px] md:w-[72px] md:h-[72px] rounded-[3px] overflow-hidden bg-[#620000]/60">
                  <img
                    src={entry.avatarUrl}
                    alt={entry.username}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Name + Level */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm md:text-base truncate">
                    {entry.username}
                  </p>
                  <p className="text-white/60 text-xs md:text-sm">
                    lv.{entry.level}
                  </p>
                </div>

                {/* Score */}
                <span className="shrink-0 text-white font-bold text-sm md:text-base tabular-nums">
                  {formatScore(entry.score)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="h-6" />
    </div>
  );
};
