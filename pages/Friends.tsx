import React, { useState } from 'react';
import { motion } from 'framer-motion';

type StatusType = 'online' | 'lobby' | 'offline';

interface Friend {
  id: number;
  username: string;
  level: number;
  status: StatusType;
  avatarUrl: string;
}

const MOCK_FRIENDS: Friend[] = [
  { id: 1, username: 'Uncle Cai',       level: 50, status: 'online',  avatarUrl: '/assets/avatar-uncle-cai.png' },
  { id: 2, username: 'Anne Wan',        level: 50, status: 'online',  avatarUrl: '/assets/avatar-anne-wan.png' },
  { id: 3, username: 'Bang Johnsson',   level: 50, status: 'online',  avatarUrl: '/assets/avatar-bang-johnsson.png' },
  { id: 4, username: 'Mrs Chen',        level: 50, status: 'offline', avatarUrl: '/assets/avatar-mrs-chen.png' },
  { id: 5, username: 'Pon Pon',         level: 50, status: 'offline', avatarUrl: '/assets/avatar-pon-pon.png' },
  { id: 6, username: 'Echo Tóng',       level: 50, status: 'offline', avatarUrl: '/assets/avatar-echo-tong.png' },
  { id: 7, username: 'Tony Kong',       level: 50, status: 'offline', avatarUrl: '/assets/avatar-tony-kong.png' },
];

const STATUS_CONFIG: Record<StatusType, { label: string; color: string }> = {
  online:  { label: 'Online',   color: 'text-[#2ad858]' },
  lobby:   { label: 'In Lobby', color: 'text-[#c3c73e]' },
  offline: { label: 'Offline',  color: 'text-white' },
};

export const Friends: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    const found = MOCK_FRIENDS.find(f => f.username.toLowerCase().includes(query.toLowerCase()));
    setSearchResult(found ? `Found: ${found.username}` : 'No player found with that username.');
  };

  // Sort: online first, then lobby, then offline
  const sortedFriends = [...MOCK_FRIENDS].sort((a, b) => {
    const order: Record<StatusType, number> = { online: 0, lobby: 1, offline: 2 };
    return order[a.status] - order[b.status];
  });

  const glassWindow = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 100%)',
    backdropFilter: 'blur(12px)',
  };

  const rowInsetShadow = {
    boxShadow: 'inset -2px 2px 4px rgba(0,0,0,0.25)',
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 short:py-2">

      <h1 className="text-center text-white font-bold uppercase tracking-widest text-base md:text-lg short:text-sm mb-6 short:mb-3 opacity-80">
        Friends
      </h1>

      {/* Search Row */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 mb-2"
      >
        <input
          type="text"
          placeholder="Enter Username or User ID"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-[#620000] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
          style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)' }}
        />
        <button
          onClick={handleSearch}
          className="bg-[#d00501] hover:bg-[#b00401] active:scale-95 transition-all text-white font-bold uppercase text-sm px-5 py-2.5 rounded-lg shadow-[3px_3px_0px_0px_#4a0000]"
        >
          SEARCH
        </button>
      </motion.div>

      {/* Search Feedback */}
      {searchResult && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/60 text-xs mb-3 pl-1"
        >
          {searchResult}
        </motion.p>
      )}

      {/* Friends List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-white overflow-hidden mt-4"
        style={glassWindow}
      >
        {sortedFriends.map((friend, i) => {
          const st = STATUS_CONFIG[friend.status];
          const isOffline = friend.status === 'offline';

          return (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`border-b border-white/10 last:border-b-0 ${isOffline ? 'opacity-50' : ''}`}
              style={rowInsetShadow}
            >
              {/* Mobile */}
              <div className="md:hidden flex items-center gap-3 px-3 h-[72px]">
                <div className="w-[56px] h-[56px] rounded-[3px] bg-[#620000]/60 overflow-hidden shrink-0">
                  <img
                    src={friend.avatarUrl}
                    alt={friend.username}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{friend.username}</p>
                  <p className="text-white/60 text-xs">lv.{friend.level}</p>
                </div>
                <span className={`text-sm font-medium shrink-0 ${st.color}`}>
                  {st.label}
                </span>
              </div>

              {/* Desktop */}
              <div className="hidden md:flex items-center gap-4 px-4 h-[84px]">
                <div className="w-[72px] h-[72px] rounded-[3px] bg-[#620000]/60 overflow-hidden shrink-0">
                  <img
                    src={friend.avatarUrl}
                    alt={friend.username}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-base truncate">{friend.username}</p>
                  <p className="text-white/60 text-sm">lv.{friend.level}</p>
                </div>
                <span className={`text-sm font-medium shrink-0 ${st.color}`}>
                  {st.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="h-6" />
    </div>
  );
};
