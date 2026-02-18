import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Search, Calendar } from 'lucide-react';

interface HistoryEntry {
  id: number;
  score: number;
  startTime: string;
  gameType: string;
  tableId: string;
  players: string[];
}

const MOCK_HISTORY: HistoryEntry[] = [
  { id: 1, score: 12500, startTime: '2024-01-15 14:32', gameType: 'BANG BANG', tableId: 'TBL-001', players: ['YuStar', 'DragonK', 'LuckyM'] },
  { id: 2, score: 8200,  startTime: '2024-01-15 13:10', gameType: 'BANG BANG', tableId: 'TBL-003', players: ['RedPanda', 'JadeQ', 'StarF'] },
  { id: 3, score: 21000, startTime: '2024-01-14 20:45', gameType: 'TOURNAMENT', tableId: 'TRN-007', players: ['MahjongK', 'GoldD', 'TigerC'] },
  { id: 4, score: 5500,  startTime: '2024-01-14 19:22', gameType: 'BANG BANG', tableId: 'TBL-012', players: ['LuckyM', 'BlueW', 'PeachB'] },
  { id: 5, score: 15800, startTime: '2024-01-14 18:00', gameType: 'BANG BANG', tableId: 'TBL-002', players: ['SilkR', 'JadeQ', 'DragonK'] },
  { id: 6, score: 3200,  startTime: '2024-01-13 22:15', gameType: 'BANG BANG', tableId: 'TBL-005', players: ['YuStar', 'GoldD', 'TigerC'] },
  { id: 7, score: 9900,  startTime: '2024-01-13 21:00', gameType: 'TOURNAMENT', tableId: 'TRN-004', players: ['MahjongK', 'RedPanda', 'PeachB'] },
  { id: 8, score: 17300, startTime: '2024-01-13 19:30', gameType: 'BANG BANG', tableId: 'TBL-008', players: ['BlueW', 'StarF', 'LuckyM'] },
  { id: 9, score: 6700,  startTime: '2024-01-12 16:45', gameType: 'BANG BANG', tableId: 'TBL-001', players: ['DragonK', 'SilkR', 'JadeQ'] },
  { id: 10, score: 24500, startTime: '2024-01-12 15:20', gameType: 'TOURNAMENT', tableId: 'TRN-002', players: ['YuStar', 'GoldD', 'MahjongK'] },
];

const formatNumber = (n: number) => n.toLocaleString();

// Auto-formats user typing into YYYY-MM-DD
// Accepts digits only, inserts dashes automatically
const formatDateInput = (raw: string, prev: string): string => {
  // Strip all non-digit characters
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 0) return '';
  // Build formatted string: YYYY-MM-DD
  let out = digits.slice(0, 4);
  if (digits.length >= 5) out += '-' + digits.slice(4, 6);
  if (digits.length >= 7) out += '-' + digits.slice(6, 8);
  return out;
};

// Returns YYYY-MM-DD if fully entered, else ''
const toISODate = (val: string): string => {
  const m = val.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  return val;
};

interface DateInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value, value);
    onChange(formatted);
  };

  const isComplete = /^\d{4}-\d{2}-\d{2}$/.test(value);

  return (
    <div className="flex-1">
      <label className="text-white/50 text-[10px] uppercase tracking-wider mb-1 block">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          placeholder="YYYY-MM-DD"
          maxLength={10}
          autoComplete="off"
          className="w-full bg-black/40 border border-white/10 rounded-lg pl-2.5 pr-7 py-2 text-white text-xs focus:outline-none focus:border-white/30 placeholder:text-white/20 transition-colors"
          style={{ fontFamily: "'Teachers', sans-serif", letterSpacing: '0.02em' }}
        />
        <Calendar
          size={12}
          className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${isComplete ? 'text-brand-gold' : 'text-white/25'}`}
        />
      </div>
    </div>
  );
};

export const History: React.FC = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filtered, setFiltered] = useState(MOCK_HISTORY);

  const handleSearch = () => {
    const from = toISODate(fromDate);
    const to = toISODate(toDate);
    if (!from && !to) { setFiltered(MOCK_HISTORY); return; }
    setFiltered(MOCK_HISTORY.filter(e => {
      const d = e.startTime.split(' ')[0];
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    }));
  };

  const glassCard = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
    backdropFilter: 'blur(12px)',
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 short:py-2">

      {/* Page Title */}
      <h1 className="text-center text-white font-bold uppercase tracking-widest text-base md:text-lg short:text-sm mb-6 short:mb-3 opacity-80">
        Game History
      </h1>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-2 mb-6 short:mb-3"
      >
        {/* Date fields row — always side by side */}
        <div className="flex gap-2">
          <DateInput label="From" value={fromDate} onChange={setFromDate} />
          <DateInput label="To" value={toDate} onChange={setToDate} />
        </div>

        {/* Search button — full width on mobile, auto width on desktop */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto md:self-end flex items-center justify-center gap-2 bg-[#D00501] hover:bg-[#b00401] active:scale-95 transition-all text-white font-bold uppercase text-sm px-6 py-3 rounded-lg shadow-[3px_3px_0px_0px_#4a0000]"
        >
          <Search size={16} />
          Search
        </button>
      </motion.div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border border-white/10 overflow-hidden"
        style={glassCard}
      >
        {/* Desktop Headers */}
        <div className="hidden md:grid grid-cols-[48px_1fr_1fr_1fr_1fr_80px] gap-4 px-4 py-3 border-b border-white/10 text-white/40 text-xs uppercase tracking-wider font-semibold">
          <span>#</span>
          <span>Score</span>
          <span>Start Time</span>
          <span>Type</span>
          <span>Players</span>
          <span className="text-right">Replay</span>
        </div>

        {filtered.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            className="group border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
          >
            {/* Mobile Layout */}
            <div className="md:hidden flex items-center gap-3 px-4 py-3">
              <span className="text-white/40 text-sm font-bold w-6 text-right shrink-0">{entry.id}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-brand-gold font-bold text-sm">{formatNumber(entry.score)}</span>
                  <span className="text-white/40 text-[10px] bg-white/10 rounded px-1.5 py-0.5 uppercase">{entry.gameType}</span>
                </div>
                <span className="text-white/50 text-xs">{entry.startTime}</span>
              </div>
              <button className="shrink-0 w-8 h-8 rounded-full bg-[#D00501]/80 hover:bg-[#D00501] flex items-center justify-center transition-colors active:scale-90">
                <Play size={12} className="text-white ml-0.5" fill="white" />
              </button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-[48px_1fr_1fr_1fr_1fr_80px] gap-4 items-center px-4 py-4">
              <span className="text-white/40 text-sm font-bold">{entry.id}</span>
              <span className="text-brand-gold font-bold">{formatNumber(entry.score)}</span>
              <span className="text-white/70 text-sm">{entry.startTime}</span>
              <span className="text-white/70 text-sm">
                <span className="bg-white/10 rounded px-2 py-0.5 text-xs uppercase tracking-wider">{entry.gameType}</span>
              </span>
              <span className="text-white/60 text-xs">{entry.players.join(' · ')}</span>
              <div className="flex justify-end">
                <button className="w-9 h-9 rounded-full bg-[#D00501]/80 hover:bg-[#D00501] flex items-center justify-center transition-all active:scale-90 group-hover:shadow-[0_0_12px_rgba(208,5,1,0.5)]">
                  <Play size={14} className="text-white ml-0.5" fill="white" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/40 text-sm">
            No history found for selected dates.
          </div>
        )}
      </motion.div>

      <div className="h-6" />
    </div>
  );
};
