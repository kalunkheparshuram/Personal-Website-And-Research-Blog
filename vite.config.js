import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
// https://vitejs.dev/config/
//
// GITHUB PAGES NOTE:
// base: "./" makes every built asset URL relative instead of absolute
// (e.g. "./assets/index.js" instead of "/assets/index.js"). That means
// this build works unmodified whether it's deployed to a *user* page
// (https://<user>.github.io/, served at the domain root) or a *project*
// page (https://<user>.github.io/<repo>/, served from a subpath) —
// no base path to remember to change before deploying.
//
// There is intentionally no client-side router in this app (it's a
// single page navigated via in-page anchors), which sidesteps the
// classic GitHub Pages SPA problem entirely: a hard refresh on any
// anchor (e.g. /#projects) still resolves to the same index.html and
// scrolls into place — there's no second route for the server to 404 on.
export default defineConfig({
    base: "./",
    plugins: [react()],
    define: {
        // A stable-per-build cache-busting token for the local /public JSON
        // manifests (gallery.json, posts.json) — see src/lib/github.ts. Using
        // Date.now() at *runtime* (the previous approach) added a unique
        // query string on every single page load, defeating the browser's
        // HTTP cache even for repeat visits with no new deploy in between.
        // Baking the timestamp in at *build* time means the manifests stay
        // cacheable between visits and only bust once an actual new build
        // is deployed.
        __BUILD_ID__: JSON.stringify(Date.now()),
    },
    build: {
        rollupOptions: {
            // Multi-page build: pay.html is a genuinely separate static page (its
            // own <html>/<head>/JS entry), not a client-side route — consistent
            // with this project's no-router approach, and it means the "Say
            // hello" → payment flow is a real full navigation with its own
            // browser history entry, not a fake in-app "page".
            //
            // No manual vendor chunking here: Vite/Rollup's automatic per-entry
            // splitting already keeps each page's bundle to what it actually
            // imports, which matters more now that pay.html is deliberately
            // lightweight (no framer-motion) — a forced shared "vendor-motion"
            // chunk previously leaked into pay.html's preload list even though
            // it never imports framer-motion.
            input: {
                main: path.resolve(__dirname, "index.html"),
                pay: path.resolve(__dirname, "pay.html"),
            },
        },
    },
});
