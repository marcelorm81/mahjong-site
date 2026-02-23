import React, { useRef, useEffect } from 'react';
import { Page, NavItem } from '../../types';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

/* ── Reward gift PNGs (lock on top of base) ── */
const LOCK_IMG = '/assets/lock.webp';
const BASE_IMG = '/assets/base.webp';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  /** When true, the reward icon is invisible (during lift animation) */
  hideRewardIcon?: boolean;
  /** When true, the reward slot collapses and icons redistribute */
  rewardRedeemed?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: Page.LOBBY,
    label: 'Lobby',
    iconUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Gift.webp'
  },
  {
    id: Page.TOURNAMENT,
    label: 'Tournament',
    iconUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Tournament.webp'
  },
  {
    id: Page.REWARD,
    label: 'Reward',
    iconUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Reward.webp'
  },
  {
    id: Page.STREAK,
    label: 'Streak',
    iconUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Streak.webp'
  },
  {
    id: Page.SHOP,
    label: 'Shop',
    iconUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Shop.webp'
  },
  {
    id: Page.FRIENDS,
    label: 'Friends',
    iconUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Friends.webp'
  },
  {
    id: Page.HISTORY,
    label: 'History',
    iconUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20History.webp'
  },
  {
    id: Page.RANK,
    label: 'Rank',
    iconUrl: '/assets/nav-rank.webp'
  },
  {
    id: Page.TUTORIAL,
    label: 'Tutorial',
    iconUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Tutorial.webp'
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  currentPage, onNavigate, hideRewardIcon, rewardRedeemed,
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLImageElement>(null);
  const baseRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rewardBtnRef = useRef<HTMLButtonElement>(null);
  const shakeRef = useRef<gsap.core.Timeline | null>(null);
  const glowTweenRef = useRef<gsap.core.Tween | null>(null);

  // ── Burst-pause counter-rotation shake + pulsing glow ──
  useEffect(() => {
    if (rewardRedeemed || hideRewardIcon) {
      shakeRef.current?.kill();
      glowTweenRef.current?.kill();
      return;
    }
    const lock = lockRef.current;
    const base = baseRef.current;
    const glow = glowRef.current;
    if (!lock || !base) return;

    // Reset rotation
    gsap.set([lock, base], { rotation: 0 });

    // Burst of counter-rotations, then a 1.5s pause before repeating
    const shake = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    shake
      .to(lock, { rotation: 6,  duration: 0.08, ease: 'power1.inOut' }, 0)
      .to(base, { rotation: -6, duration: 0.08, ease: 'power1.inOut' }, 0)
      .to(lock, { rotation: -5, duration: 0.08, ease: 'power1.inOut' })
      .to(base, { rotation: 5,  duration: 0.08, ease: 'power1.inOut' }, '<')
      .to(lock, { rotation: 4,  duration: 0.07, ease: 'power1.inOut' })
      .to(base, { rotation: -4, duration: 0.07, ease: 'power1.inOut' }, '<')
      .to(lock, { rotation: -3, duration: 0.07, ease: 'power1.inOut' })
      .to(base, { rotation: 3,  duration: 0.07, ease: 'power1.inOut' }, '<')
      .to(lock, { rotation: 0,  duration: 0.06, ease: 'power1.inOut' })
      .to(base, { rotation: 0,  duration: 0.06, ease: 'power1.inOut' }, '<');
    shakeRef.current = shake;

    // Pulsing glow behind icon
    let glowTween: gsap.core.Tween | null = null;
    if (glow) {
      glowTween = gsap.to(glow, {
        scale: 1.4,
        opacity: 0.35,
        duration: 1.0,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      glowTweenRef.current = glowTween;
    }

    return () => {
      shake.kill();
      glowTween?.kill();
    };
  }, [rewardRedeemed, hideRewardIcon]);

  // ── Collapse reward slot on redeem (smooth width → 0) ──
  useEffect(() => {
    if (rewardRedeemed && rewardBtnRef.current) {
      gsap.to(rewardBtnRef.current, {
        width: 0,
        minWidth: 0,
        opacity: 0,
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }
  }, [rewardRedeemed]);

  const handleNavClick = (page: Page, e: React.MouseEvent<HTMLButtonElement>) => {
    onNavigate(page);

    if (navRef.current) {
      const container = navRef.current;
      const target = e.currentTarget;
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const currentScroll = container.scrollLeft;
      const targetCenter = targetRect.left + targetRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const offset = targetCenter - containerCenter;
      container.scrollTo({ left: currentScroll + offset, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[88px] compact:h-[68px] short:h-14 bg-black/40 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div
        ref={navRef}
        className="w-full h-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-center md:justify-center"
      >
        <div className="flex gap-1 min-w-max mx-auto px-4 short:px-12">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.id;
            const isReward = item.id === Page.REWARD;

            return (
              <motion.button
                key={item.id}
                ref={isReward ? rewardBtnRef : undefined}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`relative flex flex-col items-center justify-center w-[72px] compact:w-[64px] h-16 compact:h-[52px] short:h-12 rounded-xl snap-center group
                  ${isReward && rewardRedeemed ? 'pointer-events-none' : ''}`}
                whileTap={{ scale: 0.9 }}
              >
                {/* Yellow Glow on Hover/Active */}
                <div
                  className={`
                    absolute inset-0 bg-brand-yellow/20 blur-xl rounded-full transition-opacity duration-300
                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  `}
                />

                {/* Icon */}
                {isReward && !rewardRedeemed ? (
                  /* ── Reward: stacked lock + base PNGs with burst-pause shake ── */
                  <div
                    data-reward-icon
                    className={`
                      relative z-10 transition-transform duration-300 w-10 h-10 compact:w-8 compact:h-8 short:w-6 short:h-6
                      ${isActive ? 'scale-110 -translate-y-1 compact:-translate-y-0.5 short:-translate-y-0.5' : 'group-hover:scale-105'}
                    `}
                    style={{ opacity: hideRewardIcon ? 0 : 1 }}
                  >
                    <img
                      ref={baseRef}
                      src={BASE_IMG}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain drop-shadow-md"
                    />
                    <img
                      ref={lockRef}
                      src={LOCK_IMG}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain drop-shadow-md"
                    />
                    {/* Shimmer sweep overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none overflow-hidden rounded"
                      style={{ mixBlendMode: 'overlay' as const }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 2.5s ease-in-out infinite',
                        }}
                      />
                    </div>
                    {/* Pulsing radial glow behind icon */}
                    <div
                      ref={glowRef}
                      className="absolute inset-[-50%] rounded-full pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(255,200,50,0.15) 0%, transparent 60%)',
                        transformOrigin: 'center center',
                      }}
                    />
                  </div>
                ) : (
                  /* ── Standard nav icon ── */
                  <div className={`
                    relative z-10 transition-transform duration-300 w-10 h-10 compact:w-8 compact:h-8 short:w-6 short:h-6
                    ${isActive ? 'scale-110 -translate-y-1 compact:-translate-y-0.5 short:-translate-y-0.5' : 'group-hover:scale-105'}
                  `}>
                    <img
                      src={item.iconUrl}
                      alt={item.label}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                )}

                {/* Label */}
                <span className={`
                  relative z-10 text-[9px] compact:text-[8px] short:text-[8px] font-bold mt-1 compact:mt-0.5 short:mt-0.5 uppercase tracking-wider transition-colors duration-300
                  ${isActive ? 'text-brand-gold' : 'text-white'}
                `}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
