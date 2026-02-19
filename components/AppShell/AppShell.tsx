import React from 'react';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { User, Page } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface AppShellProps {
  children: React.ReactNode;
  user: User;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenSettings?: () => void;
  onAddCoins?: () => void;
  showNav?: boolean;
  showHeader?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  user,
  currentPage,
  onNavigate,
  onOpenSettings,
  onAddCoins,
  showNav = true,
  showHeader = true
}) => {
  return (
    <div
      className="bg-[#620000] relative flex flex-col"
      style={{
        // Extend the app into safe areas so our dark bg covers status bar + home indicator
        height: '100dvh',
        maxHeight: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Safe-area fills — dark bg bleeds behind status bar (top) and home indicator (bottom) */}
      <div className="fixed inset-x-0 top-0 pointer-events-none z-[100]"
        style={{ height: 'env(safe-area-inset-top)', background: '#1a0000' }} />
      <div className="fixed inset-x-0 bottom-0 pointer-events-none z-[100]"
        style={{ height: 'env(safe-area-inset-bottom)', background: '#1a0000' }} />

      {/* Background Pattern */}
      <div
        className="fixed inset-0 opacity-100 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/pattern1.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '150px 150px' // Reduced size by 50%
        }}
      />
      
      {/* Top Header */}
      {showHeader && (
        <TopHeader
          user={user}
          onOpenSettings={onOpenSettings ?? (() => {})}
          onOpenProfile={() => onNavigate(Page.PROFILE)}
          onAddCoins={onAddCoins}
          onNavigate={onNavigate}
        />
      )}

      {/* Main Scrollable Content */}
      <main
        className={`
          flex-1 relative z-10 overflow-y-auto overflow-x-hidden transition-all duration-300
          ${showHeader ? 'pt-[100px] md:pt-[75px]' : ''}
          ${showNav ? 'pb-[100px] short:pb-[60px]' : ''}
        `}
        style={{ overscrollBehaviorY: 'contain' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      {showNav && (
        <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
      )}
    </div>
  );
};