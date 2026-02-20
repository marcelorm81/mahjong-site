import React, { useRef } from 'react';
import { Page, NavItem } from '../../types';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
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
    iconUrl: '/assets/nav-rank.png'
  },
  {
    id: Page.TUTORIAL,
    label: 'Tutorial',
    iconUrl: 'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Tutorial.webp'
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const navRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (page: Page, e: React.MouseEvent<HTMLButtonElement>) => {
    // 1. Perform navigation
    onNavigate(page);

    // 2. Smoothly scroll container to center the clicked item
    if (navRef.current) {
      const container = navRef.current;
      const target = e.currentTarget;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      // Calculate where the item is currently relative to the viewport center of the container
      const currentScroll = container.scrollLeft;
      const targetCenter = targetRect.left + targetRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      
      const offset = targetCenter - containerCenter;

      container.scrollTo({
        left: currentScroll + offset,
        behavior: 'smooth'
      });
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

            return (
              <motion.button
                key={item.id}
                onClick={(e) => handleNavClick(item.id, e)}
                className="relative flex flex-col items-center justify-center w-[72px] compact:w-[64px] h-16 compact:h-[52px] short:h-12 rounded-xl snap-center group"
                whileTap={{ scale: 0.9 }}
              >
                {/* Yellow Glow on Hover/Active */}
                <div
                  className={`
                    absolute inset-0 bg-brand-yellow/20 blur-xl rounded-full transition-opacity duration-300
                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  `}
                />

                {/* Icon Image */}
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