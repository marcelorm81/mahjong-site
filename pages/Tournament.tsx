import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ── Local tournament assets ──────────────────────────────────────────────────
const imgTurbo      = '/assets/tournament-turbo.png';
const imgMarathon   = '/assets/tournament-marathon.png';
const imgWarrior    = '/assets/tournament-warrior.png';
const imgComingSoon = '/assets/tournament-comingsoon.png';
const imgCoin       = '/assets/tournament-coin.png';
const imgPrize      = '/assets/tournament-prize.svg';
const imgClock      = '/assets/tournament-clock.svg';
const imgBadge      = '/assets/tournament-badge.svg';

// ── Data ─────────────────────────────────────────────────────────────────────
interface TournamentItem {
  id: string;
  title: string[];           // multi-line title (Clash Display)
  description: string;
  prize: number;
  entryFee: number;
  timeLabel: string;         // "Time Left" or "Starting In"
  initialSeconds: number;    // countdown seed in seconds (0 = no countdown)
  registeredPlayers: number;
  maxPlayers: number;
  imageUrl: string;
  status: 'live' | 'upcoming' | 'comingsoon';
  gradient: string;          // title gradient CSS
}

const TOURNAMENTS: TournamentItem[] = [
  {
    id: 'turbo',
    title: ['THE TURBO', 'HOUR'],
    description: 'One-Hour Tournament – "The Turbo Hour" A fast and intense 60-minute tournament.',
    prize: 200000,
    entryFee: 2000,
    timeLabel: 'Time Left:',
    initialSeconds: 30,         // 00:00:30
    registeredPlayers: 15,
    maxPlayers: 20,
    imageUrl: imgTurbo,
    status: 'live',
    gradient: 'linear-gradient(180deg, #d6ff07 0%, #ffffff 100%)',
  },
  {
    id: 'marathon',
    title: ['THE ALL-DAY', 'MARATHON'],
    description: 'A 24-hour tournament players can join anytime.',
    prize: 800000,
    entryFee: 2000,
    timeLabel: 'Time Left:',
    initialSeconds: 22 * 3600 + 10 * 60 + 30,  // 22:10:30
    registeredPlayers: 15,
    maxPlayers: 20,
    imageUrl: imgMarathon,
    status: 'upcoming',
    gradient: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)',
  },
  {
    id: 'warrior',
    title: ['THE WEEK-', 'LONG', 'WARRIOR'],
    description: 'A 24-hour tournament players can join anytime.',
    prize: 800000,
    entryFee: 2000,
    timeLabel: 'Starting In:',
    initialSeconds: 48 * 3600,  // 48:00:00
    registeredPlayers: 15,
    maxPlayers: 20,
    imageUrl: imgWarrior,
    status: 'upcoming',
    gradient: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)',
  },
  {
    id: 'soon',
    title: ['COMING', 'SOON'],
    description: 'The next battle is being prepared. Dates and information coming soon.',
    prize: 0,
    entryFee: 2000,
    timeLabel: '',
    initialSeconds: 0,
    registeredPlayers: 0,
    maxPlayers: 20,
    imageUrl: imgComingSoon,
    status: 'comingsoon',
    gradient: 'linear-gradient(180deg, #ffffff 0%, #ffffff 100%)',
  },
];

const formatPrize = (n: number) => n === 0 ? '—' : n.toLocaleString();

// ── Countdown hook ────────────────────────────────────────────────────────────
const useCountdown = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const ref = useRef(initialSeconds);

  useEffect(() => {
    if (initialSeconds <= 0) return;
    ref.current = initialSeconds;
    setSeconds(initialSeconds);
    const id = setInterval(() => {
      ref.current = Math.max(0, ref.current - 1);
      setSeconds(ref.current);
    }, 1000);
    return () => clearInterval(id);
  }, [initialSeconds]);

  // Format as HH:MM:SS (supports > 24h)
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  const display = `${pad(h)}:${pad(m)}:${pad(s)}`;

  return { seconds, display };
};

// ── Status Badge ─────────────────────────────────────────────────────────────
const LiveBadge: React.FC = () => (
  <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20">
    <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
      <div className="w-2.5 h-2.5 rounded-full bg-[#D00501] animate-pulse" />
      <span className="text-black font-bold text-xs uppercase tracking-wide">Live Now</span>
    </div>
  </div>
);

// ── Small Icon helpers ───────────────────────────────────────────────────────
const PrizeIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <img src={imgPrize} alt="" className="object-contain" style={{ width: size, height: size }} />
);
const ClockIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <img src={imgClock} alt="" className="object-contain" style={{ width: size, height: size }} />
);
const PersonIcon: React.FC<{ size?: number }> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="white">
    <circle cx="7" cy="4" r="3" />
    <path d="M1 13c0-3.3 2.7-6 6-6s6 2.7 6 6" />
  </svg>
);

// ── Tournament Card ──────────────────────────────────────────────────────────
const TournamentCard: React.FC<{ t: TournamentItem; index: number }> = ({ t, index }) => {
  const [joining, setJoining] = useState(false);
  const isComingSoon = t.status === 'comingsoon';
  const isLive = t.status === 'live';
  const { display: timeDisplay } = useCountdown(t.initialSeconds);

  const handleJoin = () => {
    setJoining(true);
    setTimeout(() => setJoining(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`relative rounded-lg overflow-hidden ${isComingSoon ? 'opacity-60' : ''}`}
    >
      {/* ── DESKTOP: CSS Grid — left info panel | right image, both cells share same row height ── */}
      <div
        className="hidden md:grid overflow-hidden rounded-lg"
        style={{ gridTemplateColumns: '42% 1fr', minHeight: 370, gridAutoRows: '1fr' }}
      >
        {/* LEFT: info panel */}
        <div className="flex flex-col gap-5 justify-between py-6 px-7 bg-black/40">
          {/* Title (Clash Display gradient) */}
          <div>
            <h2
              className="uppercase leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 64,
                fontWeight: 700,
                fontStyle: 'normal',
                background: t.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.title.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
            <p className="text-white text-sm mt-3 leading-relaxed max-w-sm">{t.description}</p>
          </div>

          {/* Meta: Prize / Time / Players */}
          {!isComingSoon && (
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Prize</p>
                <div className="flex items-center gap-1.5">
                  <PrizeIcon />
                  <span className="text-white font-bold text-sm">{formatPrize(t.prize)}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">{t.timeLabel}</p>
                <div className="flex items-center gap-1.5">
                  <ClockIcon />
                  <span className="text-white font-bold text-sm tabular-nums">{timeDisplay}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Players:</p>
                <div className="flex items-center gap-1.5">
                  <PersonIcon />
                  <span className="text-white font-bold text-sm">{t.registeredPlayers}/{t.maxPlayers}</span>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          {!isComingSoon ? (
            <div className="flex flex-col gap-3">
              {isLive && (
                <button className="w-full bg-[#4a0000] rounded-md h-[46px] flex items-center justify-center gap-2 shadow-[inset_-3px_3px_7px_rgba(0,0,0,0.25)]">
                  <img src={imgCoin} alt="" className="w-7 h-7 object-contain" />
                  <span className="text-[#e6a23c] font-bold text-base uppercase">CHECK IT OUT</span>
                </button>
              )}
              <button
                onClick={handleJoin}
                className="w-full bg-[#D00501] hover:bg-[#b00401] active:scale-[0.98] transition-all rounded-md h-[46px] flex items-center justify-center gap-4 shadow-[5px_5px_0px_0px_#4a0000]"
              >
                <div className="flex items-center gap-2">
                  <img src={imgCoin} alt="" className="w-7 h-7 object-contain" />
                  <span className="text-white font-semibold text-base">{formatPrize(t.entryFee)}</span>
                </div>
                <span className="text-white font-bold text-base uppercase">
                  {joining ? '✓ Joined!' : 'REGISTER TO JOIN'}
                </span>
              </button>
            </div>
          ) : (
            <button className="w-full bg-[#D00501] hover:bg-[#b00401] active:scale-[0.98] transition-all rounded-md h-[46px] flex items-center justify-center shadow-[5px_5px_0px_0px_#4a0000]">
              <span className="text-white font-bold text-base uppercase">STAY UPDATED</span>
            </button>
          )}
        </div>

        {/* RIGHT: image — fills the grid cell completely */}
        <div className="relative overflow-hidden min-h-0">
          <img
            src={t.imageUrl}
            alt={t.title.join(' ')}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ transform: 'scale(1.18)', transformOrigin: 'center center' }}
          />

          {/* Bottom fade for prize/time overlay */}
          {!isComingSoon && (
            <div className="absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-black/80 to-transparent" />
          )}

          {/* Live glow border */}
          {isLive && (
            <>
              <div className="absolute inset-0 border-[3px] border-white pointer-events-none z-20" />
              <div className="absolute inset-0 border-[3px] border-[#ffc300] blur-[2.5px] pointer-events-none z-20" />
            </>
          )}
          {isLive && <LiveBadge />}

          {/* Coming Soon dark overlay */}
          {isComingSoon && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <p className="uppercase tracking-tight text-white text-4xl" style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700 }}>
                COMING SOON
              </p>
            </div>
          )}

          {/* Prize + Time overlay at image bottom */}
          {!isComingSoon && (
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base uppercase">
                  Tournament Prize{' '}
                  <span className="text-[#aeff00]">{formatPrize(t.prize)}</span>
                </span>
                <img src={imgCoin} alt="" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-white font-bold text-base uppercase tabular-nums">
                {isLive ? 'Time Left' : 'Starting In:'} {timeDisplay}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE: Stacked layout ── */}
      <div className="md:hidden flex flex-col">
        {/* Top: Title + Description + Meta + Buttons */}
        <div className="flex flex-col gap-4 py-4">
          <div>
            <h2
              className="uppercase leading-[0.9] tracking-tight"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontSize: 64,
                fontWeight: 700,
                fontStyle: 'normal',
                background: t.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t.title.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
            <p className="text-white/80 text-sm mt-2 leading-relaxed">{t.description}</p>
          </div>

          {/* Meta row */}
          {!isComingSoon && (
            <div className="flex gap-3 text-xs">
              <div className="flex-1">
                <p className="text-white/50 uppercase tracking-wider text-[10px] mb-0.5">Prize</p>
                <div className="flex items-center gap-1">
                  <PrizeIcon size={12} />
                  <span className="text-white font-bold">{formatPrize(t.prize)}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white/50 uppercase tracking-wider text-[10px] mb-0.5">{t.timeLabel}</p>
                <div className="flex items-center gap-1">
                  <ClockIcon size={12} />
                  <span className="text-white font-bold tabular-nums">{timeDisplay}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white/50 uppercase tracking-wider text-[10px] mb-0.5">Registered Players:</p>
                <div className="flex items-center gap-1">
                  <PersonIcon size={10} />
                  <span className="text-white font-bold">{t.registeredPlayers}/{t.maxPlayers}</span>
                </div>
              </div>
            </div>
          )}

          {/* Button */}
          {!isComingSoon ? (
            <button
              onClick={handleJoin}
              className="w-full bg-[#D00501] hover:bg-[#b00401] active:scale-95 transition-all text-white font-bold uppercase text-sm py-3 rounded-md shadow-[4px_4px_0px_0px_#4a0000] flex items-center justify-center gap-3"
            >
              <div className="flex items-center gap-1.5">
                <img src={imgCoin} alt="" className="w-6 h-6 object-contain" />
                <span className="text-white/80 text-xs tabular-nums">{formatPrize(t.entryFee)}</span>
              </div>
              <span>{joining ? '✓ Joined!' : 'REGISTER TO JOIN'}</span>
            </button>
          ) : (
            <button className="w-full bg-[#D00501] active:scale-95 transition-all text-white font-bold uppercase text-sm py-3 rounded-md shadow-[4px_4px_0px_0px_#4a0000]">
              STAY UPDATED
            </button>
          )}
        </div>

        {/* Bottom: Image */}
        <div className="relative h-52 short:h-40 overflow-hidden rounded-lg">
          <img
            src={t.imageUrl}
            alt={t.title.join(' ')}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ transform: 'scale(1.18)', transformOrigin: 'center center' }}
          />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

          {/* Prize + Time overlay */}
          {!isComingSoon && (
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between z-10 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold uppercase">
                  Prize{' '}
                  <span className="text-[#aeff00]">{formatPrize(t.prize)}</span>
                </span>
                <img src={imgCoin} alt="" className="w-5 h-5 object-contain" />
              </div>
              <span className="text-white font-bold uppercase tabular-nums text-xs">
                {timeDisplay}
              </span>
            </div>
          )}

          {/* Coming Soon overlay */}
          {isComingSoon && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <p className="uppercase text-white text-2xl" style={{ fontFamily: "'Clash Display', sans-serif", fontWeight: 700 }}>
                COMING SOON
              </p>
            </div>
          )}

          {/* Live effects */}
          {isLive && (
            <>
              <div className="absolute inset-0 border-2 border-[#ffc300] rounded-lg opacity-60 pointer-events-none" />
              <LiveBadge />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Tournament Page ─────────────────────────────────────────────────────
export const Tournament: React.FC = () => (
  <div className="w-full max-w-6xl mx-auto px-4 py-6 short:py-2">
    <h1 className="text-center text-white font-bold uppercase tracking-widest text-base md:text-lg short:text-sm mb-6 short:mb-3 opacity-80">
      Tournaments
    </h1>

    <div className="flex flex-col gap-8 md:gap-12">
      {TOURNAMENTS.map((t, i) => (
        <TournamentCard key={t.id} t={t} index={i} />
      ))}
    </div>

    <div className="h-6" />
  </div>
);
