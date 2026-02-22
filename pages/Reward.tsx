import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LOCK_IMG = '/assets/lock.png';
const BASE_IMG = '/assets/base.png';

export const Reward: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLImageElement>(null);
  const baseRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tapRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const shakeRef = useRef<gsap.core.Timeline | null>(null);
  const pulseRef = useRef<gsap.core.Tween | null>(null);
  const tapPulseRef = useRef<gsap.core.Tween | null>(null);

  const [opened, setOpened] = useState(false);

  // ── Entrance + idle animation ──
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Fade in container
    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )
    // Box drops in with rotation
    .fromTo(boxRef.current,
      { scale: 0.5, opacity: 0, rotation: 20 },
      { scale: 1, opacity: 1, rotation: 20, duration: 0.6, ease: 'back.out(1.6)' }, '-=0.1'
    )
    // Glow fades in
    .fromTo(glowRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5 }, '-=0.3'
    )
    // Tap text fades in
    .fromTo(tapRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4 }, '-=0.2'
    );

    // Start shaking animation (rapid jitter)
    const shakeTl = gsap.timeline({ repeat: -1 });
    shakeTl
      .to(boxRef.current, { x: 3, y: -2, duration: 0.05, ease: 'none' })
      .to(boxRef.current, { x: -3, y: 2, duration: 0.05, ease: 'none' })
      .to(boxRef.current, { x: 2, y: -1, duration: 0.05, ease: 'none' })
      .to(boxRef.current, { x: -2, y: 1, duration: 0.05, ease: 'none' })
      .to(boxRef.current, { x: 0, y: 0, duration: 0.05, ease: 'none' });
    shakeRef.current = shakeTl;

    // Pulsing glow behind box
    const pulse = gsap.to(glowRef.current, {
      scale: 1.3,
      opacity: 0.8,
      duration: 1.2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
    pulseRef.current = pulse;

    // Tap text pulse
    const tapPulse = gsap.to(tapRef.current, {
      opacity: 0.4,
      duration: 0.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
    tapPulseRef.current = tapPulse;

    return () => {
      tl.kill();
      shakeTl.kill();
      pulse.kill();
      tapPulse.kill();
    };
  }, []);

  // ── Open sequence ──
  const handleOpen = () => {
    if (opened) return;
    setOpened(true);

    // Stop idle animations
    shakeRef.current?.kill();
    pulseRef.current?.kill();
    tapPulseRef.current?.kill();

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Hide tap text
    tl.to(tapRef.current, { opacity: 0, duration: 0.15 })
    // Box jolts up and straightens
    .to(boxRef.current, { y: -30, rotation: 0, duration: 0.3, ease: 'power2.out' })
    // Lock flies off upward
    .to(lockRef.current, { y: -200, opacity: 0, rotation: 45, duration: 0.4, ease: 'power2.in' }, '-=0.1')
    // Base fades out expanding
    .to(baseRef.current, { scale: 1.3, opacity: 0, duration: 0.4, ease: 'power2.in' }, '-=0.2')
    // Glow explosion
    .to(glowRef.current, { scale: 3, opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.3')
    .to(glowRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in' })
    // Prize card reveals
    .fromTo(cardRef.current,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2'
    );
  };

  const glassPanel = {
    background: 'linear-gradient(221deg, rgba(80,0,0,0.2) 40%, rgba(182,0,0,0) 100%), linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)',
    backdropFilter: 'blur(20px)',
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-lg mx-auto px-4 py-4 flex flex-col items-center justify-center min-h-[60vh] opacity-0"
    >
      {/* ── Idle: Box + Glow ── */}
      {!opened && (
        <div className="relative flex flex-col items-center cursor-pointer" onClick={handleOpen}>
          {/* Pulsing glow behind box */}
          <div
            ref={glowRef}
            className="absolute w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(208,5,1,0.35) 0%, rgba(208,5,1,0) 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Box container */}
          <div ref={boxRef} className="relative w-[140px] h-[160px] md:w-[200px] md:h-[230px]">
            {/* Base behind */}
            <img
              ref={baseRef}
              src={BASE_IMG}
              alt="Reward box base"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Lock on top */}
            <img
              ref={lockRef}
              src={LOCK_IMG}
              alt="Reward box lock"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>

          {/* Tap to open text */}
          <p
            ref={tapRef}
            className="mt-6 text-white font-bold text-sm md:text-base uppercase tracking-widest"
            style={{ textShadow: '0 0 12px rgba(208,5,1,0.6)' }}
          >
            Tap to Open
          </p>
        </div>
      )}

      {/* ── Prize Card ── */}
      <div
        ref={cardRef}
        className={`w-full max-w-sm rounded-2xl border border-white/20 overflow-hidden flex flex-col items-center ${opened ? '' : 'absolute pointer-events-none'}`}
        style={{ ...glassPanel, opacity: 0, transform: 'scale(0.5)' }}
      >
        {/* Card header gradient */}
        <div
          className="w-full py-4 md:py-5 flex items-center justify-center"
          style={{
            background: 'linear-gradient(180deg, #D00501 13%, #8c0000 100%)',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.25)',
          }}
        >
          <h2
            className="text-white font-bold text-2xl md:text-3xl uppercase tracking-tight"
            style={{ fontFamily: "'Clash Display'" }}
          >
            Daily Reward
          </h2>
        </div>

        {/* Card body */}
        <div className="flex flex-col items-center gap-4 py-6 md:py-8 px-6 w-full">
          {/* Coin icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-b from-[#ffc300] to-[#e6a23c] flex items-center justify-center shadow-lg">
            <span className="text-4xl md:text-5xl">&#x1FA99;</span>
          </div>

          {/* Level text */}
          <div className="text-center">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Reward Level</p>
            <h3
              className="text-white font-bold text-3xl md:text-4xl uppercase"
              style={{ fontFamily: "'Clash Display'" }}
            >
              Level 2
            </h3>
          </div>

          {/* Reward amount badge */}
          <div className="rounded-full bg-[#620000] border border-white/20 px-6 py-2 shadow-[3px_3px_0px_0px_#4a0000]">
            <span className="text-brand-gold font-bold text-lg md:text-xl">
              +500 StarPoints
            </span>
          </div>
        </div>

        {/* Collect button */}
        <div className="px-6 w-full pb-5 md:pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 md:py-3.5 rounded-xl font-bold text-base md:text-lg uppercase tracking-wide
              bg-[#D00501] hover:bg-[#b00401] text-white active:scale-95 transition-all
              shadow-[3px_3px_0px_0px_#4a0000]"
          >
            Collect
          </button>
        </div>
      </div>
    </div>
  );
};
