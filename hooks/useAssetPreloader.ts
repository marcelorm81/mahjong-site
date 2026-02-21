/**
 * Asset preloader with real progress tracking.
 *
 * - Images are loaded via `new Image()` so the browser caches them.
 * - Videos are fetched (just enough to start buffering) via a hidden
 *   `<video preload="auto">` element.
 * - Progress is reported as 0 → 1 based on individual asset completion.
 */

import { useState, useEffect, useRef } from 'react';

export type AssetType = 'image' | 'video' | 'font';

export interface AssetEntry {
  url: string;
  type?: AssetType;  // auto-detected from extension if omitted
  /** Priority: 'critical' loads first, 'background' loads after critical batch */
  priority?: 'critical' | 'background';
}

interface PreloaderState {
  /** 0 → 1 progress for the critical batch */
  progress: number;
  /** True once every critical asset has loaded (or errored) */
  ready: boolean;
  /** Number of critical assets loaded */
  loaded: number;
  /** Total critical assets */
  total: number;
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function detectType(url: string): AssetType {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (['woff', 'woff2', 'ttf', 'otf'].includes(ext)) return 'font';
  return 'image';
}

function loadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // don't block on errors
    img.src = url;
  });
}

function loadVideo(url: string): Promise<void> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    // Resolve once enough data is buffered to start playing
    video.oncanplaythrough = () => {
      video.src = ''; // release
      resolve();
    };
    video.onerror = () => resolve();
    // Timeout: don't block forever on large videos
    const timeout = setTimeout(() => resolve(), 8000);
    video.oncanplaythrough = () => {
      clearTimeout(timeout);
      video.src = '';
      resolve();
    };
    video.src = url;
    video.load();
  });
}

function loadFont(url: string): Promise<void> {
  return fetch(url)
    .then(() => {})
    .catch(() => {}); // don't block
}

function loadAsset(url: string, type: AssetType): Promise<void> {
  switch (type) {
    case 'video':
      return loadVideo(url);
    case 'font':
      return loadFont(url);
    default:
      return loadImage(url);
  }
}

/* ── Hook ────────────────────────────────────────────────────────── */

export function useAssetPreloader(assets: AssetEntry[]): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    progress: 0,
    ready: false,
    loaded: 0,
    total: 0,
  });

  // Only run once on mount (assets list is expected to be stable)
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const critical = assets.filter((a) => a.priority !== 'background');
    const background = assets.filter((a) => a.priority === 'background');

    const total = critical.length;
    let loaded = 0;

    if (total === 0) {
      setState({ progress: 1, ready: true, loaded: 0, total: 0 });
      startBackground(background);
      return;
    }

    setState((prev) => ({ ...prev, total }));

    // Load critical assets concurrently
    critical.forEach((asset) => {
      const type = asset.type ?? detectType(asset.url);
      loadAsset(asset.url, type).then(() => {
        loaded++;
        const progress = loaded / total;
        setState({
          progress,
          ready: loaded >= total,
          loaded,
          total,
        });

        // Once critical batch is done, start background loading
        if (loaded >= total) {
          startBackground(background);
        }
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

/** Fire-and-forget background loading (no progress tracking needed) */
function startBackground(assets: AssetEntry[]) {
  if (assets.length === 0) return;

  // Stagger background loads to avoid saturating bandwidth
  let idx = 0;
  function loadNext() {
    if (idx >= assets.length) return;
    const asset = assets[idx++];
    const type = asset.type ?? detectType(asset.url);
    loadAsset(asset.url, type).then(loadNext);
  }

  // Load 2 at a time in background
  loadNext();
  loadNext();
}

/* ── Convenience: pre-built asset list for the app ───────────────── */

/** The background pattern used by AppShell on every page */
const PATTERN_BG =
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/pattern1.png';

const LOGIN_BG =
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/4fc239b0d3cda3435e374ac7b6e7307603371273/img%20-%20background.jpg';

const CHARACTERS =
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/3149293f5ccaff19c1a4dd0c716c9a8080a8c46f/img%20-%20characters.webp';

/** Bottom nav icons */
const NAV_ICONS = [
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Gift.webp',
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Tournament.webp',
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Reward.webp',
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Streak.webp',
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Shop.webp',
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Friends.webp',
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20History.webp',
  'https://raw.githubusercontent.com/marcelorm81/Mahjongtest/8c67fd0165c919a3b0e220a3511528ee6a78dd52/img%20-%20Tutorial.webp',
];

/** Top bar icons (local) */
const TOPBAR_ICONS = [
  '/assets/topbar-friends.png',
  '/assets/topbar-table.png',
  '/assets/topbar-calendar.png',
  '/assets/topbar-xp.png',
  '/assets/topbar-coin.png',
  '/assets/topbar-settings.png',
  '/assets/topbar-add.svg',
];

/** Lobby table character images (local) */
const LOBBY_CHARS = [
  '/assets/char-bubbletea.png',
  '/assets/char-cat.png',
  '/assets/char-executive.png',
  '/assets/char-granny.png',
  '/assets/char-papers.png',
];

/**
 * Complete asset manifest for the app.
 *
 * Critical: loaded during the login splash (blocks the loading bar).
 * Background: silently loaded after login completes.
 */
export const APP_ASSETS: AssetEntry[] = [
  // ── Critical: needed for login intro + immediately after ──
  { url: LOGIN_BG,   priority: 'critical' },
  { url: CHARACTERS, priority: 'critical' },
  { url: PATTERN_BG, priority: 'critical' },
  ...TOPBAR_ICONS.map((url) => ({ url, priority: 'critical' as const })),

  // ── Background: loaded silently after critical batch ──
  ...NAV_ICONS.map((url) => ({ url, priority: 'background' as const })),
  ...LOBBY_CHARS.map((url) => ({ url, priority: 'background' as const })),
  { url: '/assets/nav-rank.png', priority: 'background' },
  { url: '/assets/topbar-avatar.png', priority: 'background' },
  { url: '/assets/roof.png', priority: 'background' },
  { url: '/assets/gold.png', priority: 'background' },
  { url: '/assets/red.png', priority: 'background' },
  { url: '/assets/silver.png', priority: 'background' },
  // Tutorial videos (large - lazy background)
  { url: '/assets/waving_loop_desktop.mp4', type: 'video', priority: 'background' },
  { url: '/assets/waving_loop_mobile.mp4', type: 'video', priority: 'background' },
];
