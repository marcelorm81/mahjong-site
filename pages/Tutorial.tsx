import React, { useEffect, useRef, useState } from 'react';
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

/* ── Page dot indicator ────────────────────────────────────────────── */
const PageDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-[18px]">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className="w-[6px] h-[6px] rounded-full transition-opacity duration-300"
        style={{
          backgroundColor: 'white',
          opacity: i === current ? 1 : 0.4,
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
  const textRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    const bubble = bubbleRef.current;
    const textEl = textRef.current;
    if (!bubble || !textEl) return;

    // Reset
    gsap.set(bubble, { opacity: 0, y: 20, scale: 0.95 });
    textEl.innerHTML = '';

    const tl = gsap.timeline();

    // 1. Fade in & slide the bubble
    tl.to(bubble, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
    });

    // 2. Typewriter effect for each line
    const fullText = lines.join('\n');
    const chars = fullText.split('');

    // Build spans for each line
    const lineSpans = lines.map((line) => {
      const span = document.createElement('p');
      span.style.margin = '0';
      return { el: span, text: line };
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
        // Ensure full text is shown
        lineSpans.forEach(({ el, text }) => {
          el.textContent = text;
        });
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      },
    });

    return () => {
      tl.kill();
    };
  }, [lines, onComplete]);

  return (
    <div ref={bubbleRef} className="relative" style={{ opacity: 0 }}>
      {/* Chat bubble background */}
      <div className="absolute inset-0" style={{ filter: 'drop-shadow(10px 10px 0px #4A0000)' }}>
        <svg
          viewBox="0 0 458 126"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M434 0C447.255 0 458 10.7452 458 24V102C458 115.255 447.255 126 434 126H421.994V144.308C421.994 146.898 418.932 148.27 416.998 146.547L393.946 126H24C10.7452 126 0 115.255 0 102V24C0 10.7452 10.7452 0 24 0H434Z"
            fill="#620000"
          />
          <path
            d="M434 0C447.255 0 458 10.7452 458 24V102C458 115.255 447.255 126 434 126H421.994V144.308C421.994 146.898 418.932 148.27 416.998 146.547L393.946 126H24C10.7452 126 0 115.255 0 102V24C0 10.7452 10.7452 0 24 0H434Z"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
      </div>
      {/* Text content */}
      <div
        ref={textRef}
        className="relative z-10 font-semibold text-white leading-snug px-8 md:px-10 py-5 md:py-6"
        style={{
          fontSize: 'clamp(16px, 2.2vw, 32px)',
          letterSpacing: '-0.02em',
        }}
      />
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
        duration: 0.6,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
    return () => {
      pulseAnimRef.current?.kill();
      if (nextBtnRef.current) {
        gsap.set(nextBtnRef.current, { scale: 1 });
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
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-20 pt-3 md:pt-[55px]">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="border border-white rounded-[6px] px-8 md:px-16 py-3 md:py-4 text-white font-semibold text-sm md:text-lg uppercase tracking-tight hover:bg-white/10 active:scale-95 transition-all"
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
          className="border border-white rounded-[6px] px-8 md:px-16 py-3 md:py-4 text-white font-semibold text-sm md:text-lg uppercase tracking-tight hover:brightness-110 active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(181deg, rgba(255,255,255,0) 9%, rgba(230,162,60,0.6) 98%)',
          }}
        >
          {step === TOTAL_STEPS - 1 ? 'Start' : 'Next'}
        </button>
      </div>

      {/* ── Page dots ── */}
      <div className="absolute z-20 left-1/2 -translate-x-1/2 top-[100px] md:top-[134px]">
        <PageDots current={step} total={TOTAL_STEPS} />
      </div>

      {/* ── Chat bubble ── */}
      <div className="absolute z-20 left-4 md:left-[8%] top-[140px] md:top-[280px] w-[260px] md:w-[460px]">
        <ChatBubble
          key={step}
          lines={currentStep.text}
          onComplete={handleTextComplete}
        />
      </div>
    </div>
  );
};
