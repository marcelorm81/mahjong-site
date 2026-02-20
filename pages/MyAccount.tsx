import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// ── Constants ──────────────────────────────────────────────────────────────────
const BIO_MAX = 263;
const TAGLINE_MAX = 50;

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Japanese', 'Chinese'];
const REGIONS   = ['Spain', 'United States', 'United Kingdom', 'France', 'Germany', 'Japan', 'Brazil'];

// ── Shared input styles ────────────────────────────────────────────────────────
const inputBase =
  'w-full bg-white text-[#747474] rounded-[10px] px-4 py-[10px] text-sm md:text-base tracking-[-0.4px] outline-none focus:ring-2 focus:ring-[#D00501]/60 transition-shadow placeholder-[#999]';

const selectBase =
  'w-full border border-white text-white rounded-[10px] px-4 py-[10px] text-sm md:text-base tracking-[-0.4px] bg-transparent outline-none appearance-none cursor-pointer';

// ── Form fields ────────────────────────────────────────────────────────────────
interface FormState {
  username: string;
  email: string;
  bio: string;
  tagline: string;
  language: string;
  region: string;
}

// ── Select wrapper with chevron ────────────────────────────────────────────────
const SelectField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
}> = ({ value, onChange, options }) => (
  <div className="relative w-full">
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={selectBase}
      style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}
    >
      {options.map(o => <option key={o} value={o} style={{ background: '#620000', color: 'white' }}>{o}</option>)}
    </select>
    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
  </div>
);

// ── Props ──────────────────────────────────────────────────────────────────────
interface MyAccountProps {
  onClose: () => void;
  initialUsername?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────
export const MyAccount: React.FC<MyAccountProps> = ({ onClose, initialUsername = '' }) => {
  const [form, setForm] = useState<FormState>({
    username: initialUsername,
    email: '',
    bio: '',
    tagline: '',
    language: 'English',
    region: 'Spain',
  });

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value;
    if (key === 'bio'     && val.length > BIO_MAX)     return;
    if (key === 'tagline' && val.length > TAGLINE_MAX) return;
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
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
          My Account
        </h2>

        {/* Form rows */}
        <div className="flex flex-col gap-0">
          {/* Username */}
          <div className="flex gap-12 items-start py-6 border-b border-white">
            <label className="w-[40%] text-white text-[18px] tracking-[-0.4px] pt-2" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={set('username')}
              placeholder="Username"
              className={`${inputBase} flex-1`}
              style={{ fontFamily: "'Teachers', sans-serif" }}
            />
          </div>

          {/* Email */}
          <div className="flex gap-12 items-start py-6 border-b border-white">
            <label className="w-[40%] text-white text-[18px] tracking-[-0.4px] pt-2" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
              Email address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="email@example.com"
              className={`${inputBase} flex-1`}
              style={{ fontFamily: "'Teachers', sans-serif" }}
            />
          </div>

          {/* BIO */}
          <div className="flex gap-12 items-start py-6 border-b border-white">
            <label className="w-[40%] text-white text-[18px] tracking-[-0.4px] pt-2" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
              BIO
            </label>
            <div className="flex-1 flex flex-col gap-2">
              <textarea
                value={form.bio}
                onChange={set('bio')}
                placeholder="Description..."
                rows={5}
                className={`${inputBase} resize-none`}
                style={{ fontFamily: "'Teachers', sans-serif" }}
              />
              <span className="text-white/50 text-sm tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif" }}>
                {BIO_MAX - form.bio.length} characters left
              </span>
            </div>
          </div>

          {/* Player tagline */}
          <div className="flex gap-12 items-start py-6 border-b border-white">
            <label className="w-[40%] text-white text-[18px] tracking-[-0.4px] pt-2" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
              Player tagline
            </label>
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="text"
                value={form.tagline}
                onChange={set('tagline')}
                placeholder="Player Tagline Goes Here"
                className={`${inputBase} w-full`}
                style={{ fontFamily: "'Teachers', sans-serif" }}
              />
              <span className="text-white/50 text-sm tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif" }}>
                {TAGLINE_MAX - form.tagline.length} characters left
              </span>
            </div>
          </div>

          {/* Language */}
          <div className="flex gap-12 items-center py-6 border-b border-white">
            <label className="w-[40%] text-white text-[18px] tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
              Language
            </label>
            <div className="flex-1">
              <SelectField value={form.language} onChange={v => setForm(p => ({ ...p, language: v }))} options={LANGUAGES} />
            </div>
          </div>

          {/* Region */}
          <div className="flex gap-12 items-center py-6 border-b border-white">
            <label className="w-[40%] text-white text-[18px] tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
              Region
            </label>
            <div className="flex-1">
              <SelectField value={form.region} onChange={v => setForm(p => ({ ...p, region: v }))} options={REGIONS} />
            </div>
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
    <div className="flex flex-col gap-5 px-5 pb-6">
      {/* Username */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
          Username
        </label>
        <input
          type="text"
          value={form.username}
          onChange={set('username')}
          placeholder="Username"
          className={inputBase}
          style={{ fontFamily: "'Teachers', sans-serif" }}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
          Email address
        </label>
        <input
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="email@example.com"
          className={inputBase}
          style={{ fontFamily: "'Teachers', sans-serif" }}
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
          Bio
        </label>
        <textarea
          value={form.bio}
          onChange={set('bio')}
          placeholder="Description"
          rows={5}
          className={`${inputBase} resize-none`}
          style={{ fontFamily: "'Teachers', sans-serif" }}
        />
        <span className="text-white text-[12px] tracking-[-0.3px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
          {BIO_MAX - form.bio.length} characters left
        </span>
      </div>

      {/* Player tagline */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
          Player Tagline
        </label>
        <input
          type="text"
          value={form.tagline}
          onChange={set('tagline')}
          placeholder="Player Tagline Goes Here"
          className={inputBase}
          style={{ fontFamily: "'Teachers', sans-serif" }}
        />
        <span className="text-white text-[12px] tracking-[-0.3px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
          {TAGLINE_MAX - form.tagline.length} characters left
        </span>
      </div>

      {/* Language */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
          Language
        </label>
        <SelectField value={form.language} onChange={v => setForm(p => ({ ...p, language: v }))} options={LANGUAGES} />
      </div>

      {/* Region */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] tracking-[-0.4px]" style={{ fontFamily: "'Teachers', sans-serif", fontWeight: 500 }}>
          Region
        </label>
        <SelectField value={form.region} onChange={v => setForm(p => ({ ...p, region: v }))} options={REGIONS} />
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
      {/* Desktop: only the panel content (shell provided by SettingsShell) */}
      <div className="hidden md:block">{desktopContent}</div>
      {/* Mobile: only the body content (shell provided by SettingsShell) */}
      <div className="md:hidden">{mobileContent}</div>
    </>
  );
};
