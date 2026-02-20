import React, { useState } from 'react';
import { Download, Plus, X } from 'lucide-react';

const font = { fontFamily: "'Teachers', sans-serif" } as const;

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

// ── Card brand badge ─────────────────────────────────────────────────────────
const CardBadge: React.FC<{ brand: string }> = ({ brand }) => {
  const colors: Record<string, string> = {
    mastercard: 'bg-[#eb001b]',
    visa: 'bg-[#1a1f71]',
    paypal: 'bg-[#003087]',
  };
  return (
    <div className={`w-8 h-5 md:w-10 md:h-6 rounded-[4px] flex items-center justify-center text-white text-[8px] md:text-[10px] font-bold uppercase shrink-0 ${colors[brand] || 'bg-white/20'}`}>
      {brand === 'mastercard' ? 'MC' : brand === 'visa' ? 'VISA' : brand.toUpperCase()}
    </div>
  );
};

// ── Mock data ────────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { brand: 'mastercard', label: 'Mastercard ending in 9600', expiry: 'Expires: 12/2027', isDefault: false },
  { brand: 'visa',       label: 'Visa ending in 1234',       expiry: 'Expires: 06/2025', isDefault: true  },
  { brand: 'paypal',     label: 'Paypal',                     expiry: 'Expires: 11/2025', isDefault: false },
];

const INVOICES = [
  { date: 'Aug 12, 2025', amount: '$9.99',  method: 'Credit Card 0045' },
  { date: 'Oct 20, 2025', amount: '$19.99', method: 'Virtual Currency' },
  { date: 'Nov 15, 2025', amount: '$29.99', method: 'Apple Pay' },
  { date: 'Jan 10, 2026', amount: '$25.00', method: 'Credit Card 1234' },
  { date: 'Feb 14, 2026', amount: '$34.99', method: 'Paypal' },
];

const MOBILE_INVOICES = [
  { amount: '$9.99',  method: 'Credit Card 0045', date: 'Aug 12, 2025' },
  { amount: '$15.49', method: 'Credit Card 1234', date: 'Sep 10, 2025' },
  { amount: '$22.99', method: 'Credit Card 5678', date: 'Oct 5, 2025'  },
  { amount: '$5.99',  method: 'Credit Card 8765', date: 'Nov 15, 2025' },
  { amount: '$12.89', method: 'Credit Card 4321', date: 'Dec 1, 2025'  },
];

// ── Props ────────────────────────────────────────────────────────────────────
interface PaymentsProps {
  onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────
export const Payments: React.FC<PaymentsProps> = ({ onClose }) => {
  const [billingEnabled, setBillingEnabled] = useState(true);

  // ── Desktop content ──
  const desktopContent = (
    <div
      className="w-full rounded-[10px] border border-white overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)' }}
    >
      <div className="px-8 xl:px-12 py-6">
        {/* Title + subtitle */}
        <h2 className="text-white text-[32px] tracking-[-2px]" style={{ ...font, fontWeight: 600 }}>
          Payments
        </h2>
        <p className="text-white/50 text-[16px] tracking-[-0.4px] pb-6 border-b border-white" style={{ ...font, fontWeight: 500 }}>
          Manage your payment methods, billing details, and purchase records.
        </p>

        {/* Payment Methods */}
        <div className="py-4">
          <h3 className="text-white text-[18px] tracking-[-0.4px] mb-3" style={{ ...font, fontWeight: 600 }}>Payment Methods</h3>
          <div className="border border-white/20 rounded-[8px] overflow-hidden">
            {PAYMENT_METHODS.map((pm, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/10 last:border-0">
                <CardBadge brand={pm.brand} />
                <div className="flex flex-col flex-1">
                  <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{pm.label}</span>
                  <span className="text-white/30 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{pm.expiry}</span>
                </div>
                <span className="text-white/50 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
                  {pm.isDefault ? '(Default)' : 'Make Default'}
                </span>
                <button className="text-[#bbb] text-[14px] tracking-[-0.4px] ml-4" style={{ ...font, fontWeight: 500 }}>Remove</button>
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 mt-3 text-white text-[14px] tracking-[-0.4px] underline" style={{ ...font, fontWeight: 500 }}>
            <Plus size={16} className="text-white" />
            Add new payment method
          </button>
        </div>

        {/* Invoices */}
        <div className="py-4">
          <h3 className="text-white text-[18px] tracking-[-0.4px] mb-3" style={{ ...font, fontWeight: 600 }}>Invoices</h3>
          <div className="border border-white/20 rounded-[8px] overflow-hidden">
            <table className="w-full text-[14px]">
              <tbody>
                {INVOICES.map((inv, i) => (
                  <tr key={i} className="border-b border-white/10 last:border-0">
                    <td className="text-white/70 py-3 px-5" style={font}>{inv.date}</td>
                    <td className="text-white py-3 px-5" style={font}>{inv.amount}</td>
                    <td className="text-white/70 py-3 px-5" style={font}>{inv.method}</td>
                    <td className="py-3 px-5 text-right">
                      <button className="text-white/50 hover:text-white transition-colors">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Billing Information */}
        <div className="py-4 border-b border-white/20">
          <h3 className="text-white text-[18px] tracking-[-0.4px] mb-3" style={{ ...font, fontWeight: 600 }}>Billing information</h3>
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>John Doe</span>
              <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>123 Street, Level 4, Barcelona, 10001</span>
              <span className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Spain</span>
            </div>
            <div className="flex gap-2">
              <button className="text-white/70 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Edit</button>
              <span className="text-white/30">|</span>
              <button className="text-white/70 text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Remove</button>
            </div>
          </div>
          <button className="flex items-center gap-2 mt-3 text-white text-[14px] tracking-[-0.4px] underline" style={{ ...font, fontWeight: 500 }}>
            <Plus size={16} className="text-white" />
            Add new Billing Adress
          </button>
        </div>

        {/* Refund & Support Links */}
        <div className="py-4">
          <h3 className="text-white text-[18px] tracking-[-0.4px] mb-3" style={{ ...font, fontWeight: 600 }}>Refund &amp; Support Links</h3>
          <div className="flex flex-col gap-2">
            <button className="text-white text-[16px] tracking-[-0.4px] underline text-left" style={{ ...font, fontWeight: 500 }}>Request a refund</button>
            <button className="text-white text-[16px] tracking-[-0.4px] underline text-left" style={{ ...font, fontWeight: 500 }}>Help center</button>
            <button className="text-white text-[16px] tracking-[-0.4px] underline text-left" style={{ ...font, fontWeight: 500 }}>Contact customer support</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Mobile content ──
  const mobileContent = (
    <div className="flex flex-col px-5 pb-6">
      {/* Payment Methods */}
      <div className="py-4 border-b border-white/20">
        <h3 className="text-white text-[16px] tracking-[-0.4px] mb-3" style={{ ...font, fontWeight: 600 }}>Payment Methods</h3>
        {PAYMENT_METHODS.map((pm, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-white/10 last:border-0">
            <CardBadge brand={pm.brand} />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-white text-[14px] tracking-[-0.4px] truncate" style={{ ...font, fontWeight: 500 }}>{pm.label}</span>
              <span className="text-white/30 text-[12px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{pm.expiry}</span>
            </div>
            <span className="text-white/50 text-[12px] tracking-[-0.4px] shrink-0" style={{ ...font, fontWeight: 500 }}>
              {pm.isDefault ? '(Default)' : 'Make Default'}
            </span>
            <button className="text-white/40 shrink-0"><X size={14} /></button>
          </div>
        ))}
        <button className="flex items-center gap-2 mt-3 text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
          <Plus size={14} className="text-white" />
          Add new payment method
        </button>
      </div>

      {/* Invoices */}
      <div className="py-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 600 }}>Invoices</h3>
          <button className="text-white text-[14px] tracking-[-0.4px] underline" style={{ ...font, fontWeight: 500 }}>View All</button>
        </div>
        {MOBILE_INVOICES.map((inv, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
            <div className="flex flex-col">
              <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{inv.amount}</span>
              <span className="text-white/30 text-[12px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{inv.method}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-[12px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>{inv.date}</span>
              <button className="text-white/50 hover:text-white transition-colors"><Download size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Billing Information */}
      <div className="py-4 border-b border-white/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white text-[16px] tracking-[-0.4px]" style={{ ...font, fontWeight: 600 }}>Billing Information</h3>
          <Toggle checked={billingEnabled} onChange={setBillingEnabled} />
        </div>
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>John Doe</span>
            <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>123 Street, Level 4, Barcelona, 10001</span>
            <span className="text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>Spain</span>
          </div>
          <button className="text-white/40 shrink-0"><X size={14} /></button>
        </div>
        <button className="text-white text-[14px] tracking-[-0.4px] mt-2" style={{ ...font, fontWeight: 500 }}>Edit</button>
        <div className="mt-3">
          <button className="flex items-center gap-2 text-white text-[14px] tracking-[-0.4px]" style={{ ...font, fontWeight: 500 }}>
            <Plus size={14} className="text-white" />
            Add new Billing Adress
          </button>
        </div>
      </div>

      {/* Refund & Support */}
      <div className="py-4">
        <h3 className="text-white text-[16px] tracking-[-0.4px] mb-3" style={{ ...font, fontWeight: 600 }}>Recent Transactions</h3>
        <div className="flex flex-col gap-3">
          <button className="text-white text-[14px] tracking-[-0.4px] underline text-left" style={{ ...font, fontWeight: 500 }}>Request a refund</button>
          <button className="text-white text-[14px] tracking-[-0.4px] underline text-left" style={{ ...font, fontWeight: 500 }}>Help center</button>
          <button className="text-white text-[14px] tracking-[-0.4px] underline text-left" style={{ ...font, fontWeight: 500 }}>Contact customer support</button>
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
