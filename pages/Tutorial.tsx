import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Page } from '../types';
import gsap from 'gsap';

/* ── Assets ────────────────────────────────────────────────────────── */
const videoDesktop = '/assets/waving_loop_desktop.mp4';
const videoMobile = '/assets/waving_loop_mobile.mp4';

/* ── Tutorial step data ────────────────────────────────────────────── */
interface TutorialStep {
  text: string[];
}

const STEPS: TutorialStep[] = [
  { text: ['Welcome to Mahjong Stars!', 'New to here? No worries.'] },
  { text: ['Let me show you around.', 'It\'s easy, I promise!'] },
  { text: ['Pick your tiles wisely.', 'Match, strategize, and win!'] },
  { text: ['Ready to play?', 'Let\'s jump into a game!'] },
];

const TOTAL_STEPS = STEPS.length;

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

/* ── Page dot indicator ────────────────────────────────────────────── */
const PageDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-[14px]">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className="rounded-full transition-all duration-300"
        style={{
          width:  i === current ? '12px' : '10px',
          height: i === current ? '12px' : '10px',
          backgroundColor: 'white',
          opacity: i === current ? 1 : 0.45,
          boxShadow: i === current ? '0 0 6px rgba(255,255,255,0.8)' : 'none',
        }}
      />
    ))}
  </div>
);

/* ── Chat bubble with typewriter ───────────────────────────────────── */
const TAIL_H = 27; // px the tail extends below the body

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
    <div ref={bubbleRef} className="relative inline-block w-full" style={{ opacity: 0 }}>
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
            fontSize: 'clamp(13px, 3.5vw, 22px)',
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
  const [textComplete, setTextComplete] = useState(false);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const pulseAnimRef = useRef<gsap.core.Tween | null>(null);

  const currentStep = STEPS[step];

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
    if (step < TOTAL_STEPS - 1) {
      setTextComplete(false);
      pulseAnimRef.current?.kill();
      if (nextBtnRef.current) gsap.set(nextBtnRef.current, { scale: 1 });
      setStep(step + 1);
    } else {
      // Last step: go to lobby
      onNavigate(Page.LOBBY);
    }
  };

  const handleSkip = () => {
    onNavigate(Page.LOBBY);
  };

  const handleTextComplete = React.useCallback(() => {
    setTextComplete(true);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ── Full-bleed looping video background ── */}
      {/* Desktop video */}
      <video
        key="desktop"
        autoPlay
        loop
        muted
        playsInline
        className="hidden md:block absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoDesktop} type="video/mp4" />
      </video>
      {/* Mobile video */}
      <video
        key="mobile"
        autoPlay
        loop
        muted
        playsInline
        className="block md:hidden absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoMobile} type="video/mp4" />
      </video>

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

      {/* ── Chat bubble ── */}
      {/* vh-based top keeps the tail near the character's face at any screen height:
          mobile  ≈ 22 vh  (portrait — face is high up in the frame)
          desktop ≈ 30 vh  (landscape — character is more centred)          */}
      <div className="absolute z-20 left-4 md:left-[5%] top-[22vh] md:top-[30vh] max-w-[260px] md:max-w-[340px] overflow-visible">
        <ChatBubble
          key={step}
          lines={currentStep.text}
          onComplete={handleTextComplete}
        />
      </div>
    </div>
  );
};
