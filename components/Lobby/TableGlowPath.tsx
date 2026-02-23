import React, { useId } from 'react';

/* ── SVG path tracing the mahjong table outline (from Figma) ── */
const TABLE_PATH_D =
  'M47.4395 246.412L125.439 56.9619L160.939 47.2861H597.939L634.086 56.9619L713.439 246.412V319.791L686.516 334.786V377.286L658.176 382.497L662.427 577.284H583.073V389.286L177.805 393.17V581.286H106.954V380.786L77.4395 377.286L72.4395 334.786L53.4395 326.286L47.4395 246.412Z';

/* Hard-coded from manual segment-length calculation */
const TOTAL_LENGTH = 2600;

/* Layer 1 — wide diffuse halo (35% visible) */
const HALO_SEG = TOTAL_LENGTH * 0.35;           // 910
const HALO_GAP = TOTAL_LENGTH - HALO_SEG;       // 1690

/* Layer 2 — core glow body (30% visible) */
const CORE_SEG = TOTAL_LENGTH * 0.30;           // 780
const CORE_GAP = TOTAL_LENGTH - CORE_SEG;       // 1820

/* Layer 3 — bright leading head (15% visible) */
const HEAD_SEG = TOTAL_LENGTH * 0.15;           // 390
const HEAD_GAP = TOTAL_LENGTH - HEAD_SEG;       // 2210

/**
 * Three-layer traveling glow that circulates the table outline on hover.
 *   1. Wide halo  — warm orange, heavy blur, 35% segment
 *   2. Core glow  — golden, medium blur, 30% segment
 *   3. Bright head — warm white, no blur, 15% segment
 *
 * All layers share the same CSS keyframe animation so they move in sync.
 * The shorter head segment naturally leads the wider halo, giving a
 * bright-leading / soft-trailing falloff without needing a gradient.
 *
 * z-[5] → behind card image (z-10), above background.
 * Paused by default — CSS .group:hover .table-glow-path starts it.
 */
export const TableGlowPath: React.FC = () => {
  const uid = useId();
  const blurWideId = `tgw${uid}`;
  const blurCoreId = `tgc${uid}`;
  const blurHeadId = `tgh${uid}`;

  const haloStyle: React.CSSProperties = {
    strokeDasharray: `${HALO_SEG} ${HALO_GAP}`,
    strokeDashoffset: 0,
    animation: 'table-glow-travel 4s linear infinite',
    mixBlendMode: 'screen',
  };

  const coreStyle: React.CSSProperties = {
    strokeDasharray: `${CORE_SEG} ${CORE_GAP}`,
    strokeDashoffset: 0,
    animation: 'table-glow-travel 4s linear infinite',
    mixBlendMode: 'screen',
  };

  const headStyle: React.CSSProperties = {
    strokeDasharray: `${HEAD_SEG} ${HEAD_GAP}`,
    strokeDashoffset: 0,
    animation: 'table-glow-travel 4s linear infinite',
  };

  return (
    <div
      className="
        absolute z-[5] pointer-events-none
        top-[20%] left-[12%] right-[12%] bottom-[5%]
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
      "
    >
      <svg
        viewBox="0 0 761 629"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Wide blur for the outer halo */}
          <filter id={blurWideId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="20" />
          </filter>

          {/* Core blur — medium diffusion */}
          <filter id={blurCoreId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>

          {/* Head blur — light softening */}
          <filter id={blurHeadId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Layer 1 — wide diffuse orange halo */}
        <path
          className="table-glow-path"
          d={TABLE_PATH_D}
          stroke="#FFA500"
          strokeWidth="28"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.5"
          fill="none"
          filter={`url(#${blurWideId})`}
          style={haloStyle}
        />

        {/* Layer 2 — core golden glow */}
        <path
          className="table-glow-path"
          d={TABLE_PATH_D}
          stroke="#FFD700"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.7"
          fill="none"
          filter={`url(#${blurCoreId})`}
          style={coreStyle}
        />

        {/* Layer 3 — bright leading edge with light blur */}
        <path
          className="table-glow-path"
          d={TABLE_PATH_D}
          stroke="#FFFBE6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.85"
          fill="none"
          filter={`url(#${blurHeadId})`}
          style={headStyle}
        />
      </svg>
    </div>
  );
};
