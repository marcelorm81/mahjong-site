import React from 'react';
import { Users, Eye, Star, Lock, Clock } from 'lucide-react';
import { TableItem } from '../../types';
import { motion } from 'framer-motion';

interface TableCardProps {
  table: TableItem;
  onJoin: (tableId: string) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onJoin }) => {
  const isLocked = table.isLocked;
  const isComingSoon = table.isComingSoon;
  
  // Neon Nights (3) and Lost City (5) need a black silhouette and special SP message
  const isSpecialTable = table.id === '3' || table.id === '5';

  // Determine if buttons should be hidden. 
  // We hide buttons if locked/coming soon, EXCEPT for special tables where we want them visible per request.
  const hideFooter = (isLocked || isComingSoon) && !isSpecialTable;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      // Updated aspect ratio to [3/4] on all sizes to keep cards tall and large even in 3-col grid
      className={`
        relative group w-full aspect-[3/4] rounded-3xl overflow-hidden
        ${(isLocked || isComingSoon) && !isSpecialTable ? 'grayscale-[0.8] opacity-90' : ''}
        ${isSpecialTable ? 'grayscale-[0.2]' : ''}
      `}
    >
      {/* Decorative radial glow */}
      <div className="absolute inset-0 bg-radial-gradient from-brand-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header Elements (Absolute Overlay) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white/80 z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-md pointer-events-auto">
          <Users size={14} className="text-white" />
          <span className="text-xs font-bold">{table.playersCurrent}/{table.playersMax}</span>
        </div>
        
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-black/40 p-1.5 rounded-lg backdrop-blur-md cursor-pointer hover:bg-white/10">
            <Eye size={14} />
          </div>
          <div className="bg-black/40 p-1.5 rounded-lg backdrop-blur-md cursor-pointer hover:bg-white/10">
            <Star size={14} className="text-brand-gold" />
          </div>
        </div>
      </div>

      {/* Main Content Layout - Strict Flex Column */}
      <div className="absolute inset-0 flex flex-col p-3 z-10">
        
        {/* Title Area */}
        {/* Added top padding to clear the absolute header items */}
        <div className="mt-8 flex-shrink-0">
          <h3 className="text-white font-display font-bold text-lg text-center drop-shadow-md group-hover:text-brand-gold transition-colors line-clamp-1 px-2">
            {table.title}
          </h3>
        </div>

        {/* Image Area - Flex 1 to take all remaining space */}
        <div className="flex-1 relative min-h-0 w-full my-1">
            {/* 
              Image is absolute inset-0 to ensure it scales within the flex-1 container 
              object-contain ensures NO CROPPING.
            */}
            <img 
              src={table.imageUrl} 
              alt={table.title}
              className={`
                absolute inset-0 w-full h-full object-contain object-center drop-shadow-2xl transition-all duration-300
                ${isSpecialTable ? 'brightness-0 opacity-80' : ''}
              `}
            />
            
            {/* Floor Glow */}
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-8 bg-black/50 blur-xl rounded-full -z-10 ${isSpecialTable ? 'opacity-20' : ''}`} />
        </div>

        {/* Overlay Status */}
        {/* Special Case: Neon Nights & Lost City - Text Only */}
        {isSpecialTable ? (
           <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
             <span className="text-white font-black text-[10px] sm:text-xs tracking-widest text-center px-4 uppercase font-display drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" style={{ textShadow: '0 0 5px rgba(0,0,0,1), 0 0 10px #D00501' }}>
               SP TO UNLOCK
             </span>
           </div>
        ) : (
          /* Standard Locked/Coming Soon Pill */
          (isLocked || isComingSoon) && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
               <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex flex-col items-center shadow-xl">
                 {isLocked ? <Lock size={32} className="text-gray-400 mb-2" /> : <Clock size={32} className="text-brand-gold mb-2" />}
                 <span className="text-white font-bold uppercase tracking-wider text-sm text-center">
                   {isLocked ? 'Locked' : 'Coming Soon'}
                 </span>
                 {isLocked && <span className="text-xs text-white/50 mt-1">Lvl 50 Required</span>}
               </div>
            </div>
          )
        )}

        {/* Footer: Action Buttons - Flex Shrink 0 to never collapse */}
        <div className={`w-full flex-shrink-0 mt-1 transition-opacity duration-300 ${hideFooter ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center justify-between gap-2">
            
            {/* Win Button */}
            <div className="flex-1 h-9 sm:h-10 rounded-[6px] bg-[#4A0000] relative flex items-center justify-center shadow-sm overflow-hidden min-w-0 border border-white/5">
               <img 
                 src="https://raw.githubusercontent.com/marcelorm81/Mahjongtest/1d4df09d4bfec9111e77e0720256ca1cc071dfbc/coinstack.png" 
                 className="absolute left-2 w-3.5 h-3.5 object-contain opacity-80"
                 alt="Win"
               />
               <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide pl-5 whitespace-nowrap overflow-hidden text-ellipsis">
                 WIN {table.winAmount.toLocaleString()}
               </span>
            </div>
            
            {/* Join Button */}
            <motion.button 
              whileTap={{ scale: 0.96 }}
              onClick={() => onJoin(table.id)}
              className="flex-1 h-9 sm:h-10 rounded-[6px] bg-[#D00501] shadow-[0_2px_0_0_#4A0000] flex items-center justify-between px-2 sm:px-3 transition-all min-w-0 border-t border-white/20 active:shadow-none active:translate-y-[2px]"
            >
              <div className="flex items-center gap-1 min-w-0">
                <img 
                   src="https://raw.githubusercontent.com/marcelorm81/Mahjongtest/1d4df09d4bfec9111e77e0720256ca1cc071dfbc/coin.png" 
                   className="w-3.5 h-3.5 object-contain flex-shrink-0"
                   alt="Cost"
                 />
                <span className="text-white text-[10px] sm:text-xs font-black tracking-wide truncate">
                  {table.entryCost.toLocaleString()}
                </span>
              </div>
              
              <span className="text-white text-[10px] sm:text-xs font-black tracking-wide uppercase flex-shrink-0 ml-1">
                JOIN
              </span>
            </motion.button>

          </div>
        </div>

      </div>
    </motion.div>
  );
};