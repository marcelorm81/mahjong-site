import React, { useState } from 'react';

// ── Toggle switch (reused from Notifications) ────────────────────────────────
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

  const font = { fontFamily: "'Teachers', sans-serif" } as const;

  // ── Shared row for simple label + value fields ──
  const InfoRow: React.FC<{
    label: string;
    value: React.ReactNode;
    isLink?: boolean;
  }> = ({ label, value, isLink }) => (
    <div className="flex items-center justify-between py-6 border-b border-white gap-6">
      <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
        {label}
      </span>
      {isLink ? (
        <button
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
        {/* Section title */}
        <h2
          className="text-white text-[32px] tracking-[-2px] pb-6 border-b border-white"
          style={{ ...font, fontWeight: 600 }}
        >
          Security &amp; Privacy
        </h2>

        {/* Email address */}
        <InfoRow label="Email address" value="email@example.com" />

        {/* Password */}
        <InfoRow label="Password" value="Change Password" isLink />

        {/* 2-FA */}
        <div className="flex items-center justify-between py-6 border-b border-white">
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            2-FA autentification
          </span>
          <Toggle checked={twoFA} onChange={setTwoFA} />
        </div>

        {/* Phone number */}
        <InfoRow label="Phone number" value="+34 560 000 000" />

        {/* Last sign in */}
        <div className="flex flex-col py-6 border-b border-white">
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            Last sign in
          </span>
          <span className="text-white/50 text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            Today at 14:37, Safari, Spain
          </span>
        </div>

        {/* Connected Devices */}
        <div className="flex flex-col gap-4 py-6 border-b border-white">
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            Connected Devices ({MOCK_DEVICES.length})
          </span>
          {MOCK_DEVICES.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                  {d.name}
                </span>
                <span className="text-white/30 text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                  {d.detail}
                </span>
              </div>
              <button className="text-[#bbb] text-[18px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>
                Disconnect
              </button>
            </div>
          ))}
        </div>

        {/* Blocked Accounts */}
        <div className="flex flex-col gap-4 py-6 border-b border-white">
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            Blocked Accounts ({MOCK_BLOCKED.length})
          </span>
          {MOCK_BLOCKED.map((b, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                  {b.username}
                </span>
                <span className="text-white/30 text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                  {b.blockedDate}
                </span>
              </div>
              <button className="text-[#bbb] text-[18px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>
                Unblock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Mobile content ──
  const mobileContent = (
    <div className="flex flex-col px-5 pb-6">
      {/* Email address */}
      <div className="flex items-center justify-between py-5 border-b border-white/20 gap-4">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
          Username
        </span>
        <span className="text-white text-[14px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>
          email@example.com
        </span>
      </div>

      {/* Password */}
      <div className="flex items-center justify-between py-5 border-b border-white/20 gap-4">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
          Password
        </span>
        <button className="text-white text-[14px] tracking-[-0.4px] underline text-right" style={{ ...font, fontWeight: 500 }}>
          Change Password
        </button>
      </div>

      {/* 2-FA */}
      <div className="flex items-center justify-between py-5 border-b border-white/20">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
          2-FA autentification
        </span>
        <Toggle checked={twoFA} onChange={setTwoFA} />
      </div>

      {/* Phone number */}
      <div className="flex items-center justify-between py-5 border-b border-white/20 gap-4">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
          Phone number
        </span>
        <span className="text-white text-[14px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>
          +34 560 000 000
        </span>
      </div>

      {/* Last sign in */}
      <div className="flex flex-col py-5 border-b border-white/20">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
          Last sign in
        </span>
        <span className="text-white/50 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
          Today at 14:37, Safari, Spain
        </span>
      </div>

      {/* Connected Devices */}
      <div className="flex flex-col gap-3 py-5 border-b border-white/20">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
          Connected Devices ({MOCK_DEVICES.length})
        </span>
        {MOCK_DEVICES.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                {d.name}
              </span>
              <span className="text-white/30 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                {d.detail}
              </span>
            </div>
            <button className="text-[#bbb] text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
              Disconnect
            </button>
          </div>
        ))}
      </div>

      {/* Blocked Accounts */}
      <div className="flex flex-col gap-3 py-5 border-b border-white/20">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
          Blocked Accounts ({MOCK_BLOCKED.length})
        </span>
        {MOCK_BLOCKED.map((b, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                {b.username}
              </span>
              <span className="text-white/30 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                {b.blockedDate}
              </span>
            </div>
            <button className="text-[#bbb] text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
              Unblock
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: panel content only (shell provided by SettingsShell) */}
      <div className="hidden md:block">{desktopContent}</div>
      {/* Mobile: body content only (shell provided by SettingsShell) */}
      <div className="md:hidden">{mobileContent}</div>
    </>
  );
};
