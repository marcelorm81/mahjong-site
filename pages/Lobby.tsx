import React, { useState } from 'react';
import { MOCK_TABLES } from '../constants';
import { TableCard } from '../components/Lobby/TableCard';
import { motion } from 'framer-motion';

export const Lobby: React.FC = () => {
  const [category, setCategory] = useState<'BANG' | 'TOURNAMENT'>('BANG');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 short:py-2">
      
      {/* Segmented Control */}
      <div className="flex justify-center mb-6 md:mb-8 short:mb-2">
        <div className="w-full max-w-[320px] md:max-w-md short:max-w-[280px] bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 flex relative transition-all duration-300">
          {/* Active Pill Background */}
          <motion.div 
            className="absolute top-1 bottom-1 bg-brand-crimson rounded-full shadow-lg"
            layoutId="category-pill"
            initial={false}
            animate={{ 
              left: category === 'BANG' ? 4 : '50%', 
              width: 'calc(50% - 4px)' 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          <button 
            onClick={() => setCategory('BANG')}
            className={`flex-1 relative z-10 py-1.5 md:py-2 short:py-1 rounded-full font-bold text-xs md:text-sm short:text-[10px] tracking-wide transition-colors text-center ${category === 'BANG' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            BANG BANG TABLES
          </button>
          <button 
            onClick={() => setCategory('TOURNAMENT')}
            className={`flex-1 relative z-10 py-1.5 md:py-2 short:py-1 rounded-full font-bold text-xs md:text-sm short:text-[10px] tracking-wide transition-colors text-center ${category === 'TOURNAMENT' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            COMING SOON
          </button>
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 short:gap-y-3 short:gap-x-6"
      >
        {MOCK_TABLES.map((table) => (
          /* Wrapper to control width at specific breakpoints: 
             - Mobile: w-full (1 col)
             - Tablet (md): w-[80%] (2 cols, reduced size)
             - Mobile Landscape (short): w-[65%] (Distinctly smaller to fit short viewport)
             - Desktop (lg): w-full (3 cols, standard size)
          */
          <div key={table.id} className="w-full md:w-[80%] short:w-[65%] lg:w-full mx-auto transition-all duration-300">
            <TableCard 
              table={table} 
              onJoin={(id) => console.log(`Joined table ${id}`)} 
            />
          </div>
        ))}
      </motion.div>
      
      {/* Spacing for bottom nav visuals */}
      <div className="h-8" />
    </div>
  );
};