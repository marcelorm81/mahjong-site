import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Wallet, CreditCard } from 'lucide-react';

// ── Menu data ─────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { icon: User,       label: 'My Account' },
  { icon: Bell,       label: 'Notifications' },
  { icon: Lock,       label: 'Security & Privacy' },
  { icon: Wallet,     label: 'Wallet & Virtual Currency' },
  { icon: CreditCard, label: 'Payments' },
] as const;

const LINK_ITEMS = ['Log Out', 'Delete Account', 'Help Center'] as const;

// ── Settings Panel ────────────────────────────────────────────────────────────
interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  return (
    <>
      {/* Invisible full-screen backdrop — click to close */}
      <motion.div
        className="fixed inset-0 z-[9998]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Panel — anchored to top-right, just below the header */}
      <motion.div
        className="fixed z-[9999] top-[72px] right-3 md:top-[78px] md:right-6"
        initial={{ opacity: 0, y: -10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className="relative flex flex-col gap-4 p-5 rounded-[20px] overflow-hidden"
          style={{
            width: 'min(320px, 90vw)',
            background: 'rgba(60, 0, 0, 0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          {/* Radial white gradient overlay (Figma: 20% opacity) */}
          <div
            className="absolute inset-0 pointer-events-none rounded-[20px]"
            style={{
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 70%)',
            }}
          />

          {/* Icon menu items */}
          <div className="relative flex flex-col gap-1">
            {MENU_ITEMS.map(({ icon: Icon, label }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.2 }}
                className="flex items-center gap-3 px-2.5 py-2 rounded-[10px] text-left
                           hover:bg-white/10 active:bg-white/15 transition-colors w-full"
              >
                <Icon size={22} className="text-[#e3e3e3] shrink-0" strokeWidth={1.6} />
                <span
                  className="text-white text-[18px] tracking-[-0.4px] leading-none"
                  style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
                >
                  {label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative h-px bg-white/10 mx-2.5" />

          {/* Text-only links */}
          <div className="relative flex flex-col px-2.5">
            {LINK_ITEMS.map((label, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.2 }}
                className="py-1.5 text-left hover:text-white/80 active:text-white/60 transition-colors"
              >
                <span
                  className="text-white/50 text-[16px] tracking-[-0.4px] leading-none"
                  style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
                >
                  {label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};
