import React, { useId, useRef, useEffect } from 'react';
import gsap from 'gsap';

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

/* Particle colors — warm magical palette */
const PARTICLE_COLORS = ['#FFD700', '#FFFBE6', '#FFA500', '#FFE066'];

interface TableGlowPathProps {
  isHovered?: boolean;
}

/**
 * Three-layer traveling glow that circulates the table outline on hover,
 * plus floating glowing particles that emit from the path.
 *
 * z-[5] → behind card image (z-10), above background.
 * Paused by default — CSS .group:hover .table-glow-path starts it.
 */
export const TableGlowPath: React.FC<TableGlowPathProps> = ({ isHovered = false }) => {
  const uid = useId();
  const blurWideId = `tgw${uid}`;
  const blurCoreId = `tgc${uid}`;
  const blurHeadId = `tgh${uid}`;
  const blurParticleId = `tgp${uid}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const intervalRef = useRef<number | null>(null);

  /* ── Particle emitter ── */
  useEffect(() => {
    if (!isHovered || !pathRef.current || !svgRef.current) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const path = pathRef.current;
    const svg = svgRef.current;
    const totalLen = path.getTotalLength();

    intervalRef.current = window.setInterval(() => {
      const count = 1 + (Math.random() > 0.5 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        const dist = Math.random() * totalLen;
        const pt = path.getPointAtLength(dist);
        const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        const size = 3 + Math.random() * 5;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', String(pt.x));
        circle.setAttribute('cy', String(pt.y));
        circle.setAttribute('r', String(size));
        circle.setAttribute('fill', color);
        circle.setAttribute('opacity', '1.0');
        circle.style.filter = `url(#${blurParticleId})`;
        svg.appendChild(circle);

        gsap.to(circle, {
          attr: { cy: pt.y - 30 - Math.random() * 40, r: 0 },
          opacity: 0,
          duration: 0.9 + Math.random() * 0.6,
          ease: 'power2.out',
          onComplete: () => circle.remove(),
        });
      }
    }, 140);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isHovered, blurParticleId]);

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
        top-[23%] left-[12%] right-[12%] bottom-[5%]
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
      "
    >
      <svg
        ref={svgRef}
        viewBox="0 0 761 629"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Wide blur for the outer halo */}
          <filter id={blurWideId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="25" />
          </filter>

          {/* Core blur — medium diffusion */}
          <filter id={blurCoreId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" />
          </filter>

          {/* Head blur — light softening */}
          <filter id={blurHeadId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>

          {/* Particle glow blur */}
          <filter id={blurParticleId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Hidden path for getPointAtLength calculations */}
        <path ref={pathRef} d={TABLE_PATH_D} fill="none" stroke="none" />

        {/* Layer 1 — wide diffuse orange halo */}
        <path
          className="table-glow-path"
          d={TABLE_PATH_D}
          stroke="#FFA500"
          strokeWidth="30"
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
          strokeWidth="12"
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
          strokeWidth="5"
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
