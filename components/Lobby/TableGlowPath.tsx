import React, { useId } from 'react';

/* ── SVG path tracing the mahjong table outline (from Figma) ── */
const TABLE_PATH_D =
  'M47.4395 246.412L125.439 56.9619L160.939 47.2861H597.939L634.086 56.9619L713.439 246.412V319.791L686.516 334.786V377.286L658.176 382.497L662.427 577.284H583.073V389.286L177.805 393.17V581.286H106.954V380.786L77.4395 377.286L72.4395 334.786L53.4395 326.286L47.4395 246.412Z';

/* Hard-coded from manual segment-length calculation */
const TOTAL_LENGTH = 2600;
const SEGMENT_FRACTION = 0.27;
const SEGMENT_LENGTH = TOTAL_LENGTH * SEGMENT_FRACTION; // ~702
const GAP_LENGTH = TOTAL_LENGTH - SEGMENT_LENGTH;        // ~1898

/**
 * Dual-layer traveling glow that circulates around the table outline on hover.
 * Layer 1 (blur): wide diffuse halo with gradient stroke
 * Layer 2 (core): thin bright center line
 *
 * Renders at z-[5] so it sits behind the card image (z-10) but above the background.
 * Visibility is driven by the parent's `group` / `group-hover` classes.
 * Animation is paused by default — CSS `.group:hover .table-glow-path` starts it.
 */
export const TableGlowPath: React.FC = () => {
  const uid = useId();
  const blurId = `tgb${uid}`;
  const gradId = `tgg${uid}`;

  const dashStyle: React.CSSProperties = {
    strokeDasharray: `${SEGMENT_LENGTH} ${GAP_LENGTH}`,
    strokeDashoffset: 0,
    animation: `table-glow-travel 4s linear infinite`,
  };

  return (
    <div
      className="
        absolute inset-0 z-[5] pointer-events-none
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
          {/* Gaussian blur for the diffuse halo */}
          <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" />
          </filter>

          {/* Gradient: yellow → red → transparent (trailing edge fades) */}
          <linearGradient id={gradId} x1="366" y1="302" x2="128" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FBFF0C" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#FF1313" stopOpacity="0.45" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Layer 1 — diffuse glow halo */}
        <path
          className="table-glow-path"
          d={TABLE_PATH_D}
          stroke={`url(#${gradId})`}
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter={`url(#${blurId})`}
          style={{ ...dashStyle, mixBlendMode: 'screen' }}
        />

        {/* Layer 2 — bright sharp core */}
        <path
          className="table-glow-path"
          d={TABLE_PATH_D}
          stroke="#FFEE88"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.7"
          fill="none"
          style={dashStyle}
        />
      </svg>
    </div>
  );
};
