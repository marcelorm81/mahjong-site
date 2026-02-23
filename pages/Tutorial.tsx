import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Page } from '../types';
import gsap from 'gsap';

/* ── Default video assets ───────────────────────────────────────────── */
const DEFAULT_VIDEO_DESKTOP = '/assets/waving_loop_desktop.mp4';
const DEFAULT_VIDEO_MOBILE  = '/assets/waving_loop_mobile.mp4';

/* ── Tutorial step data ────────────────────────────────────────────── */
interface TutorialStep {
  text: string[];           // single-phrase step
  phrases?: string[][];     // multi-phrase step: each sub-array = one bubble
  videoDesktop?: string;    // overrides default waving video
  videoMobile?:  string;
}

const STEPS: TutorialStep[] = [
  { text: ['Welcome to Mahjong Stars!', 'New to here? No worries.'] },
  {
    phrases: [
      ['Mahjong is played with tiles, not cards.', 'Matching tiles are used to build sets.'],
      ['Bang Bang is the most fun', 'and easiest Mahjong rule to learn.'],
    ],
    text: ['Bang Bang is the most fun', 'and easiest Mahjong rule to learn.'], // fallback
    videoDesktop: '/assets/talking_loop_desktop.mp4',
    videoMobile:  '/assets/talking_loop_mobile.mp4',
  },
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
  { text: ['Ready to play?', 'Let\'s jump into a game!'] },
];

const TOTAL_STEPS = STEPS.length;

/* ── Mahjong tile image component ───────────────────────────────── */

/** Single tile — renders the Figma-exported SVG asset */
const TileImg: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    className="mahjong-tile w-[min(36px,7.8vw)] h-[min(48px,10.4vw)] md:w-[66px] md:h-[88px] object-contain drop-shadow"
  />
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
        {[6,7,8,9,10].map(n => (
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
// Generates the exact original SVG path shape, but adjusts corner-node
// positions so the body adapts in width & height.  The tail's bezier
// curves are always identical — only translated to follow the bottom edge.
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
    // ── Top edge + top-right corner
    `M${s+r} ${s}`, `H${W-s-r}`,
    `C${W-s-r+k} ${s} ${W-s} ${s+r-k} ${W-s} ${s+r}`,
    // ── Right edge + bottom-right corner
    `V${edgeY-r}`,
    `C${W-s} ${edgeY-r+k} ${W-s-r+k} ${edgeY} ${W-s-r} ${edgeY}`,
    // ── Bottom edge → tail (exact original bezier curves)
    `H${tailRX}`,
    `C${tailRX-3.314} ${edgeY} ${tailRX-6} ${edgeY+2.686} ${tailRX-6} ${edgeY+6}`,
    `V${edgeY+24.651}`,
    `L${tailLX+4.556} ${edgeY+1.686}`,
    `C${tailLX+3.287} ${edgeY+0.598} ${tailLX+1.671} ${edgeY} ${tailLX} ${edgeY}`,
    // ── Continue bottom edge + bottom-left corner
    `H${s+r}`,
    `C${s+r-k} ${edgeY} ${s} ${edgeY-r+k} ${s} ${edgeY-r}`,
    // ── Left edge + top-left corner
    `V${s+r}`,
    `C${s} ${s+r-k} ${s+r-k} ${s} ${s+r} ${s}`, 'Z',
  ].join('');
};

const TAIL_H = 27; // px the tail extends below the body

/* ── Callout label — chat-bubble shape, Clash Display Bold, rotated ── */
/**
 * Same SVG bubble as ChatBubble: dark-red fill, white stroke, downward tail.
 * Static text — no typewriter. Clash Display Bold. Slight rotation for energy.
 * Parent (Step3Section) drives the scale+fade GSAP pop-in via `.callout-label`.
 */
const CalloutLabel: React.FC<{ text: string }> = ({ text }) => {
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
            className="absolute top-0 left-0 pointer-events-none" width={svgW} height={svgH}>
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
          }}>
          {text}
        </div>
      </div>
    </div>
  );
};

/* ── Step 3 tile layout (Mahjong hand on top, Kong below, stickers overlay) ── */
const Step3Section: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const stickers  = el.querySelectorAll('.sticker-overlay');
    const kongTiles = el.querySelectorAll('.kong-tile');
    const mjTiles   = el.querySelectorAll('.mj-tile');

    // GSAP owns ALL transforms
    gsap.set([kongTiles, mjTiles], { opacity: 0, scale: 0.7 });
    gsap.set(stickers, { opacity: 0, scale: 0.7, transformOrigin: 'center bottom' });

    // Animation: kong tiles first → KONG! sticker → mahjong tiles → MAHJONG! sticker
    const tl = gsap.timeline({ delay: 0.8 });
    tl.to(kongTiles,   { opacity: 1, scale: 1, duration: 0.35, stagger: 0.1, ease: 'back.out(1.5)' })
      .to(stickers[0], { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1')
      .to(mjTiles,     { opacity: 1, scale: 1, duration: 0.25, stagger: 0.06, ease: 'back.out(1.5)' }, '+=0.2')
      .to(stickers[1], { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }, '-=0.1');

    return () => { tl.kill(); };
  }, []);

  const T: React.FC<{ src: string; alt: string; extra: string }> = ({ src, alt, extra }) => (
    <img src={src} alt={alt}
      className={`mahjong-tile w-[min(36px,7.8vw)] h-[min(48px,10.4vw)] md:w-[66px] md:h-[88px] object-contain drop-shadow ${extra}`} />
  );

  // Mahjong winning hand: Nan×2, man6×3, pin8×3, sou4×3, sou1×3 = 14 tiles
  const ROW1: [string, string][] = [
    ['/assets/tiles/tile-wind-south.webp', 'Nan'],
    ['/assets/tiles/tile-wind-south.webp', 'Nan'],
    ['/assets/tiles/tile-man-6.webp',      'Man 6'],
    ['/assets/tiles/tile-man-6.webp',      'Man 6'],
    ['/assets/tiles/tile-man-6.webp',      'Man 6'],
    ['/assets/tiles/tile-num-8.webp',      'Pin 8'],
    ['/assets/tiles/tile-num-8.webp',      'Pin 8'],
    ['/assets/tiles/tile-num-8.webp',      'Pin 8'],
  ];
  const ROW2: [string, string][] = [
    ['/assets/tiles/tile-sou-4.webp', 'Sou 4'],
    ['/assets/tiles/tile-sou-4.webp', 'Sou 4'],
    ['/assets/tiles/tile-sou-4.webp', 'Sou 4'],
    ['/assets/tiles/tile-sou-1.webp', 'Sou 1'],
    ['/assets/tiles/tile-sou-1.webp', 'Sou 1'],
    ['/assets/tiles/tile-sou-1.webp', 'Sou 1'],
  ];

  return (
    <div ref={sectionRef} className="select-none pointer-events-none">
      <div className="relative inline-block">
        {/* Kong tiles on top (4× Pin1) */}
        <div className="flex gap-[1px] md:gap-[2px] mb-3 md:mb-4">
          {[0, 1, 2, 3].map(i => (
            <T key={`k-${i}`} src="/assets/tiles/tile-num-1.webp" alt="Kong" extra="kong-tile" />
          ))}
        </div>

        {/* Mahjong winning hand below */}
        <div>
          {/* Row 1: 8 tiles (Nan×2, man6×3, pin8×3) */}
          <div className="flex gap-[1px] md:gap-[2px] mb-[1px] md:mb-[2px]">
            {ROW1.map(([src, alt], i) => (
              <T key={`r1-${i}`} src={src} alt={alt} extra="mj-tile" />
            ))}
          </div>
          {/* Row 2: 6 tiles (sou4×3, sou1×3) */}
          <div className="flex gap-[1px] md:gap-[2px]">
            {ROW2.map(([src, alt], i) => (
              <T key={`r2-${i}`} src={src} alt={alt} extra="mj-tile" />
            ))}
          </div>
        </div>

        {/* Overlaid sticker labels */}
        <div
          className="sticker-overlay absolute -top-4 -right-2 md:-top-5 md:-right-3 z-20"
          style={{ transform: 'rotate(6deg)' }}
        >
          <CalloutLabel text="KONG!" />
        </div>
        <div
          className="sticker-overlay absolute -bottom-6 -left-2 md:-bottom-8 md:-left-3 z-20"
          style={{ transform: 'rotate(-6deg)' }}
        >
          <CalloutLabel text="MAHJONG!" />
        </div>
      </div>
    </div>
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

  // ── Measure wrapper (text + padding) for dynamic SVG ──
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

  // ── Typewriter effect ──
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

    // Create line elements — use nbsp placeholder so they occupy height
    const lineSpans = lines.map((line) => {
      const p = document.createElement('p');
      p.style.margin = '0';
      p.innerHTML = '\u00A0'; // non-breaking space for initial height
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

  // ── Build SVG path from measured wrapper size ──
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
        {/* Dynamic SVG — exact original shape, corner nodes adapt to content */}
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

        {/* Text content — its size drives the bubble dimensions */}
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

  // Pulse the NEXT button when text is done
  useEffect(() => {
    if (textComplete && nextBtnRef.current) {
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
  }, [textComplete]);

  const handleNext = () => {
    phraseTimerRef.current && clearTimeout(phraseTimerRef.current);
    gsap.killTweensOf(bubbleWrapRef.current);
    if (step < TOTAL_STEPS - 1) {
      setTextComplete(false);
      setPhraseIdx(0); // reset before step change so phraseIdx is never out-of-bounds on next step
      pulseAnimRef.current?.kill();
      if (nextBtnRef.current) gsap.set(nextBtnRef.current, { scale: 1 });
      setStep(step + 1);
    } else {
      // Last step: go to lobby
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
      // Fade the bubble container out, then swap to next phrase
      const el = bubbleWrapRef.current;
      if (el) {
        gsap.to(el, {
          opacity: 0, y: -10, duration: 0.35, ease: 'power2.in', delay: 0.6,
          onComplete: () => {
            gsap.set(el, { opacity: 1, y: 0 }); // reset so next bubble can animate in
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

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ── Full-bleed looping video background ── */}
      {/* key = src so React remounts (and reloads) when step changes video */}
      {(() => {
        const desktopSrc = currentStep.videoDesktop ?? DEFAULT_VIDEO_DESKTOP;
        const mobileSrc  = currentStep.videoMobile  ?? DEFAULT_VIDEO_MOBILE;
        return (
          <>
            {/* Desktop video */}
            <video key={desktopSrc} autoPlay loop muted playsInline
              className="hidden md:block absolute inset-0 w-full h-full object-cover">
              <source src={desktopSrc} type="video/mp4" />
            </video>
            {/* Mobile video */}
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
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="border border-white rounded-[6px] px-8 md:px-[60px] py-2.5 md:h-[45px] md:flex md:items-center text-white font-semibold text-sm md:text-base uppercase tracking-tight hover:bg-white/10 active:scale-95 transition-all"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%)',
          }}
        >
          Skip
        </button>

        {/* Title */}
        <span
          className="text-white font-semibold text-lg md:text-2xl uppercase tracking-tight"
          style={{ letterSpacing: '-0.6px' }}
        >
          Tutorial
        </span>

        {/* Next button */}
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

      {/* ── Tile showcase — step 2 only ── */}
      {step === 1 && (
        <div className="absolute z-10 left-[4vw] top-[18vh] md:left-[5%] md:top-[26vh]">
          <TileSection key="tiles" />
        </div>
      )}

      {/* ── Kong + Mahjong layout — step 3 only ── */}
      {step === 2 && (
        <div className="absolute z-10 left-[4vw] top-[18vh] md:left-[5%] md:top-[18vh]">
          <Step3Section key="step3" />
        </div>
      )}

      {/* ── Chat bubble ── */}
      {/* vh-based top keeps the tail near the character's face at any screen height:
          mobile  ≈ 22 vh  (portrait — face is high up in the frame)
          desktop ≈ 30 vh  (landscape — character is more centred)          */}
      <div ref={bubbleWrapRef} className={`absolute z-20 left-4 ${
        step === 1 ? 'md:left-[calc(18%+500px)]' :
        step === 2 ? 'md:left-[42%]' :
        'md:left-[18%]'
      } ${
        step === 0
          ? 'top-[22vh] md:top-[calc(30vh-130px)]'
          : step === 2
            ? 'top-[calc(22vh+200px)] md:top-[18vh]'
            : 'top-[calc(22vh+200px)] md:top-[calc(30vh-130px)]'
      } w-[min(82vw,48vh)] max-w-[260px] md:w-[min(28vw,45vh)] md:max-w-[340px] overflow-visible`}>
        <ChatBubble
          key={`${step}-${phraseIdx}`}
          lines={currentLines}
          onComplete={handleTextComplete}
        />
      </div>
    </div>
  );
};
