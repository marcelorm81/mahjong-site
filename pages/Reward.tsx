import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

/* ── Asset paths ── */
const LOCK_IMG     = '/assets/lock.webp';
const BASE_IMG     = '/assets/base.webp';
const COINS_IMG    = '/assets/reward-coins.webp';
const STARBURST    = '/assets/reward-starburst.svg';

/* ── Particle explosion config (firework-style circular burst) ── */
const PARTICLE_COLORS = [
  'rgba(255,220,60,1)',      // bright gold
  'rgba(255,200,40,0.95)',   // warm yellow
  'rgba(255,180,30,0.95)',   // amber
  'rgba(255,240,100,0.9)',   // pale gold
  'rgba(255,160,20,0.9)',    // deep amber
  'rgba(255,255,150,0.85)',  // light yellow
];
/* Two concentric rings for a firework feel */
const RINGS = [
  { count: 20, minDist: 60,  maxDist: 150, minSize: 8,  maxSize: 18, delay: 0 },
  { count: 28, minDist: 130, maxDist: 300, minSize: 10, maxSize: 26, delay: 0.05 },
];

/* ═══════════════════════════════════════════════════════════════════════
   Reward overlay
   ─────────────────────────────────────────────────────────────────────
   Full animation:
   1. Mount → place gift at exact nav-icon position (pixel-perfect)
   2. Lift gift to viewport center while fading in backdrop
   3. Open: lock UP, base DOWN with overshoot — light spills from gap
   4. White halo ON TOP of gift grows with the opening (magical moment)
   5. Glow burst: gold (behind) radiates outward, white peaks
   6. Lock + base fade, prize card emerges tiny from halo center
   7. Dismiss: reverse everything → shrink back to nav → restore icon
   8. Redeem: card + overlay fade out → nav icon stays hidden
   ═══════════════════════════════════════════════════════════════════════ */

interface RewardProps {
  onClose: () => void;   // dismiss — reverse to nav
  onRedeem: () => void;  // collect — overlay fades, icon removed
}

export const Reward: React.FC<RewardProps> = ({ onClose, onRedeem }) => {
  /* ── Refs ── */
  const backdropRef    = useRef<HTMLDivElement>(null);
  const giftRef        = useRef<HTMLDivElement>(null);
  const lockRef        = useRef<HTMLImageElement>(null);
  const baseRef        = useRef<HTMLImageElement>(null);
  const whiteGlowRef   = useRef<HTMLDivElement>(null);
  const goldGlowRef    = useRef<HTMLDivElement>(null);
  const cardRef        = useRef<HTMLDivElement>(null);
  const particlesRef   = useRef<HTMLDivElement>(null);

  // Store starting offsets for reverse animation
  const startRef = useRef({ x: 0, y: 0, scale: 0.1 });
  const navIconRef = useRef<HTMLElement | null>(null);
  const busyRef = useRef(false);

  /** Spawn firework-style circular particle burst — two rings expanding outward */
  const fireParticles = () => {
    const container = particlesRef.current;
    if (!container) return;

    RINGS.forEach(({ count, minDist, maxDist, minSize, maxSize, delay }) => {
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        const size = minSize + Math.random() * (maxSize - minSize);
        const blur = 1 + Math.random() * 2.5;        // 1–3.5px (less blur = more visible)
        const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

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

        // Even radial distribution for circular firework
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
        const dist = minDist + Math.random() * (maxDist - minDist);
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;

        gsap.to(dot, {
          x: dx,
          y: dy,
          opacity: 0,
          scale: 0.3 + Math.random() * 0.4,
          duration: 0.8 + Math.random() * 0.6,       // 0.8–1.4s (longer = more visible)
          delay: delay + Math.random() * 0.08,
          ease: 'power2.out',
          onComplete: () => { dot.remove(); },
        });
      }
    });
  };

  /* ── Forward animation (on mount) ── */
  useLayoutEffect(() => {
    const navIcon = document.querySelector('[data-reward-icon]') as HTMLElement | null;
    navIconRef.current = navIcon;

    // Measure nav icon position
    const navRect = navIcon
      ? navIcon.getBoundingClientRect()
      : { left: window.innerWidth / 2 - 20, top: window.innerHeight - 60, width: 40, height: 40 };

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Target size & position (centered, slightly above middle)
    const targetW = Math.min(vw * 0.52, 240);
    const targetH = targetW * 1.15;
    const centerX = (vw - targetW) / 2;
    const centerY = (vh - targetH) / 2 - 40;

    // Compute transform offsets from centered position → nav icon position
    const navCX = navRect.left + navRect.width / 2;
    const navCY = navRect.top + navRect.height / 2;
    const giftCX = centerX + targetW / 2;
    const giftCY = centerY + targetH / 2;
    const sx = navCX - giftCX;
    const sy = navCY - giftCY;
    const ss = navRect.width / targetW;

    startRef.current = { x: sx, y: sy, scale: ss };

    // ── Initial states (GSAP owns everything) ──
    gsap.set(giftRef.current, {
      left: centerX, top: centerY, width: targetW, height: targetH,
      x: sx, y: sy, scale: ss,
      transformOrigin: 'center center',
    });
    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.set(cardRef.current, { opacity: 0, scale: 0.1, y: 0 });
    gsap.set(whiteGlowRef.current, { opacity: 0, scale: 0.2 });
    gsap.set(goldGlowRef.current, { opacity: 0, scale: 0.3 });

    // Hide the nav icon (so there's no duplicate)
    if (navIcon) navIcon.style.opacity = '0';
    busyRef.current = true;

    // ── TIMELINE ──
    const tl = gsap.timeline({ onComplete: () => { busyRef.current = false; } });

    // 1. Lift to center
    tl.to(giftRef.current, {
      x: 0, y: 0, scale: 1,
      duration: 0.65, ease: 'power2.inOut',
    })
    // Backdrop fades in during lift
    .to(backdropRef.current, {
      opacity: 1, duration: 0.45,
    }, '-=0.45')

    // 2. Settle briefly
    .to({}, { duration: 0.08 })

    // 2b. Last excited shake at full size before opening
    .to(lockRef.current, { rotation: 6, duration: 0.08, ease: 'sine.inOut' })
    .to(baseRef.current, { rotation: -6, duration: 0.08, ease: 'sine.inOut' }, '<')
    .to(lockRef.current, { rotation: -7, duration: 0.08, ease: 'sine.inOut' })
    .to(baseRef.current, { rotation: 7, duration: 0.08, ease: 'sine.inOut' }, '<')
    .to(lockRef.current, { rotation: 5, duration: 0.07, ease: 'sine.inOut' })
    .to(baseRef.current, { rotation: -5, duration: 0.07, ease: 'sine.inOut' }, '<')
    .to(lockRef.current, { rotation: -6, duration: 0.07, ease: 'sine.inOut' })
    .to(baseRef.current, { rotation: 6, duration: 0.07, ease: 'sine.inOut' }, '<')
    .to([lockRef.current, baseRef.current], { rotation: 0, duration: 0.06, ease: 'sine.out' })

    // 3. Open — lock lifts up, base drops down (both with overshoot)
    .to(lockRef.current, {
      y: -(targetH * 0.42), rotation: -10,
      duration: 0.5, ease: 'back.out(1.4)',
    })
    .to(baseRef.current, {
      y: targetH * 0.32, rotation: 6,
      duration: 0.5, ease: 'back.out(1.4)',
    }, '<')

    // White halo ON TOP of gift begins growing during opening (magical moment)
    .to(whiteGlowRef.current, {
      opacity: 0.5, scale: 0.9,
      duration: 0.5, ease: 'power2.out',
    }, '<')

    // 4. Glow burst — gold BEHIND expands, white ON TOP peaks
    .to(goldGlowRef.current, {
      opacity: 0.7, scale: 2.8,
      duration: 0.4, ease: 'power2.out',
    }, '-=0.2')
    .to(whiteGlowRef.current, {
      opacity: 0.95, scale: 2.2,
      duration: 0.35, ease: 'power2.out',
    }, '-=0.35')

    // 5. Fade lock + base
    .to([lockRef.current, baseRef.current], {
      opacity: 0, duration: 0.3,
    }, '-=0.1')

    // 6. Fade glows + card emerges early (overlapping — feels like it's inside the box)
    .to([whiteGlowRef.current, goldGlowRef.current], {
      opacity: 0, duration: 0.35,
    })
    .to(cardRef.current, {
      opacity: 1, scale: 1,
      duration: 0.6, ease: 'back.out(1.4)',
      onStart: () => { fireParticles(); },
    }, '-=0.35');

    return () => { tl.kill(); };
  }, []);

  /* ── Dismiss: reverse to nav ── */
  const handleDismiss = () => {
    if (busyRef.current) return;
    busyRef.current = true;

    const { x, y, scale } = startRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        // Restore nav icon
        if (navIconRef.current) navIconRef.current.style.opacity = '1';
        onClose();
      },
    });

    // 1. Card fades out
    tl.to(cardRef.current, { opacity: 0, scale: 0.85, duration: 0.25 })

    // 2. Restore gift layers (reset positions, make visible)
    .set([lockRef.current, baseRef.current], {
      opacity: 1, y: 0, rotation: 0,
    })

    // 3. Shrink and fly back to nav position
    .to(giftRef.current, {
      x, y, scale,
      duration: 0.55, ease: 'power2.inOut',
    })
    // Backdrop fades during return
    .to(backdropRef.current, {
      opacity: 0, duration: 0.4,
    }, '-=0.4');
  };

  /* ── Redeem: fade out, keep nav icon hidden ── */
  const handleRedeem = () => {
    if (busyRef.current) return;
    busyRef.current = true;

    const tl = gsap.timeline({ onComplete: () => { onRedeem(); } });
    tl.to(cardRef.current, { opacity: 0, y: -20, duration: 0.3 })
      .to(backdropRef.current, { opacity: 0, duration: 0.3 }, '-=0.15');
  };

  /* ── Render ── */
  return (
    <div className="fixed inset-0 z-[9999]">
      {/* ── Backdrop (GSAP-controlled opacity) ── */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* ── Gold glow — BEHIND gift (z-10) ── */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        <div
          ref={goldGlowRef}
          className="absolute rounded-full"
          style={{
            width: 'min(85vw, 480px)', height: 'min(85vw, 480px)',
            background: 'radial-gradient(circle, rgba(255,200,50,0.55) 0%, rgba(255,160,30,0.2) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* ── Gift container (position/transform set by GSAP) ── */}
      <div ref={giftRef} className="absolute z-20" style={{ transformOrigin: 'center center' }}>
        <img
          ref={baseRef}
          src={BASE_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          style={{ transformOrigin: 'center center' }}
        />
        <img
          ref={lockRef}
          src={LOCK_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          style={{ transformOrigin: 'center center' }}
        />
      </div>

      {/* ── White glow — ON TOP of gift (z-[25]), scales with opening ── */}
      <div className="absolute inset-0 z-[25] pointer-events-none flex items-center justify-center">
        <div
          ref={whiteGlowRef}
          className="absolute rounded-full"
          style={{
            width: 'min(55vw, 340px)', height: 'min(55vw, 340px)',
            background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,200,0.35) 40%, transparent 65%)',
          }}
        />
      </div>

      {/* ── Close X button ── */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="5" x2="15" y2="15" />
          <line x1="15" y1="5" x2="5" y2="15" />
        </svg>
      </button>

      {/* ── Particle explosion container (centered, z-40 — on top of gift and card) ── */}
      <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center">
        <div ref={particlesRef} className="relative w-0 h-0" />
      </div>

      {/* ── Prize card (centered, GSAP-controlled — emerges from halo center) ── */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
        <div
          ref={cardRef}
          className="pointer-events-auto w-[min(82vw,320px)] md:w-[360px] rounded-xl border-2 border-white overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0a0000 0%, #1a0000 25%, #cc0505 100%)',
            boxShadow: '0 0 60px rgba(255,100,0,0.3), 0 10px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Level title */}
          <div className="pt-6 pb-2 md:pt-8 md:pb-3 text-center">
            <h2
              className="text-white font-bold text-3xl md:text-4xl"
              style={{ fontFamily: "'Clash Display', sans-serif", textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              Level 2
            </h2>
          </div>

          {/* Coin stack with starburst */}
          <div className="relative flex items-center justify-center py-4 md:py-6">
            <img
              src={STARBURST}
              alt=""
              className="absolute w-[200px] h-[200px] md:w-[260px] md:h-[260px] opacity-20 pointer-events-none"
            />
            <div
              className="absolute w-[140px] h-[100px] md:w-[180px] md:h-[130px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)' }}
            />
            <img
              src={COINS_IMG}
              alt="Star coins"
              className="relative w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-contain drop-shadow-lg"
            />
          </div>

          {/* Amount badge */}
          <div className="flex justify-center pb-6 md:pb-8">
            <div
              className="rounded-full px-6 py-1.5 md:px-8 md:py-2"
              style={{
                background: '#620000',
                boxShadow: 'inset -1px 1px 2px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <span
                className="font-semibold text-white text-base md:text-lg tracking-tight"
                style={{ fontFamily: "'Teachers', sans-serif" }}
              >
                100
              </span>
            </div>
          </div>

          {/* Collect button */}
          <div className="px-5 pb-5 md:px-6 md:pb-6">
            <button
              onClick={handleRedeem}
              className="w-full py-3 md:py-3.5 rounded-xl font-bold text-base md:text-lg uppercase tracking-wide
                text-white active:scale-95 transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #ff3030 0%, #D00501 50%, #9a0000 100%)',
                boxShadow: '0 4px 0 #600000, 0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              Collect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
