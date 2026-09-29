/// <reference types="vite/client" />

// Injected at build time via vite.config.ts's `define` — a stable
// per-deploy cache-busting token for the local JSON manifests.
declare const __BUILD_ID__: string;
