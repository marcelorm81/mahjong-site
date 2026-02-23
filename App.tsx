import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AppShell } from './components/AppShell/AppShell';
import { SettingsShell, SettingsTab } from './components/SettingsShell';
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
import { Notifications } from './pages/Notifications';
import { Security } from './pages/Security';
import { WalletCurrency } from './pages/WalletCurrency';
import { Payments } from './pages/Payments';
import { Tutorial } from './pages/Tutorial';
import { Reward } from './pages/Reward';
import { MOCK_USER } from './constants';
import { Page, User } from './types';
import { AnimatePresence, motion } from 'framer-motion';

// Pages that render as overlays on top of the current page
const OVERLAY_PAGES = new Set([Page.STREAK, Page.REWARD]);

// Mobile title for each settings tab
const SETTINGS_MOBILE_TITLES: Record<SettingsTab, string> = {
  'my-account': 'MY ACCOUNT',
  'notifications': 'NOTIFICATIONS',
  'security': 'SECURITY & PRIVACY',
  'wallet': 'WALLET & VIRTUAL CURRENCY',
  'payments': 'PAYMENTS',
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [overlay, setOverlay] = useState<Page | null>(null);
  const [user, setUser] = useState<User>(MOCK_USER);

  // Settings dropdown (cog)
  const [showSettings, setShowSettings] = useState(false);

  // Settings sub-pages (My Account, Notifications, etc.)
  const [settingsTab, setSettingsTab] = useState<SettingsTab | null>(null);

  // When plus (+) is tapped, navigate to Shop and scroll to Star Points
  const [scrollToStarPoints, setScrollToStarPoints] = useState(false);

  // Reward animation state
  const [hideRewardIcon, setHideRewardIcon] = useState(false);
  const [rewardRedeemed, setRewardRedeemed] = useState(false);

  const handleLogin = (username: string) => {
    setUser(prev => ({ ...prev, username }));
    setCurrentPage(Page.LOBBY);
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const handleNavigate = (page: Page) => {
    setShowSettings(false);
    setSettingsTab(null);
    if (OVERLAY_PAGES.has(page)) {
      if (page === Page.REWARD) {
        // Reward overlay manages its own animation — hide the nav icon immediately
        setOverlay(prev => (prev === page ? null : page));
        if (overlay !== page) setHideRewardIcon(true);
        else setHideRewardIcon(false);
      } else {
        setOverlay(prev => (prev === page ? null : page));
      }
    } else {
      setOverlay(null);
      setCurrentPage(page);
    }
  };

  // Reward dismiss — reverse animation finished, restore nav icon
  const handleRewardDismiss = () => {
    setOverlay(null);
    setHideRewardIcon(false);
  };

  // Reward redeem — overlay closes, nav icon stays hidden permanently
  const handleRewardRedeem = () => {
    setOverlay(null);
    setHideRewardIcon(false);
    setRewardRedeemed(true);
  };

  const handleAddCoins = () => {
    setShowSettings(false);
    setSettingsTab(null);
    setScrollToStarPoints(false);
    setCurrentPage(Page.SHOP);
    setOverlay(null);
    setTimeout(() => setScrollToStarPoints(true), 50);
  };

  const handleCloseSettings = () => {
    setSettingsTab(null);
  };

  const renderSettingsContent = () => {
    switch (settingsTab) {
      case 'my-account':
        return (
          <MyAccount
            onClose={handleCloseSettings}
            initialUsername={user.username}
          />
        );
      case 'notifications':
        return <Notifications onClose={handleCloseSettings} />;
      case 'security':
        return <Security onClose={handleCloseSettings} />;
      case 'wallet':
        return <WalletCurrency onClose={handleCloseSettings} />;
      case 'payments':
        return <Payments onClose={handleCloseSettings} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (settingsTab) {
      return (
        <SettingsShell
          activeTab={settingsTab}
          onChangeTab={setSettingsTab}
          onClose={handleCloseSettings}
          mobileTitle={SETTINGS_MOBILE_TITLES[settingsTab]}
        >
          {renderSettingsContent()}
        </SettingsShell>
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
        return <Tutorial onClose={() => handleNavigate(Page.LOBBY)} onNavigate={handleNavigate} />;
      default:
        return <Lobby />;
    }
  };

  const renderOverlay = () => {
    switch (overlay) {
      case Page.STREAK:
        return <Streak onClose={() => setOverlay(null)} />;
      // Reward is rendered in its own portal below — not here
      default:
        return null;
    }
  };

  const isFullscreenPage = currentPage === Page.LOGIN || currentPage === Page.TUTORIAL;

  return (
    <>
      <AppShell
        user={user}
        currentPage={overlay ?? currentPage}
        onNavigate={handleNavigate}
        onOpenSettings={() => setShowSettings(prev => !prev)}
        onAddCoins={handleAddCoins}
        showNav={!isFullscreenPage}
        showHeader={!isFullscreenPage}
        contentKey={settingsTab ? `settings-${settingsTab}` : undefined}
        hideRewardIcon={hideRewardIcon}
        rewardRedeemed={rewardRedeemed}
      >
        {renderContent()}
      </AppShell>

      {/* ── Standard overlays (Streak) — portal at body level ── */}
      {createPortal(
        <AnimatePresence>
          {overlay && overlay !== Page.REWARD && (
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

      {/* ── Reward overlay — own portal, manages its own backdrop/animation ── */}
      {overlay === Page.REWARD && createPortal(
        <Reward onClose={handleRewardDismiss} onRedeem={handleRewardRedeem} />,
        document.body
      )}

      {/* ── Settings dropdown — portal at body level ── */}
      {createPortal(
        <AnimatePresence>
          {showSettings && (
            <Settings
              onClose={() => setShowSettings(false)}
              onOpenTab={(tab) => {
                setShowSettings(false);
                setSettingsTab(tab);
              }}
            />
          )}
        </AnimatePresence>,
        document.body
      )}

    </>
  );
};

export default App;
