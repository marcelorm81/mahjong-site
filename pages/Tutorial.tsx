import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Page } from '../types';
import gsap from 'gsap';
import { TableCard } from '../components/Lobby/TableCard';
import { MOCK_TABLES } from '../constants';

/* ── Default video assets ───────────────────────────────────────────── */
const DEFAULT_VIDEO_DESKTOP = '/assets/waving_loop_desktop.mp4';
const DEFAULT_VIDEO_MOBILE  = '/assets/waving_loop_mobile.mp4';

/* ── Shared tile data (reused by Step3, Step5Kong, Step6Mahjong) ───── */
const MJ_ROW1: [string, string][] = [
  ['/assets/tiles/tile-wind-south.webp', 'Nan'],
  ['/assets/tiles/tile-wind-south.webp', 'Nan'],
  ['/assets/tiles/tile-man-6.webp',      'Man 6'],
  ['/assets/tiles/tile-man-6.webp',      'Man 6'],
  ['/assets/tiles/tile-man-6.webp',      'Man 6'],
  ['/assets/tiles/tile-num-8.webp',      'Pin 8'],
  ['/assets/tiles/tile-num-8.webp',      'Pin 8'],
  ['/assets/tiles/tile-num-8.webp',      'Pin 8'],
];
const MJ_ROW2: [string, string][] = [
  ['/assets/tiles/tile-sou-4.webp', 'Sou 4'],
  ['/assets/tiles/tile-sou-4.webp', 'Sou 4'],
  ['/assets/tiles/tile-sou-4.webp', 'Sou 4'],
  ['/assets/tiles/tile-sou-1.webp', 'Sou 1'],
  ['/assets/tiles/tile-sou-1.webp', 'Sou 1'],
  ['/assets/tiles/tile-sou-1.webp', 'Sou 1'],
];

/* ── Tutorial step data ────────────────────────────────────────────── */
interface TutorialStep {
  text: string[];           // single-phrase step
  phrases?: string[][];     // multi-phrase step: each sub-array = one bubble
  videoDesktop?: string;    // overrides default waving video
  videoMobile?:  string;
  noBubble?: boolean;       // hide chat bubble entirely (celebration step)
}

const STEPS: TutorialStep[] = [
  // Step 0 — Welcome
  { text: ['Welcome to Mahjong Stars!', 'New to here? No worries.'] },
  // Step 1 — Tiles showcase
  {
    phrases: [
      ['Mahjong is played with tiles, not cards.', 'Matching tiles are used to build sets.'],
      ['Bang Bang is the most fun', 'and easiest Mahjong rule to learn.'],
    ],
    text: ['Bang Bang is the most fun', 'and easiest Mahjong rule to learn.'],
    videoDesktop: '/assets/talking_loop_desktop.mp4',
    videoMobile:  '/assets/talking_loop_mobile.mp4',
  },
  // Step 2 — Kong + Mahjong tiles
  {
    text: [
      'You win the game and earn',
      'StarPoints by: Making Kongs',
      'during the hand and going',
      'Mahjong to win the hand!',
    ],
    videoDesktop: '/assets/talking_loop_desktop.mp4',
    videoMobile:  '/assets/talking_loop_mobile.mp4',
  },
  // Step 3 — Table (draw/discard rules)
  {
    phrases: [
      ['Every turn is simple: Draw one tile, Discard one tile. That\'s how the game flows.'],
      ['You cannot take discarded tiles to build sets. You may only take a discard to win (Mahjong). This keeps Bang Bang fast and fair.'],
    ],
    text: ['You cannot take discarded tiles to build sets. You may only take a discard to win (Mahjong). This keeps Bang Bang fast and fair.'],
    videoDesktop: '/assets/talking_loop_desktop.mp4',
    videoMobile:  '/assets/talking_loop_mobile.mp4',
  },
  // Step 4 — Kong scoring (kong + profiles)
  {
    text: [
      'Kongs = Instant StarsPoints',
      'A Kong is four identical tiles.',
      'When you declare a Kong,',
      'StarsPoints are paid immediately',
    ],
    videoDesktop: '/assets/talking_loop_desktop.mp4',
    videoMobile:  '/assets/talking_loop_mobile.mp4',
  },
  // Step 5 — Mahjong winning (mahjong tiles only)
  {
    text: [
      'When your hand is complete press Mahjong to win. Play more, win more, climb the leaderboards!',
    ],
    videoDesktop: '/assets/talking_loop_desktop.mp4',
    videoMobile:  '/assets/talking_loop_mobile.mp4',
  },
  // Step 6 — Celebration (final)
  {
    text: [''],
    noBubble: true,
    videoDesktop: '/assets/jumping_loop_desktop.mp4',
    videoMobile:  '/assets/jumping_loop_mobile.mp4',
  },
];

const TOTAL_STEPS = STEPS.length;

/* ── Mahjong tile image component ───────────────────────────────── */

/** Single tile — renders the Figma-exported asset */
const TileImg: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="mahjong-tile w-[min(36px,7.8vw)] h-[min(48px,10.4vw)] md:w-[66px] md:h-[88px] object-contain drop-shadow"
  />
);

/** Tile with extra className support */
const Tile: React.FC<{ src: string; alt: string; extra?: string }> = ({ src, alt, extra = '' }) => (
  <img src={src} alt={alt}
    className={`mahjong-tile w-[min(36px,7.8vw)] h-[min(48px,10.4vw)] md:w-[66px] md:h-[88px] object-contain drop-shadow ${extra}`} />
);

/** Three-row tile showcase with GSAP stagger animation */
const TileSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const labels   = el.querySelectorAll('.tile-label');
    const row0     = el.querySelectorAll('.tile-row-0 .mahjong-tile');
    const row1     = el.querySelectorAll('.tile-row-1 .mahjong-tile');
    const row2     = el.querySelectorAll('.tile-row-2 .mahjong-tile');
    const allTiles = el.querySelectorAll('.mahjong-tile');

    // Initial hidden state
    gsap.set(labels, { opacity: 0, x: -10 });
    gsap.set(allTiles, { opacity: 0, y: 20, scale: 0.7 });

    // Slower, more graceful animation — gives time for both step-2 sentences
    const tl = gsap.timeline({ delay: 2.0 });

    // Row 0 — Number tiles
    tl.to(labels[0], { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' })
      .to(row0, { opacity: 1, y: 0, scale: 1, duration: 0.40, stagger: 0.14, ease: 'back.out(1.5)' }, '-=0.10')
    // Row 1 — Wind tiles (generous pause between rows)
      .to(labels[1], { opacity: 1, x: 0, duration: 0.30, ease: 'power2.out' }, '+=0.40')
      .to(row1, { opacity: 1, y: 0, scale: 1, duration: 0.40, stagger: 0.16, ease: 'back.out(1.5)' }, '-=0.10')
    // Row 2 — Dragon tiles
      .to(labels[2], { opacity: 1, x: 0, duration: 0.30, ease: 'power2.out' }, '+=0.40')
      .to(row2, { opacity: 1, y: 0, scale: 1, duration: 0.40, stagger: 0.18, ease: 'back.out(1.5)' }, '-=0.10');

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={sectionRef} className="select-none pointer-events-none">
      {/* Number Tiles */}
      <p className="tile-label text-white font-semibold text-[11px] md:text-[15px] mb-[4px] md:mb-[6px] drop-shadow-md">
        Number Tiles
      </p>
      <div className="tile-row-0 flex gap-[1px] md:gap-[2px] mb-[10px] md:mb-[16px]">
        {[1,2,3,4,5].map(n => (
          <TileImg key={n} src={`/assets/tiles/tile-num-${n}.webp`} alt={`Number ${n}`} />
        ))}
        <TileImg key="5d" src="/assets/tiles/tile-num-5-dora.webp" alt="Number 5 Dora" />
        {[6,7,8,9].map(n => (
          <TileImg key={n} src={`/assets/tiles/tile-num-${n}.webp`} alt={`Number ${n}`} />
        ))}
      </div>

      {/* Wind Tiles */}
      <p className="tile-label text-white font-semibold text-[11px] md:text-[15px] mb-[4px] md:mb-[6px] drop-shadow-md">
        Wind Tiles
      </p>
      <div className="tile-row-1 flex gap-[1px] md:gap-[2px] mb-[10px] md:mb-[16px]">
        {(['east','south','west','north'] as const).map(d => (
          <TileImg key={d} src={`/assets/tiles/tile-wind-${d}.webp`} alt={`Wind ${d}`} />
        ))}
      </div>

      {/* Dragon Tiles */}
      <p className="tile-label text-white font-semibold text-[11px] md:text-[15px] mb-[4px] md:mb-[6px] drop-shadow-md">
        Dragon Tiles
      </p>
      <div className="tile-row-2 flex gap-[1px] md:gap-[2px]">
        {(['zhong','fa','bai'] as const).map(d => (
          <TileImg key={d} src={`/assets/tiles/tile-dragon-${d}.webp`} alt={`Dragon ${d}`} />
        ))}
      </div>
    </div>
  );
};

/* ── Dynamic bubble SVG path builder ─────────────────────────────── */
const buildBubblePath = (W: number, bodyH: number): string => {
  if (W < 60 || bodyH < 50) return '';

  const s = 2;      // stroke inset
  const r = 22;     // corner radius
  const k = 12.15;  // bezier handle length for r=22

  const edgeY = bodyH - s; // body-path bottom

  // Tail anchors — fixed distance from the right edge (matches original)
  const tailRX = W - 51.5;
  const tailLX = W - 88.85;

  // If bubble is too narrow for the tail, draw a plain rounded rect
  if (tailLX <= s + r) {
    return [
      `M${s+r} ${s}`, `H${W-s-r}`,
      `C${W-s-r+k} ${s} ${W-s} ${s+r-k} ${W-s} ${s+r}`,
      `V${edgeY-r}`,
      `C${W-s} ${edgeY-r+k} ${W-s-r+k} ${edgeY} ${W-s-r} ${edgeY}`,
      `H${s+r}`,
      `C${s+r-k} ${edgeY} ${s} ${edgeY-r+k} ${s} ${edgeY-r}`,
      `V${s+r}`,
      `C${s} ${s+r-k} ${s+r-k} ${s} ${s+r} ${s}`, 'Z',
    ].join('');
  }

  return [
    `M${s+r} ${s}`, `H${W-s-r}`,
    `C${W-s-r+k} ${s} ${W-s} ${s+r-k} ${W-s} ${s+r}`,
    `V${edgeY-r}`,
    `C${W-s} ${edgeY-r+k} ${W-s-r+k} ${edgeY} ${W-s-r} ${edgeY}`,
    `H${tailRX}`,
    `C${tailRX-3.314} ${edgeY} ${tailRX-6} ${edgeY+2.686} ${tailRX-6} ${edgeY+6}`,
    `V${edgeY+24.651}`,
    `L${tailLX+4.556} ${edgeY+1.686}`,
    `C${tailLX+3.287} ${edgeY+0.598} ${tailLX+1.671} ${edgeY} ${tailLX} ${edgeY}`,
    `H${s+r}`,
    `C${s+r-k} ${edgeY} ${s} ${edgeY-r+k} ${s} ${edgeY-r}`,
    `V${s+r}`,
    `C${s} ${s+r-k} ${s+r-k} ${s} ${s+r} ${s}`, 'Z',
  ].join('');
};

const TAIL_H = 27;

/* ── Mini particle explosion (tutorial label reveals) ──────────── */
const MINI_PARTICLE_COLORS = [
  'rgba(255,220,60,1)',
  'rgba(255,200,40,0.95)',
  'rgba(255,180,30,0.95)',
  'rgba(255,240,100,0.9)',
  'rgba(255,160,20,0.9)',
];

const fireMiniParticles = (container: HTMLElement) => {
  const count = 10;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    const size = 4 + Math.random() * 6;
    const blur = 0.5 + Math.random() * 1.5;
    const color = MINI_PARTICLE_COLORS[Math.floor(Math.random() * MINI_PARTICLE_COLORS.length)];

    Object.assign(dot.style, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: color,
      filter: `blur(${blur}px)`,
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
    });
    container.appendChild(dot);

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const dist = 30 + Math.random() * 50;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    gsap.to(dot, {
      x: dx, y: dy,
      opacity: 0,
      scale: 0.3 + Math.random() * 0.4,
      duration: 0.5 + Math.random() * 0.3,
      ease: 'power2.out',
      onComplete: () => { dot.remove(); },
    });
  }
};

/* ── Callout label — chat-bubble shape, Clash Display Bold ─────── */
const CalloutLabel: React.FC<{ text: string; tailUp?: boolean }> = ({ text, tailUp }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
  }, [text]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (wrapRef.current) setSize({ w: wrapRef.current.offsetWidth, h: wrapRef.current.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const svgW = size.w;
  const svgH = size.h + TAIL_H;
  const path = buildBubblePath(svgW, size.h);

  return (
    <div className="callout-label inline-block">
      <div ref={wrapRef} className="relative" style={{ filter: 'drop-shadow(4px 4px 0px #4A0000)' }}>
        {svgW > 0 && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${svgW} ${svgH}`} fill="none"
            className="absolute left-0 pointer-events-none" width={svgW} height={svgH}
            style={tailUp ? { bottom: 0, transform: 'scaleY(-1)' } : { top: 0 }}>
            <path d={path} fill="#620000" stroke="white" strokeWidth="4" />
          </svg>
        )}
        <div className="relative z-10 px-7 py-3 md:px-9 md:py-4"
          style={{
            fontFamily: "'Clash Display'",
            fontWeight: 700,
            color: 'white',
            fontSize: 'clamp(20px, min(4.5vw, 4vh), 38px)',
            letterSpacing: '-0.02em',
            textShadow: '1px 1px 0 rgba(0,0,0,0.4)',
            ...(tailUp ? { paddingTop: `${TAIL_H}px` } : {}),
          }}>
          {text}
        </div>
      </div>
    </div>
  );
};

/* ── Step 3 (index 2): Kong + Mahjong tiles with sticker overlays ── */
const Step3Section: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const kongParticlesRef = useRef<HTMLDivElement>(null);
  const mjParticlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const kongLabel = el.querySelector('.kong-label');
    const mjLabel   = el.querySelector('.mj-label');
    const kongTiles = el.querySelectorAll('.kong-tile');
    const mjTiles   = el.querySelectorAll('.mj-tile');

    gsap.set([kongLabel, mjLabel], { opacity: 0, scale: 0.7, transformOrigin: 'center bottom' });
    gsap.set([kongTiles, mjTiles], { opacity: 0, scale: 0.7 });

    const tl = gsap.timeline({ delay: 0.8 });
    // Kong tiles appear → particles → KONG label
    tl.to(kongTiles, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.1, ease: 'back.out(1.5)' })
      .call(() => { if (kongParticlesRef.current) fireMiniParticles(kongParticlesRef.current); })
      .to(kongLabel, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1')
    // Mahjong tiles appear → particles → MAHJONG label
      .to(mjTiles, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.06, ease: 'back.out(1.5)' }, '+=0.3')
      .call(() => { if (mjParticlesRef.current) fireMiniParticles(mjParticlesRef.current); })
      .to(mjLabel, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1');

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={sectionRef} className="select-none pointer-events-none">
      {/* Kong tiles with KONG! label overlaid — extra top margin so bubble sits higher */}
      <div className="relative mt-6 md:mt-8">
        <div className="flex gap-[1px] md:gap-[2px]">
          {[0, 1, 2, 3].map(i => (
            <Tile key={`k-${i}`} src="/assets/tiles/tile-num-1.webp" alt="Kong" extra="kong-tile" />
          ))}
        </div>
        <div className="kong-label absolute -top-5 left-1/2 -translate-x-1/2 z-20" style={{ transform: 'rotate(-4deg) translateX(-50%)' }}>
          <CalloutLabel text="KONG!" />
        </div>
        <div ref={kongParticlesRef} className="absolute inset-0 pointer-events-none flex items-center justify-center" />
      </div>

      {/* Spacer */}
      <div className="h-8 md:h-10" />

      {/* Mahjong tiles with MAHJONG! label below (tail pointing up) */}
      <div className="relative">
        <div>
          <div className="flex gap-[1px] md:gap-[2px] mb-[1px] md:mb-[2px]">
            {MJ_ROW1.map(([src, alt], i) => (
              <Tile key={`r1-${i}`} src={src} alt={alt} extra="mj-tile" />
            ))}
          </div>
          <div className="flex gap-[1px] md:gap-[2px]">
            {MJ_ROW2.map(([src, alt], i) => (
              <Tile key={`r2-${i}`} src={src} alt={alt} extra="mj-tile" />
            ))}
          </div>
        </div>
        <div className="mj-label absolute -bottom-12 left-1/2 z-20" style={{ transform: 'rotate(-4deg) translateX(-50%)', whiteSpace: 'nowrap' }}>
          <CalloutLabel text="MAHJONG!" tailUp />
        </div>
        <div ref={mjParticlesRef} className="absolute inset-0 pointer-events-none flex items-center justify-center" />
      </div>
    </div>
  );
};

/* ── Step 4 (index 3): Table with hand pointing at CTA ──────────── */
const Step4TableSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const card = el.querySelector('.table-card-wrap');
    const hand = el.querySelector('.hand-pointer');

    gsap.set(card, { opacity: 0, y: 20, scale: 0.9 });
    gsap.set(hand, { opacity: 0, scale: 0 });

    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' })
      .to(hand, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.1');

    // Bouncing hand loop
    gsap.to(hand, { y: -6, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2 });

    return () => { tl.kill(); gsap.killTweensOf(hand); };
  }, []);

  return (
    <div ref={sectionRef} className="select-none pointer-events-none flex justify-center md:justify-start">
      <div className="relative">
        {/* Real TableCard from Lobby — centered mobile, 40% bigger desktop */}
        <div className="table-card-wrap w-[min(88vw,320px)] md:w-[420px]">
          <TableCard table={MOCK_TABLES[0]} onJoin={() => {}} />
        </div>

        {/* Hand pointer — rotated diagonal */}
        <span
          className="hand-pointer absolute -bottom-1 right-1 text-3xl md:text-4xl"
          style={{ filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.4))', transform: 'rotate(-30deg)' }}
        >
          &#x1F446;
        </span>
      </div>
    </div>
  );
};

/* ── Step 5 (index 4): Kong tiles + Profiles getting paid ────────── */
const Step5KongSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const label     = el.querySelector('.kong-label');
    const tiles     = el.querySelectorAll('.kong-tile');
    const profiles  = el.querySelectorAll('.player-profile');

    gsap.set(label, { opacity: 0, scale: 0.7, transformOrigin: 'center bottom' });
    gsap.set(tiles, { opacity: 0, scale: 0.7 });
    gsap.set(profiles, { opacity: 0, y: 15 });

    const tl = gsap.timeline({ delay: 0.5 });
    // Tiles first → particles → KONG label (matching step 2 pattern)
    tl.to(tiles, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.1, ease: 'back.out(1.5)' })
      .call(() => { if (particlesRef.current) fireMiniParticles(particlesRef.current); })
      .to(label, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1')
      .to(profiles, { opacity: 1, y: 0, duration: 0.4, stagger: 0.15, ease: 'power2.out' }, '+=0.3');

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={sectionRef} className="select-none pointer-events-none">
      {/* 4 Kong tiles with KONG! label overlaid — extra top margin so bubble sits higher */}
      <div className="relative mt-8 md:mt-10 pt-8 md:pt-10 mb-6 md:mb-8">
        <div className="flex gap-[2px] md:gap-[3px]">
          {[0, 1, 2, 3].map(i => (
            <Tile key={`k-${i}`} src="/assets/tiles/tile-num-1.webp" alt="Kong" extra="kong-tile" />
          ))}
        </div>
        <div className="kong-label absolute -top-5 left-1/2 -translate-x-1/2 z-20" style={{ transform: 'rotate(-4deg) translateX(-50%)' }}>
          <CalloutLabel text="KONG!" />
        </div>
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none flex items-center justify-center" />
      </div>

      {/* Player profiles — square container, face-visible crop */}
      <div className="flex gap-6 md:gap-10 justify-center">
        {/* Player 1 — gets paid */}
        <div className="player-profile flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-xl overflow-hidden border-2 border-white/20">
              <img src="/assets/profile-bubbletea.webp" alt="Player 1"
                className="w-full h-full object-cover object-top" />
            </div>
            <div className="absolute -top-2.5 -right-4 px-2 py-1 rounded-full text-xs md:text-sm font-bold text-white flex items-center gap-0.5"
              style={{ background: '#22c55e', boxShadow: '0 2px 6px rgba(34,197,94,0.4)' }}>
              +100<img src="/assets/topbar-coin.webp" alt="SP" className="inline w-4 h-4 md:w-5 md:h-5 ml-0.5" />
            </div>
          </div>
          <span className="flex items-center gap-1 text-white text-xs md:text-sm font-bold uppercase tracking-wide">
            Player 1
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 41 41" fill="none" className="md:w-5 md:h-5">
              <path d="M20.0922 2.50586C16.6149 2.50586 13.2157 3.53699 10.3245 5.46886C7.43321 7.40074 5.17975 10.1466 3.84906 13.3592C2.51836 16.5717 2.17019 20.1068 2.84857 23.5172C3.52696 26.9277 5.20142 30.0604 7.66023 32.5192C10.119 34.978 13.2517 36.6525 16.6622 37.3309C20.0727 38.0093 23.6077 37.6611 26.8203 36.3304C30.0329 34.9997 32.7787 32.7462 34.7106 29.855C36.6425 26.9637 37.6736 23.5646 37.6736 20.0873C37.6736 15.4244 35.8213 10.9525 32.5241 7.65534C29.227 4.35818 24.7551 2.50586 20.0922 2.50586ZM17.5805 27.1073L11.3015 20.8282L13.2982 18.8315L17.5805 23.1138L26.8861 13.8082L28.8904 15.7999L17.5805 27.1073Z" fill="#2AD858"/>
            </svg>
          </span>
        </div>

        {/* Player 2 — pays */}
        <div className="player-profile flex flex-col items-center">
          <div className="relative mb-2">
            <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-xl overflow-hidden border-2 border-white/20">
              <img src="/assets/profile-busy.webp" alt="Player 2"
                className="w-full h-full object-cover object-top" />
            </div>
            <div className="absolute -top-2.5 -right-4 px-2 py-1 rounded-full text-xs md:text-sm font-bold text-white flex items-center gap-0.5"
              style={{ background: '#ef4444', boxShadow: '0 2px 6px rgba(239,68,68,0.4)' }}>
              -100<img src="/assets/topbar-coin.webp" alt="SP" className="inline w-4 h-4 md:w-5 md:h-5 ml-0.5" />
            </div>
          </div>
          <span className="flex items-center gap-1 text-white text-xs md:text-sm font-bold uppercase tracking-wide">
            Player 2
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 41 41" fill="none" className="md:w-5 md:h-5">
              <path d="M20.0922 2.50586C16.6149 2.50586 13.2157 3.53699 10.3245 5.46886C7.43321 7.40074 5.17975 10.1466 3.84906 13.3592C2.51836 16.5717 2.17019 20.1068 2.84857 23.5172C3.52696 26.9277 5.20142 30.0604 7.66023 32.5192C10.119 34.978 13.2517 36.6525 16.6622 37.3309C20.0727 38.0093 23.6077 37.6611 26.8203 36.3304C30.0329 34.9997 32.7787 32.7462 34.7106 29.855C36.6425 26.9637 37.6736 23.5646 37.6736 20.0873C37.6736 15.4244 35.8213 10.9525 32.5241 7.65534C29.227 4.35818 24.7551 2.50586 20.0922 2.50586ZM17.5805 27.1073L11.3015 20.8282L13.2982 18.8315L17.5805 23.1138L26.8861 13.8082L28.8904 15.7999L17.5805 27.1073Z" fill="#2AD858"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Step 6 (index 5): Mahjong tiles only with MAHJONG! callout ── */
const Step6MahjongSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const label  = el.querySelector('.mj-label');
    const tiles  = el.querySelectorAll('.mj-tile');

    gsap.set(label, { opacity: 0, scale: 0.7, transformOrigin: 'center bottom' });
    gsap.set(tiles, { opacity: 0, scale: 0.7 });

    const tl = gsap.timeline({ delay: 0.5 });
    // Tiles first → particles → MAHJONG label (matching pattern)
    tl.to(tiles, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.05, ease: 'back.out(1.5)' })
      .call(() => { if (particlesRef.current) fireMiniParticles(particlesRef.current); })
      .to(label, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1');

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={sectionRef} className="select-none pointer-events-none">
      {/* Mahjong winning hand with MAHJONG! label overlaid */}
      <div className="relative">
        <div>
          <div className="flex gap-[1px] md:gap-[2px] mb-[1px] md:mb-[2px]">
            {MJ_ROW1.map(([src, alt], i) => (
              <Tile key={`r1-${i}`} src={src} alt={alt} extra="mj-tile" />
            ))}
          </div>
          <div className="flex gap-[1px] md:gap-[2px]">
            {MJ_ROW2.map(([src, alt], i) => (
              <Tile key={`r2-${i}`} src={src} alt={alt} extra="mj-tile" />
            ))}
          </div>
        </div>
        <div className="mj-label absolute -top-5 left-1/2 -translate-x-1/2 z-20" style={{ transform: 'rotate(-4deg) translateX(-50%)' }}>
          <CalloutLabel text="MAHJONG!" />
        </div>
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none flex items-center justify-center" />
      </div>
    </div>
  );
};

/* ── Step 7 (index 6): Celebration title ─────────────────────────── */
const CelebrationTitle: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, scale: 0.7, y: 20 });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(el, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' });

    // Subtle pulse loop
    gsap.to(el, {
      scale: 1.03, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2,
    });

    return () => { tl.kill(); gsap.killTweensOf(el); };
  }, []);

  return (
    <h1
      ref={titleRef}
      className="text-white text-5xl md:text-7xl font-bold text-center"
      style={{
        fontFamily: "'Clash Display', sans-serif",
        textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,200,50,0.3)',
        letterSpacing: '-0.02em',
      }}
    >
      MAHJONG!
    </h1>
  );
};

/* ── Page dot indicator ────────────────────────────────────────────── */
const PageDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-[10px]">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className="rounded-full transition-all duration-300"
        style={{
          width:  i === current ? '8px' : '6px',
          height: i === current ? '8px' : '6px',
          backgroundColor: 'white',
          opacity: i === current ? 1 : 0.45,
          boxShadow: i === current ? '0 0 4px rgba(255,255,255,0.8)' : 'none',
        }}
      />
    ))}
  </div>
);

/* ── Chat bubble with typewriter ───────────────────────────────────── */
const ChatBubble: React.FC<{
  lines: string[];
  onComplete: () => void;
}> = ({ lines, onComplete }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const textRef  = useRef<HTMLDivElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setSize({ w: el.offsetWidth, h: el.offsetHeight });
  }, [lines]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    completedRef.current = false;
    const bubble = bubbleRef.current;
    const textEl = textRef.current;
    if (!bubble || !textEl) return;

    gsap.set(bubble, { opacity: 0, y: 20, scale: 0.95 });
    textEl.innerHTML = '';

    const tl = gsap.timeline();

    tl.to(bubble, {
      opacity: 1, y: 0, scale: 1,
      duration: 0.6, ease: 'power3.out',
    });

    const fullText = lines.join('\n');
    const chars = fullText.split('');

    const lineSpans = lines.map((line) => {
      const p = document.createElement('p');
      p.style.margin = '0';
      p.innerHTML = '\u00A0';
      return { el: p, text: line };
    });
    lineSpans.forEach(({ el }) => textEl.appendChild(el));

    let charIndex = 0;
    let lineIndex = 0;
    let lineCharIndex = 0;

    tl.to({}, {
      duration: fullText.length * 0.04,
      ease: 'none',
      onUpdate: function () {
        const progress = this.progress();
        const targetChar = Math.floor(progress * chars.length);
        while (charIndex < targetChar && charIndex < chars.length) {
          const char = chars[charIndex];
          if (char === '\n') {
            lineIndex++;
            lineCharIndex = 0;
          } else {
            lineSpans[lineIndex].el.textContent =
              lineSpans[lineIndex].text.substring(0, lineCharIndex + 1);
            lineCharIndex++;
          }
          charIndex++;
        }
      },
      onComplete: () => {
        lineSpans.forEach(({ el, text }) => { el.textContent = text; });
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      },
    });

    return () => { tl.kill(); };
  }, [lines, onComplete]);

  const svgW = size.w;
  const svgH = size.h + TAIL_H;
  const path  = buildBubblePath(svgW, size.h);

  return (
    <div ref={bubbleRef} className="relative inline-block w-full opacity-0">
      <div
        ref={wrapRef}
        className="relative"
        style={{ filter: 'drop-shadow(6px 6px 0px #4A0000)' }}
      >
        {svgW > 0 && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${svgW} ${svgH}`}
            fill="none"
            className="absolute top-0 left-0 pointer-events-none"
            width={svgW}
            height={svgH}
          >
            <path d={path} fill="#620000" stroke="white" strokeWidth="4" />
          </svg>
        )}

        <div
          ref={textRef}
          className="relative z-10 font-semibold text-white leading-snug px-7 py-5 md:px-9 md:py-6"
          style={{
            fontSize: 'clamp(10px, min(3.5vw, 2.5vh), 22px)',
            letterSpacing: '-0.02em',
          }}
        />
      </div>
    </div>
  );
};

/* ── Main Tutorial Component ───────────────────────────────────────── */
interface TutorialProps {
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onClose, onNavigate }) => {
  const [step, setStep] = useState(0);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [textComplete, setTextComplete] = useState(false);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const pulseAnimRef = useRef<gsap.core.Tween | null>(null);
  const phraseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleWrapRef = useRef<HTMLDivElement>(null);

  const currentStep = STEPS[step];
  const showBubble = !currentStep.noBubble;

  // Multi-phrase steps use `phrases`; single-phrase steps fall back to `text`
  const currentPhrases = currentStep.phrases ?? [currentStep.text];
  const safeIdx        = Math.min(phraseIdx, currentPhrases.length - 1);
  const currentLines   = currentPhrases[safeIdx];
  const isLastPhrase   = safeIdx >= currentPhrases.length - 1;

  // Reset phrase position whenever the step changes
  useEffect(() => {
    phraseTimerRef.current && clearTimeout(phraseTimerRef.current);
    setPhraseIdx(0);
  }, [step]);

  // Pulse the NEXT button when text is done (or immediately on noBubble steps)
  useEffect(() => {
    const shouldPulse = currentStep.noBubble || textComplete;
    if (shouldPulse && nextBtnRef.current) {
      pulseAnimRef.current = gsap.to(nextBtnRef.current, {
        scale: 1.05,
        boxShadow: '0 0 22px rgba(230,162,60,0.7)',
        borderColor: 'rgba(230,162,60,1)',
        duration: 0.7,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
    return () => {
      pulseAnimRef.current?.kill();
      if (nextBtnRef.current) {
        gsap.set(nextBtnRef.current, { scale: 1, boxShadow: 'none', borderColor: 'white' });
      }
    };
  }, [textComplete, currentStep.noBubble]);

  const handleNext = () => {
    phraseTimerRef.current && clearTimeout(phraseTimerRef.current);
    gsap.killTweensOf(bubbleWrapRef.current);
    if (step < TOTAL_STEPS - 1) {
      setTextComplete(false);
      setPhraseIdx(0);
      pulseAnimRef.current?.kill();
      if (nextBtnRef.current) gsap.set(nextBtnRef.current, { scale: 1 });
      setStep(step + 1);
    } else {
      onNavigate(Page.LOBBY);
    }
  };

  const handleSkip = () => {
    phraseTimerRef.current && clearTimeout(phraseTimerRef.current);
    gsap.killTweensOf(bubbleWrapRef.current);
    onNavigate(Page.LOBBY);
  };

  const handleTextComplete = React.useCallback(() => {
    if (!isLastPhrase) {
      const el = bubbleWrapRef.current;
      if (el) {
        gsap.to(el, {
          opacity: 0, y: -10, duration: 0.35, ease: 'power2.in', delay: 0.6,
          onComplete: () => {
            gsap.set(el, { opacity: 1, y: 0 });
            setPhraseIdx(p => p + 1);
          },
        });
      } else {
        phraseTimerRef.current = setTimeout(() => setPhraseIdx(p => p + 1), 1000);
      }
    } else {
      setTextComplete(true);
    }
  }, [isLastPhrase]);

  /* ── Bubble position helpers ── */
  const bubbleTop =
    step === 0 ? 'top-[22vh] md:top-[calc(30vh-130px)]'
    : step === 2 || step === 4 || step === 5
      ? 'top-[calc(22vh+250px)] md:top-[18vh]'
    : 'top-[calc(22vh+250px)] md:top-[calc(30vh-130px)]';

  const bubbleLeft =
    step === 1 ? 'md:left-[calc(18%+500px)]'
    : step >= 2 && step <= 5 ? 'md:left-[42%]'
    : 'md:left-[18%]';

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ── Full-bleed looping video background ── */}
      {(() => {
        const desktopSrc = currentStep.videoDesktop ?? DEFAULT_VIDEO_DESKTOP;
        const mobileSrc  = currentStep.videoMobile  ?? DEFAULT_VIDEO_MOBILE;
        return (
          <>
            <video key={desktopSrc} autoPlay loop muted playsInline
              className="hidden md:block absolute inset-0 w-full h-full object-cover">
              <source src={desktopSrc} type="video/mp4" />
            </video>
            <video key={mobileSrc} autoPlay loop muted playsInline
              className="block md:hidden absolute inset-0 w-full h-full object-cover">
              <source src={mobileSrc} type="video/mp4" />
            </video>
          </>
        );
      })()}

      {/* ── Top gradient overlay ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[120px] md:h-[135px] z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(80,0,0,1) 0%, rgba(80,0,0,0) 100%)',
          backdropFilter: 'blur(10px)',
        }}
      />

      {/* ── Top bar: Skip / Title / Next ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-[20px] pt-[20px]">
        <button
          onClick={handleSkip}
          className="border border-white rounded-[6px] px-8 md:px-[60px] py-2.5 md:h-[45px] md:flex md:items-center text-white font-semibold text-sm md:text-base uppercase tracking-tight hover:bg-white/10 active:scale-95 transition-all"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%)',
          }}
        >
          Skip
        </button>

        <span
          className="text-white font-semibold text-lg md:text-2xl uppercase tracking-tight"
          style={{ letterSpacing: '-0.6px' }}
        >
          Tutorial
        </span>

        <button
          ref={nextBtnRef}
          onClick={handleNext}
          className="border border-white rounded-[6px] px-8 md:px-[60px] py-2.5 md:h-[45px] md:flex md:items-center text-white font-semibold text-sm md:text-base uppercase tracking-tight hover:brightness-110 active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(181deg, rgba(255,255,255,0) 9%, rgba(230,162,60,0.6) 98%)',
          }}
        >
          {step === TOTAL_STEPS - 1 ? 'Start' : 'Next'}
        </button>
      </div>

      {/* ── Page dots ── */}
      <div className="absolute z-20 left-1/2 -translate-x-1/2 top-[72px] md:top-[80px]">
        <PageDots current={step} total={TOTAL_STEPS} />
      </div>

      {/* ── Step 1 — Tile showcase ── */}
      {step === 1 && (
        <div className="absolute z-10 left-[4vw] top-[18vh] md:left-[5%] md:top-[26vh]">
          <TileSection key="tiles" />
        </div>
      )}

      {/* ── Step 2 — Kong + Mahjong with stickers ── */}
      {step === 2 && (
        <div className="absolute z-10 left-[4vw] top-[18vh] md:left-[5%] md:top-[18vh]">
          <Step3Section key="step3" />
        </div>
      )}

      {/* ── Step 3 — Table with hand pointing (centered mobile, left-aligned desktop) ── */}
      {step === 3 && (
        <div className="absolute z-10 inset-x-0 top-[14vh] md:left-[5%] md:right-auto md:top-[16vh] px-4 md:px-0">
          <Step4TableSection key="step4" />
        </div>
      )}

      {/* ── Step 4 — Kong + Profiles ── */}
      {step === 4 && (
        <div className="absolute z-10 left-[4vw] top-[14vh] md:left-[5%] md:top-[16vh]">
          <Step5KongSection key="step5" />
        </div>
      )}

      {/* ── Step 5 — Mahjong tiles only ── */}
      {step === 5 && (
        <div className="absolute z-10 left-[4vw] top-[14vh] md:left-[5%] md:top-[16vh]">
          <Step6MahjongSection key="step6" />
        </div>
      )}

      {/* ── Step 6 — Celebration title ── */}
      {step === 6 && (
        <div className="absolute z-20 inset-x-0 top-[14vh] md:top-[12vh] flex justify-center">
          <CelebrationTitle key="celebration" />
        </div>
      )}

      {/* ── Chat bubble (hidden on noBubble steps) ── */}
      {showBubble && (
        <div ref={bubbleWrapRef} className={`absolute z-20 left-4 ${bubbleLeft} ${bubbleTop} w-[min(82vw,48vh)] max-w-[260px] md:w-[min(28vw,45vh)] md:max-w-[340px] overflow-visible`}>
          <ChatBubble
            key={`${step}-${phraseIdx}`}
            lines={currentLines}
            onComplete={handleTextComplete}
          />
        </div>
      )}
    </div>
  );
};
