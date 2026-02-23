import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/* ── Asset paths ──────────────────────────────────────────────────── */
const LOCK_IMG     = '/assets/lock.png';
const BASE_IMG     = '/assets/base.png';
const COINS_IMG    = '/assets/reward-coins.png';
const STARBURST    = '/assets/reward-starburst.svg';

/* ── Reward overlay ───────────────────────────────────────────────── */
export const Reward: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  /* ── Refs ── */
  const sceneRef    = useRef<HTMLDivElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);
  const boxRef      = useRef<HTMLDivElement>(null);
  const lockRef     = useRef<HTMLImageElement>(null);
  const baseRef     = useRef<HTMLImageElement>(null);
  const tapRef      = useRef<HTMLParagraphElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const burstRef    = useRef<HTMLDivElement>(null);

  const shakeRef    = useRef<gsap.core.Timeline | null>(null);
  const glowTween   = useRef<gsap.core.Tween | null>(null);
  const tapTween    = useRef<gsap.core.Tween | null>(null);
  const openedRef   = useRef(false);

  /* ── Entrance + idle loop ── */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Initial states — GSAP owns everything, never use inline style
    gsap.set(cardRef.current,  { opacity: 0, scale: 0.5, y: 30 });
    gsap.set(burstRef.current, { opacity: 0, scale: 0.3 });

    // ── Entrance timeline ──
    const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
    entrance
      .fromTo(glowRef.current,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.6 })
      .fromTo(boxRef.current,
        { opacity: 0, scale: 0.3, rotation: 20 },
        { opacity: 1, scale: 1, rotation: 20, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.3')
      .fromTo(tapRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4 }, '-=0.2');

    // ── Shaking: fast x/y jitter on the box ──
    const shake = gsap.timeline({ repeat: -1 });
    shake
      .to(boxRef.current, { x: 4, y: -3,  duration: 0.04, ease: 'none' })
      .to(boxRef.current, { x: -4, y: 3,  duration: 0.04, ease: 'none' })
      .to(boxRef.current, { x: 3, y: -2,  duration: 0.04, ease: 'none' })
      .to(boxRef.current, { x: -3, y: 2,  duration: 0.04, ease: 'none' })
      .to(boxRef.current, { x: 2, y: -1,  duration: 0.04, ease: 'none' })
      .to(boxRef.current, { x: -2, y: 1,  duration: 0.04, ease: 'none' })
      .to(boxRef.current, { x: 0,  y: 0,  duration: 0.04, ease: 'none' });
    shakeRef.current = shake;

    // ── Pulsing glow behind box ──
    const gp = gsap.to(glowRef.current, {
      scale: 1.25, opacity: 0.7,
      duration: 1.0, ease: 'power1.inOut', yoyo: true, repeat: -1,
    });
    glowTween.current = gp;

    // ── Tap text pulse ──
    const tp = gsap.to(tapRef.current, {
      opacity: 0.35, duration: 0.7,
      ease: 'power1.inOut', yoyo: true, repeat: -1,
    });
    tapTween.current = tp;

    return () => {
      entrance.kill();
      shake.kill();
      gp.kill();
      tp.kill();
    };
  }, []);

  /* ── Open sequence (click handler) ── */
  const handleOpen = () => {
    if (openedRef.current) return;
    openedRef.current = true;

    // Kill idle loops
    shakeRef.current?.kill();
    glowTween.current?.kill();
    tapTween.current?.kill();
    gsap.set(boxRef.current, { x: 0, y: 0 }); // reset jitter offset

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl
      // 1. Tap text vanishes
      .to(tapRef.current, { opacity: 0, y: 8, duration: 0.15 })

      // 2. Box straightens and jolts up
      .to(boxRef.current, { rotation: 0, y: -20, duration: 0.25, ease: 'power2.out' })

      // 3. Lock lifts off the base
      .to(lockRef.current, {
        y: -180, opacity: 0, rotation: -20,
        duration: 0.45, ease: 'power2.in',
      }, '-=0.05')

      // 4. Glow explosion — golden burst fills screen
      .to(glowRef.current, {
        scale: 4, opacity: 1,
        duration: 0.35, ease: 'power2.out',
      }, '-=0.25')

      // 5. White burst flash
      .to(burstRef.current, {
        opacity: 1, scale: 2.5,
        duration: 0.25, ease: 'power2.out',
      }, '-=0.20')

      // 6. Base fades out
      .to(baseRef.current, {
        scale: 1.4, opacity: 0,
        duration: 0.35, ease: 'power2.in',
      }, '-=0.30')

      // 7. Glow + burst fade out together
      .to([glowRef.current, burstRef.current], {
        opacity: 0, duration: 0.4, ease: 'power2.in',
      })

      // 8. Prize card reveals
      .to(cardRef.current, {
        opacity: 1, scale: 1, y: 0,
        duration: 0.55, ease: 'back.out(1.7)',
      }, '-=0.25');
  };

  return (
    <div
      ref={sceneRef}
      className="relative z-10 flex flex-col items-center justify-center w-full"
      style={{ minHeight: 'min(80vh, 600px)' }}
    >
      {/* ── GLOW — large golden radial behind everything ── */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        style={{
          width: 'min(90vw, 500px)',
          height: 'min(90vw, 500px)',
          background: 'radial-gradient(circle, rgba(255,200,50,0.45) 0%, rgba(255,160,30,0.2) 35%, rgba(255,100,10,0.05) 65%, transparent 85%)',
          borderRadius: '50%',
        }}
      />

      {/* ── WHITE BURST — flash on open ── */}
      <div
        ref={burstRef}
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 'min(70vw, 400px)',
          height: 'min(70vw, 400px)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,220,100,0.4) 40%, transparent 70%)',
        }}
      />

      {/* ── BOX: lock on top of base, clickable ── */}
      <div
        ref={boxRef}
        className="relative cursor-pointer z-10"
        style={{ width: 'min(55vw, 260px)', height: 'min(65vw, 310px)' }}
        onClick={handleOpen}
      >
        {/* Base (behind) */}
        <img
          ref={baseRef}
          src={BASE_IMG}
          alt="Reward box"
          className="absolute inset-0 w-full h-full object-contain"
        />
        {/* Lock (on top) */}
        <img
          ref={lockRef}
          src={LOCK_IMG}
          alt="Lock"
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>

      {/* ── TAP TO OPEN ── */}
      <p
        ref={tapRef}
        className="relative z-10 mt-5 text-white font-bold text-base md:text-lg uppercase tracking-[0.25em]"
        style={{
          fontFamily: "'Clash Display', sans-serif",
          textShadow: '0 0 20px rgba(255,180,50,0.7), 0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        Tap to Open
      </p>

      {/* ── PRIZE CARD — starts hidden, revealed by GSAP ── */}
      <div
        ref={cardRef}
        className="absolute z-20 w-[min(80vw,320px)] md:w-[360px] rounded-xl border-2 border-white overflow-hidden"
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
          {/* Starburst rays */}
          <img
            src={STARBURST}
            alt=""
            className="absolute w-[200px] h-[200px] md:w-[260px] md:h-[260px] opacity-20 pointer-events-none"
          />
          {/* Glow behind coins */}
          <div
            className="absolute w-[140px] h-[100px] md:w-[180px] md:h-[130px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          {/* Coins */}
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
            onClick={onClose}
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
  );
};
