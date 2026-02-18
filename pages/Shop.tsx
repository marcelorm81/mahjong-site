import React from 'react';
import { motion } from 'framer-motion';

// ── Local assets (public/assets/) ────────────────────────────────────────────
// Characters — real PNG files from /assets/ folder
const imgGranny    = "/assets/char-granny.png";
const imgExecutive = "/assets/char-executive.png";
const imgBubbleTea = "/assets/char-bubbletea.png";
// Floating props — separate layers, rendered BEHIND character
const imgCat       = "/assets/char-cat.png";
const imgPapers    = "/assets/char-papers.png";

const imgCoin1000   = "/assets/shop-coin-1000.png";
const imgCoin5000   = "/assets/shop-coin-5000.png";
const imgCoin10000  = "/assets/shop-coin-10000.png";
const imgCoin20000  = "/assets/shop-coin-20000.png";
const imgCoin50000  = "/assets/shop-coin-50000.png";
const imgCoin100000 = "/assets/shop-coin-100000.png";

const imgTicketGold   = "/assets/gold.png";
const imgTicketSilver = "/assets/silver.png";
const imgTicketRed    = "/assets/red.png";

// ── Data ──────────────────────────────────────────────────────────────────────
interface CharLayout {
  // Character positioning
  charLeft: string;    // left offset (50% = centered)
  charH: string;       // height %
  // Prop positioning
  propZ: number;       // z-index: 20=front, 5=behind
  propStyle: React.CSSProperties;
}
interface CharItem { name: string; price: number; charImg: string; propImg?: string; layout: CharLayout }
const CHARACTERS: CharItem[] = [
  {
    name: 'Grumpy Granny', price: 300, charImg: imgGranny, propImg: imgCat,
    layout: {
      charLeft: '38%',    // shifted left to make room for cat on the right
      charH: '88%',
      propZ: 20,          // cat floats IN FRONT
      propStyle: { right: '2%', top: '25%', width: '38%', height: '50%' },
    },
  },
  {
    name: '"Busy"ness Man', price: 300, charImg: imgExecutive, propImg: imgPapers,
    layout: {
      charLeft: '50%',    // centered
      charH: '77%',       // 15% smaller than default 88% (was 72%, +5%)
      propZ: 5,           // papers float BEHIND
      propStyle: { left: '5%', top: '2%', width: '90%', height: '90%' },
    },
  },
  {
    name: 'Bubble Tea Girl', price: 300, charImg: imgBubbleTea, propImg: undefined,
    layout: {
      charLeft: '50%',
      charH: '88%',
      propZ: 20,
      propStyle: {},
    },
  },
];

interface StarItem { stars: string; price: string; coinImg: string; imgScale?: number }
const STAR_POINTS: StarItem[] = [
  { stars: '1000 Star Points',   price: '$10',   coinImg: imgCoin1000   },
  { stars: '5000 Star Points',   price: '$50',   coinImg: imgCoin5000,  imgScale: 0.5 },
  { stars: '10000 Star Points',  price: '$100',  coinImg: imgCoin10000  },
  { stars: '20000 Star Points',  price: '$200',  coinImg: imgCoin20000  },
  { stars: '50000 Star Points',  price: '$500',  coinImg: imgCoin50000  },
  { stars: '100000 Star Points', price: '$1000', coinImg: imgCoin100000 },
];

// Ticket BG: black at top → colour at bottom
interface VoucherItem { ticketImg: string; price: string; gradientTo: string }
const VOUCHERS: VoucherItem[] = [
  { ticketImg: imgTicketGold,   price: '$150', gradientTo: '#7a5000' },
  { ticketImg: imgTicketSilver, price: '$300', gradientTo: '#4a4e5a' },
  { ticketImg: imgTicketRed,    price: '$500', gradientTo: '#7a0a0a' },
];

// ── Section Header ─────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center mb-3 md:mb-5">
    <div className="flex-1 h-px bg-white/20" />
    <h2 className="px-4 text-white font-bold text-xs md:text-sm uppercase tracking-[0.2em]">{title}</h2>
    <div className="flex-1 h-px bg-white/20" />
  </div>
);

// ── Character Card ─────────────────────────────────────────────────────────
// Figma 510-8468 / 510-8482:
//   - ~Square image container, red radial gradient bg
//   - Character is static, full body, anchored bottom-center
//   - Prop (cat/papers) floats IN FRONT with CSS animation, overlapping the character
//   - Info bar is a SEPARATE row below the image (not overlaid)
//     Layout: "Grumpy Granny  🪙 300  [BUY NOW]"
const CharCard: React.FC<{ item: CharItem; index: number }> = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="flex flex-col"
  >
    {/* ── Image container — border only here ── */}
    <div
      className="relative w-full aspect-[1/1.05] overflow-hidden rounded-xl border border-white/20"
      style={{
        background: 'radial-gradient(ellipse at 50% 60%, #c00000 0%, #5a0000 55%, #2a0000 100%)',
      }}
    >
      <img
        src={item.charImg}
        alt={item.name}
        className="absolute z-10 w-auto max-w-[90%] object-contain drop-shadow-2xl"
        style={{
          bottom: 0,
          left: item.layout.charLeft,
          transform: 'translateX(-50%)',
          height: item.layout.charH,
          objectPosition: 'bottom center',
        }}
      />
      {item.propImg && (
        <img
          src={item.propImg}
          alt=""
          className="absolute object-contain pointer-events-none"
          style={{
            zIndex: item.layout.propZ,
            ...item.layout.propStyle,
            animation: 'propFloat 3s ease-in-out infinite',
          }}
        />
      )}
    </div>

    {/* ── Info bar — OUTSIDE the bordered image, no border ── */}
    <div className="flex items-center gap-2 px-1 py-2">
      <span className="shrink-0 text-white font-semibold text-[11px] md:text-sm leading-tight truncate max-w-[38%]">
        {item.name}
      </span>

      <div className="flex-1 h-[30px] flex items-center gap-1 px-1.5 rounded-[5px]
                      bg-[#4a0303] relative overflow-hidden">
        <img src="/assets/shop-coin-1000.png" alt="" className="w-[22px] h-[22px] object-contain shrink-0" />
        <span className="flex-1 text-white font-semibold text-[11px] md:text-sm text-center uppercase">
          {item.price}
        </span>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit]"
          style={{ boxShadow: 'inset -2.5px 2.5px 5px rgba(0,0,0,0.25)' }} />
      </div>

      <button
        className="flex-1 h-[30px] flex items-center justify-center rounded-[4px]
                   bg-[#D00501] hover:bg-[#b00401] active:scale-95 transition-all
                   text-white font-bold text-[10px] md:text-xs uppercase tracking-wider
                   shadow-[2px_2px_0px_0px_#4a0000]"
      >
        BUY NOW
      </button>
    </div>
  </motion.div>
);

// ── Star Points Card ───────────────────────────────────────────────────────
const PricePill: React.FC<{ price: string }> = ({ price }) => (
  <div className="bg-[#620000] rounded-md px-3 py-1 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.25)]">
    <span className="text-white font-bold text-[10px] md:text-xs uppercase">{price}</span>
  </div>
);

const StarCard: React.FC<{ item: StarItem; index: number }> = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + index * 0.07 }}
    className="relative rounded-xl border border-white/30 overflow-hidden flex flex-col items-center gap-2 md:gap-3 pb-2 md:pb-3 pt-3 md:pt-5 px-2 md:px-3"
    style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
  >
    <div className="w-[40%] aspect-square flex items-center justify-center"
      style={item.imgScale ? { transform: `scale(${item.imgScale})` } : undefined}>
      <img src={item.coinImg} alt={item.stars} className="w-full h-full object-contain drop-shadow-lg" />
    </div>
    <div className="flex flex-col items-center gap-1.5 w-full">
      <span className="text-white font-bold text-[10px] md:text-xs text-center leading-tight">{item.stars}</span>
      <PricePill price={item.price} />
    </div>
    <div className="w-full mt-auto">
      <button className="w-full bg-[#D00501] hover:bg-[#b00401] active:scale-95 transition-all text-white font-bold text-[10px] md:text-xs uppercase tracking-wider py-1.5 md:py-2 rounded-[4px] shadow-[2px_2px_0px_0px_#4a0000] flex items-center justify-center">
        BUY NOW
      </button>
    </div>
  </motion.div>
);

// ── Voucher Card ───────────────────────────────────────────────────────────
// BG: black at top → ticket colour at bottom (510-8741)
// Sparkle stars on top. No shimmer animation, just the stars.
const VoucherCard: React.FC<{ item: VoucherItem; index: number }> = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 + index * 0.08 }}
    className="relative rounded-xl border border-white/20 overflow-hidden flex flex-col"
    style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
  >
    {/* Ticket image area */}
    <div
      className="relative w-full aspect-[3/2] md:aspect-square flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(180deg, #000000 0%, ${item.gradientTo} 100%)` }}
    >
      {/* Twinkling 4-point stars */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {[
          { top: '10%', left: '12%', size: 6,  delay: '0s'   },
          { top: '16%', left: '76%', size: 8,  delay: '0.7s' },
          { top: '70%', left: '20%', size: 5,  delay: '1.2s' },
          { top: '63%', left: '80%', size: 7,  delay: '0.4s' },
          { top: '38%', left: '6%',  size: 4,  delay: '1.8s' },
          { top: '28%', left: '88%', size: 5,  delay: '1.0s' },
        ].map((star, i) => (
          <div key={i} className="absolute" style={{ top: star.top, left: star.left, animation: `twinkle 2.4s ease-in-out ${star.delay} infinite` }}>
            <svg viewBox="0 0 10 10" width={star.size} height={star.size}>
              <path d="M5 0 L5.5 4.5 L10 5 L5.5 5.5 L5 10 L4.5 5.5 L0 5 L4.5 4.5 Z" fill="rgba(255,255,255,0.9)" />
            </svg>
          </div>
        ))}
      </div>
      {/* Ticket PNG */}
      <img
        src={item.ticketImg}
        alt="Exit Pass"
        className="relative z-10 w-[85%] object-contain drop-shadow-2xl"
        style={{ transform: 'rotate(-5deg)' }}
      />
    </div>

    {/* Bottom bar — price pill (flex-1) + BUY NOW (flex-1) — Figma 510-8743 */}
    <div className="flex items-center gap-2 px-2 py-2">
      <div className="flex-1 h-[30px] flex items-center justify-center rounded-[4px] bg-[#4a0303] shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.25)]">
        <span className="text-white font-bold text-[10px] md:text-xs uppercase tracking-wide">{item.price}</span>
      </div>
      <button className="flex-1 h-[30px] bg-[#D00501] hover:bg-[#b00401] active:scale-95 transition-all text-white font-bold text-[10px] md:text-xs uppercase tracking-wide rounded-[4px] shadow-[2px_2px_0px_0px_#4a0000] flex items-center justify-center">
        BUY NOW
      </button>
    </div>
  </motion.div>
);

// ── Awning — roof.png tiled, true full-viewport bleed, no gaps ────────────
// Tile: 262×217px. Contains 2 scallop arches; bottom ~30px is transparent shadow.
// Display at 140px tall, tile width scaled proportionally: 262*(140/217) ≈ 169px.
// repeat-x fills the full viewport. calc(-50vw+50%) bleeds to viewport edges.
const TILE_NATURAL_W = 262;
const TILE_NATURAL_H = 217;
const DISPLAY_H      = 140;
const DISPLAY_W      = Math.round(TILE_NATURAL_W * (DISPLAY_H / TILE_NATURAL_H)); // ≈169px

const Awning: React.FC = () => (
  <div
    className="mb-5 flex-shrink-0"
    style={{
      marginLeft:  'calc(-50vw + 50%)',
      marginRight: 'calc(-50vw + 50%)',
      width:       '100vw',
      height:      DISPLAY_H,
      backgroundImage:    'url(/assets/roof.png)',
      backgroundRepeat:   'repeat-x',
      backgroundSize:     `${DISPLAY_W}px ${DISPLAY_H}px`,
      backgroundPosition: 'top left',
    }}
  />
);

// ── Main Shop Page ─────────────────────────────────────────────────────────
export const Shop: React.FC = () => (
  <>
    <style>{`
      @keyframes twinkle {
        0%, 100% { opacity: 0; transform: scale(0.4); }
        50%       { opacity: 1; transform: scale(1.3); }
      }
      @keyframes propFloat {
        0%, 100% { transform: translateY(0px); }
        50%      { transform: translateY(-8px); }
      }
    `}</style>

    <div className="w-full max-w-5xl mx-auto px-3 md:px-4 py-4 short:py-2">
      <Awning />

      {/* OUR OFFERS */}
      <section className="mb-7 md:mb-10">
        <SectionHeader title="Our Offers!" />
        {/* Mobile: 1-col (full-width square cards stacked)
            Desktop: 3-col grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {CHARACTERS.map((c, i) => <CharCard key={c.name} item={c} index={i} />)}
        </div>
      </section>

      {/* STARPOINTS */}
      <section className="mb-7 md:mb-10">
        <SectionHeader title="Star Points" />
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
          {STAR_POINTS.map((s, i) => <StarCard key={s.stars} item={s} index={i} />)}
        </div>
      </section>

      {/* VOUCHERS */}
      <section className="mb-7 md:mb-10">
        <SectionHeader title="Vouchers" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {VOUCHERS.map((v, i) => <VoucherCard key={i} item={v} index={i} />)}
        </div>
      </section>

      <div className="h-6" />
    </div>
  </>
);
