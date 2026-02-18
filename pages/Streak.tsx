import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

// Figma assets (valid for 7 days from design fetch)
const STREAK_HERO = '/assets/streak-hero.png';
const DAY_CHECKED = '/assets/streak-day-checked.svg';
const DAY_RING    = '/assets/streak-day-ring.svg';

const DAYS = [1, 2, 3, 4, 5, 6, 7];
// Mock: user has completed days 1-3
const COMPLETED_DAYS = new Set([1, 2, 3]);
const CURRENT_DAY = 4;

const DayButton: React.FC<{ day: number; completed: boolean; current: boolean; index: number }> = ({
  day, completed, current, index,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { scale: 0, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, delay: 0.6 + index * 0.08, ease: 'back.out(1.7)' }
    );
  }, [index]);

  return (
    <div ref={ref} className="relative flex flex-col items-center gap-1 opacity-0">
      <div
        className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all
          ${current ? 'ring-2 ring-brand-gold ring-offset-2 ring-offset-transparent' : ''}
        `}
      >
        {/* Ring background */}
        <img src={DAY_RING} alt="" className="absolute inset-0 w-full h-full object-contain opacity-40" />
        {/* Completed overlay */}
        {completed && (
          <img src={DAY_CHECKED} alt="checked" className="absolute inset-0 w-full h-full object-contain" />
        )}
        {/* Day number — hidden for completed days */}
        {!completed && (
          <span className={`relative z-10 font-bold text-sm md:text-base text-white/40`}>
            {day}
          </span>
        )}
      </div>
      <span className={`text-[9px] uppercase tracking-wide font-bold ${completed ? 'text-brand-gold' : 'text-white/30'}`}>
        {completed ? '✓' : `Day ${day}`}
      </span>
    </div>
  );
};

export const Streak: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [checkedIn, setCheckedIn] = useState(false);

  // GSAP entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Darken backdrop first
    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )
    // Title tab slides down
    .fromTo(titleRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 }, '-=0.1'
    )
    // Window scales up from center
    .fromTo(windowRef.current,
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.4)' }, '-=0.2'
    )
    // Hero image drops in
    .fromTo(heroRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 }, '-=0.3'
    )
    // Body text fades
    .fromTo(bodyRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }, '-=0.2'
    )
    // CTA button bounces in
    .fromTo(btnRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' }, '-=0.1'
    );
  }, []);

  const handleCheckIn = () => {
    if (checkedIn) return;
    setCheckedIn(true);
    // GSAP celebration burst on the button
    if (btnRef.current) {
      gsap.to(btnRef.current, {
        scale: 1.15,
        duration: 0.15,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(btnRef.current, { scale: 1, duration: 0.2 });
        },
      });
    }
  };

  const glassPanel = {
    background: 'linear-gradient(221deg, rgba(80,0,0,0.2) 40%, rgba(182,0,0,0) 100%), linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)',
    backdropFilter: 'blur(20px)',
  };

  // Progress % for progress bar (days 1-3 complete = 3/6 connectors done)
  const progressPct = (COMPLETED_DAYS.size / (DAYS.length - 1)) * 100;

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto px-4 py-4 md:py-2 short:py-2 opacity-0 md:max-h-[calc(100vh-60px)] md:flex md:flex-col">

      {/* Title Tab */}
      <div ref={titleRef} className="rounded-t-2xl overflow-hidden shrink-0">
        <div
          className="px-6 py-2.5 md:py-3 flex items-center justify-between shadow-[inset_0_2px_4px_rgba(255,255,255,0.25)]"
          style={{ background: 'linear-gradient(180deg, #D00501 13%, #8c0000 100%)', backdropFilter: 'blur(5px)' }}
        >
          {/* Spacer to balance close button */}
          <div className="w-8" />
          <h1 className="text-white font-bold text-2xl md:text-3xl short:text-xl uppercase tracking-tight font-['Clash_Display',sans-serif]">
            7-Day Streak
          </h1>
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors border border-white/20"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="12" y2="12" />
              <line x1="12" y1="2" x2="2" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Window */}
      <div
        ref={windowRef}
        className="rounded-b-2xl border border-t-0 border-white/20 overflow-hidden flex flex-col items-center gap-3 md:gap-4 pb-4 md:pb-5 md:flex-1 md:min-h-0"
        style={glassPanel}
      >
        {/* Hero Image */}
        <div ref={heroRef} className="relative w-full flex justify-center pt-2 overflow-hidden shrink-0">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-32 bg-[#D00501]/15 blur-3xl rounded-full" />
          </div>
          <img
            src={STREAK_HERO}
            alt="7 Day Streak"
            className="relative z-10 w-[50%] md:w-[35%] md:max-h-[25vh] max-w-xs object-contain drop-shadow-2xl"
            onError={e => (e.currentTarget.style.opacity = '0')}
          />
        </div>

        {/* Body Text */}
        <p
          ref={bodyRef}
          className="text-white/80 text-sm md:text-base short:text-xs text-center px-6 leading-relaxed max-w-md opacity-0 shrink-0"
        >
          Earn <span className="text-brand-gold font-bold">500 bonus points</span> for completing your 7-day streak.
          <br className="hidden sm:block" />
          Don't break it — play daily!
        </p>

        {/* Progress Track + Day Buttons */}
        <div className="w-full px-6 flex flex-col items-center gap-2 shrink-0">
          {/* Progress Bar */}
          <div className="w-full h-1.5 md:h-2 bg-[#490000] rounded-full overflow-hidden shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.25)] mb-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#ffc300] to-[#e6a23c] rounded-full"
            />
          </div>

          {/* Day Buttons Row */}
          <div className="flex justify-between w-full gap-1">
            {DAYS.map((day, i) => (
              <DayButton
                key={day}
                day={day}
                completed={COMPLETED_DAYS.has(day)}
                current={day === CURRENT_DAY}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Rewards Row */}
        <div className="flex gap-3 md:gap-4 px-6 w-full justify-center shrink-0">
          {[
            { label: 'Day 1-3', reward: '+100 pts', done: true },
            { label: 'Day 4-6', reward: '+200 pts', done: false },
            { label: 'Day 7',   reward: '+500 pts', done: false },
          ].map(r => (
            <div
              key={r.label}
              className={`flex-1 rounded-xl border text-center py-1.5 px-1 transition-all
                ${r.done ? 'border-brand-gold/40 bg-brand-gold/10' : 'border-white/10 bg-white/5'}
              `}
            >
              <p className="text-[10px] text-white/50 uppercase tracking-wider">{r.label}</p>
              <p className={`font-bold text-xs md:text-sm ${r.done ? 'text-brand-gold' : 'text-white/40'}`}>
                {r.reward}
              </p>
            </div>
          ))}
        </div>

        {/* Check-In Button */}
        <div className="px-6 w-full max-w-sm shrink-0">
          <button
            ref={btnRef}
            onClick={handleCheckIn}
            disabled={checkedIn}
            className={`w-full py-2.5 md:py-3 short:py-2 rounded-xl font-bold text-base md:text-lg short:text-sm uppercase tracking-wide transition-all shadow-[3px_3px_0px_0px_#4a0000]
              ${checkedIn
                ? 'bg-[#2AD858] text-black cursor-default'
                : 'bg-[#D00501] hover:bg-[#b00401] text-white active:scale-95'
              }`}
            style={{ opacity: 0 }} // starts invisible, GSAP animates in
          >
            <AnimatePresence mode="wait">
              {checkedIn ? (
                <motion.span
                  key="done"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  ✓ Checked In!
                </motion.span>
              ) : (
                <motion.span key="idle">Check-In</motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );
};
