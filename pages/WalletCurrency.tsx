import React, { useState } from 'react';
import { Download } from 'lucide-react';

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

const font = { fontFamily: "'Teachers', sans-serif" } as const;

// ── Mock data ────────────────────────────────────────────────────────────────
const PURCHASE_HISTORY = [
  { date: 'Aug 12, 2025', item: 'StarPoints Bunndle', amount: '$9.99', method: 'Credit Card 0045', status: 'Completed' },
  { date: 'Sep 5, 2025', item: 'Galaxy Pack', amount: '500 starpoints', method: 'PayPal', status: 'Pending' },
  { date: 'Oct 20, 2025', item: 'Premium Access', amount: '$19.99', method: 'Virtual Currency', status: 'Completed' },
  { date: 'Nov 15, 2025', item: 'Tablecloth Bundle', amount: '$29.99', method: 'Apple Pay', status: 'Failed' },
  { date: 'Dec 1, 2025', item: 'Tournament Entry', amount: '100 starpoints', method: 'Virtual Currency', status: 'Completed' },
  { date: 'Jan 10, 2026', item: 'Power Boost', amount: '$25.00', method: 'Virtual Currency', status: 'Refunded' },
  { date: 'Feb 14, 2026', item: 'Stellar Upgrade', amount: '$34.99', method: 'Virtual Currency', status: 'Completed' },
  { date: 'Mar 3, 2026', item: 'Astro Expansion', amount: '20 starpoints', method: 'Virtual Currency', status: 'Pending' },
];

const BONUS_HISTORY = [
  { date: 'Aug 12, 2025', reward: 'Daily Login Bonus', desc: 'Day 7 Reward', amount: '+500 StarPoints' },
  { date: 'Aug 14, 2025', reward: 'Referral Bonus', desc: 'Invite a Friend', amount: '+1000 StarPoints' },
  { date: 'Aug 16, 2025', reward: 'Milestone Completion', desc: 'Reach Level 10', amount: '+1500 StarPoints' },
];

const RECENT_TRANSACTIONS = [
  { date: 'Aug 12, 2025', type: 'Transfer', asset: 'Game NFT #1024', status: 'Confirmed' },
  { date: 'Aug 09, 2025', type: 'Purchase', asset: 'Starpoints Token', status: 'Pending' },
];

// Mobile purchase history (different format per Figma)
const MOBILE_PURCHASES = [
  { item: 'StarPoints Bunndle', method: 'Credit Card 0045', amount: '$9.99', date: 'Aug 12, 2025' },
  { item: 'Gold Membership', method: 'Credit Card 1234', amount: '$19.99', date: 'Sep 15, 2025' },
  { item: 'Silver Package', method: 'Credit Card 5678', amount: '$14.99', date: 'Oct 22, 2025' },
  { item: 'Premium Access', method: 'Credit Card 9101', amount: '$24.99', date: 'Nov 30, 2025' },
  { item: 'Basic Subscription', method: 'Credit Card 1122', amount: '$4.99', date: 'Dec 5, 2025' },
];

// ── Props ────────────────────────────────────────────────────────────────────
interface WalletCurrencyProps {
  onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────
export const WalletCurrency: React.FC<WalletCurrencyProps> = ({ onClose }) => {
  const [walletConnected, setWalletConnected] = useState(true);

  // ── Desktop Table ──
  const TableHeader: React.FC<{ cols: string[] }> = ({ cols }) => (
    <tr className="border-b border-white/30">
      {cols.map(c => (
        <th key={c} className="text-left text-white text-[14px] tracking-[-0.4px] py-3 px-4 font-semibold" style={font}>{c}</th>
      ))}
    </tr>
  );

  // ── Desktop content ──
  const desktopContent = (
    <div
      className="w-full rounded-[10px] border border-white overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)' }}
    >
      <div className="px-8 xl:px-12 py-6">
        {/* Title + subtitle */}
        <h2 className="text-white text-[32px] tracking-[-2px]" style={{ ...font, fontWeight: 600 }}>
          Wallet &amp; Virtual Currency
        </h2>
        <p className="text-white/50 text-[16px] tracking-[-0.4px] pb-6 border-b border-white" style={{ ...font, fontWeight: 500 }}>
          Manage your in-game currency, rewards, and connected wallet details.
        </p>

        {/* StarPoints Balance */}
        <div className="flex items-center justify-between py-4 border-b border-white">
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>StarPoints Balance</span>
          <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>1,250 StarPoints</span>
        </div>

        {/* Purchase History */}
        <div className="py-4">
          <h3 className="text-white text-[18px] tracking-[-0.4px] mb-3" style={{ ...font, fontWeight: 600 }}>Purchase History</h3>
          <div className="border border-white/20 rounded-[8px] overflow-hidden">
            <table className="w-full text-[14px]">
              <thead><TableHeader cols={['Date', 'Item', 'Amount', 'Payment Method', 'Status']} /></thead>
              <tbody>
                {PURCHASE_HISTORY.map((r, i) => (
                  <tr key={i} className="border-b border-white/10 last:border-0">
                    <td className="text-white/70 py-3 px-4" style={font}>{r.date}</td>
                    <td className="text-white py-3 px-4" style={font}>{r.item}</td>
                    <td className="text-white py-3 px-4" style={font}>{r.amount}</td>
                    <td className="text-white/70 py-3 px-4" style={font}>{r.method}</td>
                    <td className="text-white py-3 px-4" style={font}>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bonus & Reward History */}
        <div className="py-4">
          <h3 className="text-white text-[18px] tracking-[-0.4px] mb-3" style={{ ...font, fontWeight: 600 }}>Bonus &amp; Reward History</h3>
          <div className="border border-white/20 rounded-[8px] overflow-hidden">
            <table className="w-full text-[14px]">
              <thead><TableHeader cols={['Date', 'Reward', 'Description', 'Amount']} /></thead>
              <tbody>
                {BONUS_HISTORY.map((r, i) => (
                  <tr key={i} className="border-b border-white/10 last:border-0">
                    <td className="text-white/70 py-3 px-4" style={font}>{r.date}</td>
                    <td className="text-white py-3 px-4" style={font}>{r.reward}</td>
                    <td className="text-white/70 py-3 px-4" style={font}>{r.desc}</td>
                    <td className="text-white py-3 px-4" style={font}>{r.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Connected Wallet */}
        <div className="py-4 border-b border-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-[18px] tracking-[-0.4px]" style={{ ...font, fontWeight: 600 }}>Connected Wallet</span>
            <Toggle checked={walletConnected} onChange={setWalletConnected} />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Wallet Type</span>
            <span className="text-white text-[16px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>Placeholder Name</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Token balance</span>
            <span className="text-white text-[16px] tracking-[-0.4px] text-right" style={{ ...font, fontWeight: 500 }}>0.042 ETH</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="py-4">
          <h3 className="text-white text-[18px] tracking-[-0.4px] mb-3" style={{ ...font, fontWeight: 600 }}>Recent Transactions</h3>
          <div className="border border-white/20 rounded-[8px] overflow-hidden">
            <table className="w-full text-[14px]">
              <thead><TableHeader cols={['Date', 'Type', 'Asset', 'Status']} /></thead>
              <tbody>
                {RECENT_TRANSACTIONS.map((r, i) => (
                  <tr key={i} className="border-b border-white/10 last:border-0">
                    <td className="text-white/70 py-3 px-4" style={font}>{r.date}</td>
                    <td className="text-white py-3 px-4" style={font}>{r.type}</td>
                    <td className="text-white/70 py-3 px-4" style={font}>{r.asset}</td>
                    <td className="text-white py-3 px-4" style={font}>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Mobile content ──
  const mobileContent = (
    <div className="flex flex-col px-5 pb-6">
      {/* StarPoints Balance */}
      <div className="flex items-center justify-between py-4 border-b border-white/20">
        <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>StarPoints Balance</span>
        <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>1,250 StarPoints</span>
      </div>

      {/* Purchase History */}
      <div className="py-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 600 }}>Purchase History</span>
          <button className="text-white text-[14px] tracking-[-0.4px] underline" style={{ ...font, fontWeight: 500 }}>View All</button>
        </div>
        <div className="flex flex-col">
          {MOBILE_PURCHASES.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
              <div className="flex flex-col">
                <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{p.item}</span>
                <span className="text-white/30 text-[12px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{p.method}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{p.amount}</span>
                <span className="text-white/30 text-[12px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{p.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus & Reward History */}
      <div className="py-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 600 }}>Bonus &amp; Reward History</span>
          <button className="text-white text-[14px] tracking-[-0.4px] underline" style={{ ...font, fontWeight: 500 }}>View All</button>
        </div>
        <div className="flex flex-col">
          {BONUS_HISTORY.map((b, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
              <div className="flex flex-col">
                <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{b.reward}</span>
                <span className="text-white/30 text-[12px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{b.desc}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{b.amount}</span>
                <span className="text-white/30 text-[12px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{b.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Wallet */}
      <div className="py-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 600 }}>Connected Wallet</span>
          <Toggle checked={walletConnected} onChange={setWalletConnected} />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Wallet Type</span>
          <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Placeholder Name</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Token balance</span>
          <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>0.042 ETH</span>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 600 }}>Recent Transactions</span>
          <button className="text-white text-[14px] tracking-[-0.4px] underline" style={{ ...font, fontWeight: 500 }}>View All</button>
        </div>
        <div className="flex flex-col">
          {RECENT_TRANSACTIONS.map((t, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
              <div className="flex flex-col">
                <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{t.asset}</span>
                <span className="text-white/30 text-[12px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{t.type}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{t.status}</span>
                <span className="text-white/30 text-[12px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{desktopContent}</div>
      <div className="md:hidden">{mobileContent}</div>
    </>
  );
};
