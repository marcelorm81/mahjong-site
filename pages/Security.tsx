import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ── Toggle switch ────────────────────────────────────────────────────────────
const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-6 rounded-full p-1 transition-colors duration-200 flex items-center shrink-0
      ${checked ? 'bg-[#2AD858] justify-end' : 'bg-[#ccc] justify-start'}`}
  >
    <div className="w-4 h-4 bg-white rounded-full shadow transition-transform" />
  </button>
);

// ── Change Password Overlay ──────────────────────────────────────────────────
const ChangePasswordOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const font = { fontFamily: "'Teachers', sans-serif" } as const;

  const inputClass =
    'w-full bg-transparent border-b border-white/40 text-white text-[16px] md:text-[18px] tracking-[-0.4px] py-3 outline-none focus:border-white transition-colors placeholder-white/30';

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="pw-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-colors border border-white/20"
          aria-label="Close"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="5" x2="15" y2="15" />
            <line x1="15" y1="5" x2="5" y2="15" />
          </svg>
        </motion.button>

        {/* Dialog */}
        <motion.div
          className="relative z-10 w-full max-w-[480px] rounded-[16px] overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #5a0000 0%, #3a0000 100%)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="px-6 md:px-10 py-8 md:py-10 flex flex-col gap-6">
            {/* Title */}
            <h2
              className="text-white text-[24px] md:text-[32px] tracking-[-1px] text-center italic"
              style={{ ...font, fontWeight: 600 }}
            >
              Change Password
            </h2>

            {/* Current Password */}
            <div className="flex flex-col gap-1">
              <label className="text-white text-[14px] md:text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                Current Password
              </label>
              <input
                type="password"
                value={currentPw}
                onChange={e => setCurrentPw(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
                style={font}
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1">
              <label className="text-white text-[14px] md:text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                New Password
              </label>
              <input
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="••••••••••"
                className={inputClass}
                style={font}
              />
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1">
              <label className="text-white text-[14px] md:text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="••••••••••"
                className={inputClass}
                style={font}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-[6px] border border-white text-white text-[16px] uppercase tracking-[-0.4px] hover:bg-white/10 active:scale-95 transition-all"
                style={{
                  ...font,
                  fontWeight: 600,
                  background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                }}
              >
                DISCARD
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-[6px] bg-[#D00501] text-white text-[16px] uppercase tracking-[-0.4px] hover:bg-[#b00401] active:scale-95 transition-all shadow-[3px_3px_0px_0px_#4a0000]"
                style={{ ...font, fontWeight: 600 }}
              >
                SAVE
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

// ── Mock data ────────────────────────────────────────────────────────────────
interface Device {
  name: string;
  detail: string;
}

interface BlockedAccount {
  username: string;
  blockedDate: string;
}

const MOCK_DEVICES: Device[] = [
  { name: 'Iphone 15 pro max, Spain', detail: 'Chrome, 04/19/2025' },
  { name: 'DESKTOP-6742, Spain', detail: 'Chrome, Used right now' },
];

const MOCK_BLOCKED: BlockedAccount[] = [
  { username: '@username09', blockedDate: 'Blocked 03/24/2024' },
];

// ── Props ────────────────────────────────────────────────────────────────────
interface SecurityProps {
  onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────
export const Security: React.FC<SecurityProps> = ({ onClose }) => {
  const [twoFA, setTwoFA] = useState(true);
  const [showChangePw, setShowChangePw] = useState(false);

  const font = { fontFamily: "'Teachers', sans-serif" } as const;

  // ── Shared row for simple label + value fields ──
  const InfoRow: React.FC<{
    label: string;
    value: React.ReactNode;
    isLink?: boolean;
    onClick?: () => void;
  }> = ({ label, value, isLink, onClick }) => (
    <div className="flex items-center justify-between py-6 border-b border-white gap-6">
      <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
        {label}
      </span>
      {isLink ? (
        <button
          onClick={onClick}
          className="text-white text-[18px] tracking-[-0.4px] underline text-right"
          style={{ ...font, fontWeight: 500 }}
        >
          {value}
        </button>
      ) : (
        <span className="text-white text-[18px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>
          {value}
        </span>
      )}
    </div>
  );

  // ── Desktop content (inside glass panel) ──
  const desktopContent = (
    <div
      className="w-full rounded-[10px] border border-white overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)' }}
    >
      <div className="px-8 xl:px-12 py-6">
        <h2
          className="text-white text-[32px] tracking-[-2px] pb-6 border-b border-white"
          style={{ ...font, fontWeight: 600 }}
        >
          Security &amp; Privacy
        </h2>

        <InfoRow label="Email address" value="email@example.com" />
        <InfoRow label="Password" value="Change Password" isLink onClick={() => setShowChangePw(true)} />

        <div className="flex items-center justify-between py-6 border-b border-white">
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            2-FA autentification
          </span>
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </div>

        <InfoRow label="Phone number" value="+34 560 000 000" />

        <div className="flex flex-col py-6 border-b border-white">
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            Last sign in
          </span>
          <span className="text-white/50 text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            Today at 14:37, Safari, Spain
          </span>
        </div>

        <div className="flex flex-col gap-4 py-6 border-b border-white">
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            Connected Devices ({MOCK_DEVICES.length})
          </span>
          {MOCK_DEVICES.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{d.name}</span>
                <span className="text-white/30 text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{d.detail}</span>
              </div>
              <button className="text-[#bbb] text-[18px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>Disconnect</button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 py-6 border-b border-white">
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            Blocked Accounts ({MOCK_BLOCKED.length})
          </span>
          {MOCK_BLOCKED.map((b, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{b.username}</span>
                <span className="text-white/30 text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{b.blockedDate}</span>
              </div>
              <button className="text-[#bbb] text-[18px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>Unblock</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Mobile content ──
  const mobileContent = (
    <div className="flex flex-col px-5 pb-6">
      <div className="flex items-center justify-between py-5 border-b border-white/20 gap-4">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Username</span>
        <span className="text-white text-[14px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>email@example.com</span>
      </div>

      <div className="flex items-center justify-between py-5 border-b border-white/20 gap-4">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Password</span>
        <button onClick={() => setShowChangePw(true)} className="text-white text-[14px] tracking-[-0.4px] underline text-right" style={{ ...font, fontWeight: 500 }}>Change Password</button>
      </div>

      <div className="flex items-center justify-between py-5 border-b border-white/20">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>2-FA autentification</span>
        <Toggle checked={twoFA} onChange={setTwoFA} />
      </div>

      <div className="flex items-center justify-between py-5 border-b border-white/20 gap-4">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Phone number</span>
        <span className="text-white text-[14px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>+34 560 000 000</span>
      </div>

      <div className="flex flex-col py-5 border-b border-white/20">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Last sign in</span>
        <span className="text-white/50 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Today at 14:37, Safari, Spain</span>
      </div>

      <div className="flex flex-col gap-3 py-5 border-b border-white/20">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Connected Devices ({MOCK_DEVICES.length})</span>
        {MOCK_DEVICES.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{d.name}</span>
              <span className="text-white/30 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{d.detail}</span>
            </div>
            <button className="text-[#bbb] text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Disconnect</button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 py-5 border-b border-white/20">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Blocked Accounts ({MOCK_BLOCKED.length})</span>
        {MOCK_BLOCKED.map((b, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{b.username}</span>
              <span className="text-white/30 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{b.blockedDate}</span>
            </div>
            <button className="text-[#bbb] text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Unblock</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{desktopContent}</div>
      <div className="md:hidden">{mobileContent}</div>
      {showChangePw && <ChangePasswordOverlay onClose={() => setShowChangePw(false)} />}
    </>
  );
};
