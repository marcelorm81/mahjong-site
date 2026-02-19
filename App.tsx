import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AppShell } from './components/AppShell/AppShell';
import { Lobby } from './pages/Lobby';
import { Login } from './pages/Login';
import { History } from './pages/History';
import { Friends } from './pages/Friends';
import { Rank } from './pages/Rank';
import { Profile } from './pages/Profile';
import { Shop } from './pages/Shop';
import { Tournament } from './pages/Tournament';
import { Streak } from './pages/Streak';
import { Settings } from './pages/Settings';
import { MyAccount } from './pages/MyAccount';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { MOCK_USER } from './constants';
import { Page, User } from './types';
import { BookOpen, Gift } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Pages that render as overlays on top of the current page
const OVERLAY_PAGES = new Set([Page.STREAK, Page.REWARD]);

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [overlay, setOverlay] = useState<Page | null>(null);
  const [user, setUser] = useState<User>(MOCK_USER);

  // Settings dropdown (cog)
  const [showSettings, setShowSettings] = useState(false);

  // My Account full-screen overlay
  const [showMyAccount, setShowMyAccount] = useState(false);

  // When plus (+) is tapped, navigate to Shop and scroll to Star Points
  const [scrollToStarPoints, setScrollToStarPoints] = useState(false);

  const handleLogin = (username: string) => {
    setUser(prev => ({ ...prev, username }));
    setCurrentPage(Page.LOBBY);
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const handleNavigate = (page: Page) => {
    setShowSettings(false);
    setShowMyAccount(false);
    if (OVERLAY_PAGES.has(page)) {
      setOverlay(prev => (prev === page ? null : page));
    } else {
      setOverlay(null);
      setCurrentPage(page);
    }
  };

  const handleAddCoins = () => {
    setShowSettings(false);
    setShowMyAccount(false);
    setScrollToStarPoints(false);
    setCurrentPage(Page.SHOP);
    setOverlay(null);
    setTimeout(() => setScrollToStarPoints(true), 50);
  };

  const renderContent = () => {
    if (showMyAccount) {
      return (
        <MyAccount
          onClose={() => setShowMyAccount(false)}
          initialUsername={user.username}
        />
      );
    }

    switch (currentPage) {
      case Page.LOGIN:
        return <Login onLogin={handleLogin} />;
      case Page.LOBBY:
        return <Lobby />;
      case Page.TOURNAMENT:
        return <Tournament />;
      case Page.HISTORY:
        return <History />;
      case Page.FRIENDS:
        return <Friends />;
      case Page.SHOP:
        return <Shop scrollToStarPoints={scrollToStarPoints} />;
      case Page.RANK:
        return <Rank />;
      case Page.PROFILE:
        return <Profile user={user} onUpdateUser={handleUpdateUser} onNavigate={handleNavigate} />;
      case Page.TUTORIAL:
        return <PlaceholderPage title="How to Play" icon={BookOpen} />;
      default:
        return <Lobby />;
    }
  };

  const renderOverlay = () => {
    switch (overlay) {
      case Page.STREAK:
        return <Streak onClose={() => setOverlay(null)} />;
      case Page.REWARD:
        return <PlaceholderPage title="Daily Rewards" icon={Gift} />;
      default:
        return null;
    }
  };

  const isLoginPage = currentPage === Page.LOGIN;

  return (
    <>
      <AppShell
        user={user}
        currentPage={overlay ?? currentPage}
        onNavigate={handleNavigate}
        onOpenSettings={() => setShowSettings(prev => !prev)}
        onAddCoins={handleAddCoins}
        showNav={!isLoginPage}
        showHeader={!isLoginPage}
        contentKey={showMyAccount ? 'my-account' : undefined}
      >
        {renderContent()}
      </AppShell>

      {/* ── Page overlays (Streak, Reward) — portal at body level ── */}
      {createPortal(
        <AnimatePresence>
          {overlay && (
            <motion.div
              key={overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-[9999] flex items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => setOverlay(null)}
              />
              <motion.button
                onClick={() => setOverlay(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20"
                aria-label="Close"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <line x1="5" y1="5" x2="15" y2="15" />
                  <line x1="15" y1="5" x2="5" y2="15" />
                </svg>
              </motion.button>
              <motion.div
                className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden flex items-center justify-center py-16"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.15, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {renderOverlay()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ── Settings dropdown — portal at body level ── */}
      {createPortal(
        <AnimatePresence>
          {showSettings && (
            <Settings
              onClose={() => setShowSettings(false)}
              onOpenMyAccount={() => setShowMyAccount(true)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

    </>
  );
};

export default App;
