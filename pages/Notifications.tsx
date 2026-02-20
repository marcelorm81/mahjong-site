import React, { useState } from 'react';

// ── Toggle switch component ─────────────────────────────────────────────────
const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <div className="flex gap-2 items-center">
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full p-1 transition-colors duration-200 flex items-center
        ${checked ? 'bg-[#2AD858] justify-end' : 'bg-[#ccc] justify-start'}`}
    >
      <div className="w-4 h-4 bg-white rounded-full shadow transition-transform" />
    </button>
    <span
      className="text-white text-[14px] tracking-[-0.4px]"
      style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
    >
      {label}
    </span>
  </div>
);

// ── State ───────────────────────────────────────────────────────────────────
interface NotificationState {
  emailNotification: boolean;
  desktopNotification: boolean;
  mobilePush: boolean;
  marketing: boolean;
  gameInvites: boolean;
  rewards: boolean;
  announcements: boolean;
  support: boolean;
}

const DEFAULT_STATE: NotificationState = {
  emailNotification: true,
  desktopNotification: false,
  mobilePush: false,
  marketing: true,
  gameInvites: true,
  rewards: true,
  announcements: false,
  support: true,
};

// ── Props ───────────────────────────────────────────────────────────────────
interface NotificationsProps {
  onClose: () => void;
}

// ── Component ───────────────────────────────────────────────────────────────
export const Notifications: React.FC<NotificationsProps> = ({ onClose }) => {
  const [state, setState] = useState<NotificationState>(DEFAULT_STATE);

  const set = (key: keyof NotificationState) => (val: boolean) =>
    setState(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    // Save logic here when backend is wired
    onClose();
  };

  // ── Desktop panel content (inside glass panel) ──
  const desktopContent = (
    <div
      className="w-full rounded-[10px] border border-white overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)' }}
    >
      <div className="px-8 xl:px-12 py-6">
        {/* Section title */}
        <h2
          className="text-white text-[32px] tracking-[-2px] pb-6 border-b border-white"
          style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 600 }}
        >
          Notifications
        </h2>

        {/* Choose where you get notified */}
        <div className="py-6 border-b border-white">
          <p
            className="text-white text-[16px] tracking-[-0.4px] mb-4"
            style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
          >
            Choose where you get notified
          </p>
          <div className="flex flex-col gap-4">
            <Toggle checked={state.emailNotification} onChange={set('emailNotification')} label="Email notification" />
            <Toggle checked={state.desktopNotification} onChange={set('desktopNotification')} label="Desktop notification" />
            <Toggle checked={state.mobilePush} onChange={set('mobilePush')} label="Mobile push notifications" />
          </div>
        </div>

        {/* Email Notifications */}
        <div className="py-6">
          <p
            className="text-white text-[16px] tracking-[-0.4px] mb-4"
            style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
          >
            Email Notifications
          </p>
          <div className="flex flex-col gap-4">
            <Toggle checked={state.marketing} onChange={set('marketing')} label="Marketing" />
            <Toggle checked={state.gameInvites} onChange={set('gameInvites')} label="Game Invites" />
            <Toggle checked={state.rewards} onChange={set('rewards')} label="Rewards" />
            <Toggle checked={state.announcements} onChange={set('announcements')} label="Announcements & Updates" />
            <Toggle checked={state.support} onChange={set('support')} label="Support" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <button
            onClick={onClose}
            className="px-8 py-2 rounded-[6px] border border-white text-white text-[16px] uppercase tracking-[-0.4px] hover:bg-white/10 active:scale-95 transition-all"
            style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 rounded-[6px] bg-[#D00501] text-white text-[16px] uppercase tracking-[-0.4px] hover:bg-[#b00401] active:scale-95 transition-all shadow-[3px_3px_0px_0px_#4a0000]"
            style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 600 }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  // ── Mobile content ──
  const mobileContent = (
    <div className="flex flex-col gap-5 px-8 pb-6">
      {/* Choose where you get notified */}
      <div className="flex flex-col gap-4">
        <p
          className="text-white text-[16px] tracking-[-0.4px]"
          style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
        >
          Choose where you get notified
        </p>
        <Toggle checked={state.emailNotification} onChange={set('emailNotification')} label="Email notification" />
        <Toggle checked={state.desktopNotification} onChange={set('desktopNotification')} label="Desktop notification" />
        <Toggle checked={state.mobilePush} onChange={set('mobilePush')} label="Mobile push notifications" />
      </div>

      {/* Email Notifications */}
      <div className="flex flex-col gap-4 mt-4">
        <p
          className="text-white text-[16px] tracking-[-0.4px]"
          style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
        >
          Email Notifications
        </p>
        <Toggle checked={state.marketing} onChange={set('marketing')} label="Marketing" />
        <Toggle checked={state.gameInvites} onChange={set('gameInvites')} label="Game Invites" />
        <Toggle checked={state.rewards} onChange={set('rewards')} label="Rewards" />
        <Toggle checked={state.announcements} onChange={set('announcements')} label="Announcements & Updates" />
        <Toggle checked={state.support} onChange={set('support')} label="Support" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2.5 pt-2 pb-4">
        <button
          onClick={onClose}
          className="flex-1 py-4 rounded-[6px] border border-white text-white text-[18px] uppercase tracking-[-0.6px] hover:bg-white/10 active:scale-95 transition-all"
          style={{
            fontFamily: "'Teachers', sans-serif",
            fontWeight: 600,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0) 70%)',
          }}
        >
          CANCEL
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-3.5 rounded-[6px] bg-[#D00501] text-white text-[16px] uppercase tracking-[-0.4px] hover:bg-[#b00401] active:scale-95 transition-all shadow-[3px_3px_0px_0px_#4a0000]"
          style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 600 }}
        >
          SAVE
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: only the panel content (shell is provided by parent) */}
      <div className="hidden md:block">{desktopContent}</div>
      {/* Mobile: only the body content (shell is provided by parent) */}
      <div className="md:hidden">{mobileContent}</div>
    </>
  );
};
