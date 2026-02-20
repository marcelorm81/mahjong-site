import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Wallet, CreditCard, ArrowLeft } from 'lucide-react';

// ── Settings sidebar items ──────────────────────────────────────────────────
export type SettingsTab = 'my-account' | 'notifications' | 'security' | 'wallet' | 'payments';

const SIDEBAR_ITEMS: { icon: typeof User; label: string; tab: SettingsTab }[] = [
  { icon: User,       label: 'My Account',                tab: 'my-account'    },
  { icon: Bell,       label: 'Notifications',              tab: 'notifications' },
  { icon: Lock,       label: 'Security & Privacy',         tab: 'security'      },
  { icon: Wallet,     label: 'Wallet & Virtual Currency',  tab: 'wallet'        },
  { icon: CreditCard, label: 'Payments',                   tab: 'payments'      },
];

const SIDEBAR_LINKS = ['Log Out', 'Delete Account', 'Help Center'] as const;

interface SettingsShellProps {
  activeTab: SettingsTab;
  onChangeTab: (tab: SettingsTab) => void;
  onClose: () => void;
  /** Mobile page title (e.g. "MY ACCOUNT", "NOTIFICATIONS") */
  mobileTitle: string;
  children: React.ReactNode;
}

export const SettingsShell: React.FC<SettingsShellProps> = ({
  activeTab,
  onChangeTab,
  onClose,
  mobileTitle,
  children,
}) => {
  return (
    <>
      {/* ───────────────── DESKTOP layout ───────────────── */}
      <div className="hidden md:flex flex-col w-full h-full min-h-0">
        {/* Centered SETTINGS title */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-white text-2xl uppercase tracking-[-0.6px] text-center py-4"
          style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 600 }}
        >
          SETTINGS
        </motion.p>

        {/* Content row: sidebar + panel */}
        <div className="flex flex-1 min-h-0">
          {/* Left sidebar — settings nav */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="w-[280px] xl:w-[320px] shrink-0 flex flex-col gap-4 pt-8 pl-[max(48px,5.6%)]"
          >
            {SIDEBAR_ITEMS.map(({ icon: Icon, label, tab }) => (
              <button
                key={tab}
                onClick={() => onChangeTab(tab)}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-[10px] text-left transition-colors w-full
                  ${activeTab === tab ? 'bg-[#D00501]' : 'hover:bg-white/10'}`}
              >
                <Icon size={22} className="text-[#e3e3e3] shrink-0" strokeWidth={1.6} />
                <span
                  className="text-white text-[18px] tracking-[-0.4px] leading-none"
                  style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
                >
                  {label}
                </span>
              </button>
            ))}

            <div className="flex flex-col px-2.5 mt-2">
              {SIDEBAR_LINKS.map(label => (
                <button key={label} className="py-1.5 text-left">
                  <span
                    className="text-white/50 text-[16px] tracking-[-0.4px]"
                    style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </motion.aside>

          {/* Right: content panel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex-1 pr-[48px] pb-8 pl-8 xl:pl-12 overflow-y-auto"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* ───────────────── MOBILE layout ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="md:hidden flex flex-col w-full min-h-full"
      >
        {/* Header row: back arrow + title */}
        <div className="flex items-center justify-center px-5 py-4 relative">
          <button
            onClick={onClose}
            className="absolute left-5 p-1 hover:opacity-70 active:scale-90 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>
          <h1
            className="text-white text-[18px] uppercase tracking-[-0.36px]"
            style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 600 }}
          >
            {mobileTitle}
          </h1>
        </div>

        {/* Page content */}
        {children}
      </motion.div>
    </>
  );
};
