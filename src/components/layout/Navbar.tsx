import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems, YOUTUBE_PLAYLIST_ID } from "../../data/content";
import {
  loadGalleryItems,
  optimizedImageUrl,
  shuffled,
} from "../../lib/github";
import { useYouTubePlaylistPlayer } from "../../hooks/useYouTubePlaylistPlayer";
import type { GalleryItem } from "../../types";
import MusicPlayerControls from "./MusicPlayerControls";

const ease = [0.22, 1, 0.36, 1] as const;
const MENU_AUTOPLAY_MS = 4200;
const MENU_SLIDE_COUNT = 4;

export default function Navbar() {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuSlides, setMenuSlides] = useState<GalleryItem[]>([]);
  const [menuIndex, setMenuIndex] = useState(0);
  const menuTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // One shared player for both the desktop and mobile control clusters
  // below, so opening/closing the mobile menu never spawns a second
  // (conflicting) audio stream.
  const player = useYouTubePlaylistPlayer(YOUTUBE_PLAYLIST_ID);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The full-screen mobile menu's background wallpaper — same source as the
  // Hero carousel (loadGalleryItems() is cached, so opening the menu after
  // the Hero has already mounted costs no extra fetch). Only loaded and
  // autoplayed while the menu is actually open.
  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;
    if (menuSlides.length === 0) {
      loadGalleryItems()
        .then((items) => {
          if (cancelled) return;
          setMenuSlides(shuffled(items).slice(0, MENU_SLIDE_COUNT));
        })
        .catch(() => {
          if (!cancelled) setMenuSlides([]);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [open, menuSlides.length]);

  const restartMenuTimer = useCallback(() => {
    if (menuTimerRef.current) clearInterval(menuTimerRef.current);
    if (!open || menuSlides.length < 2 || prefersReducedMotion) return;
    menuTimerRef.current = setInterval(() => {
      setMenuIndex((prev) => (prev + 1) % menuSlides.length);
    }, MENU_AUTOPLAY_MS);
  }, [open, menuSlides.length, prefersReducedMotion]);

  useEffect(() => {
    restartMenuTimer();
    return () => {
      if (menuTimerRef.current) clearInterval(menuTimerRef.current);
    };
  }, [restartMenuTimer]);

  useEffect(() => {
    if (!open) setMenuIndex(0);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 py-4 transition-all duration-300 ease-zen md:py-5 ${
        scrolled
          ? "border-b border-stone-line bg-[#F5F1E8] py-3 shadow-soft"
          : ""
      }`}
    >
      {/* Hidden YouTube player backing the music controls below — kept
          mounted here (not inside the mobile menu) so it persists and
          keeps playing regardless of menu open/close. */}
      <div
        ref={player.containerRef}
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      />

      {/* relative + z-50: without an explicit position, this row paints in
          the page's normal-flow layer, which sits BELOW any positioned
          sibling that has a z-index — including the fixed, z-40 mobile
          menu right below it in the DOM. That was swallowing the logo and
          the open/close button the instant the menu opened. */}
      <div className="wrap relative z-50 flex items-center justify-between">
        <a
          href="#hero"
          className={`font-display text-xl text-rice transition-colors duration-300 ${
            scrolled ? "text-sumi" : "text-rice"
          }`}
        >
          PK
          <span
            className={`transition-colors duration-300 ${scrolled ? "text-moss" : "text-moss-soft"}`}
          >
            .
          </span>
        </a>

        {/* Desktop nav — light (matches the hero's photo backdrop) until the
            page scrolls onto the light rice sections, then switches to ink. */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`font-mono text-xs uppercase tracking-wide transition-colors duration-200 ${
                scrolled
                  ? "text-sumi/70 hover:text-moss-deep"
                  : "text-rice/85 hover:text-moss-soft"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="./pay.html"
            className={`!py-2 !px-4 text-[11px] transition-colors duration-300 ${
              scrolled
                ? "btn-ghost"
                : "inline-flex items-center gap-2 rounded-sm border border-rice/40 font-mono uppercase tracking-wide text-rice hover:bg-rice hover:text-sumi"
            }`}
          >
            Say hello
          </a>

          <MusicPlayerControls
            ready={player.ready}
            isPlaying={player.isPlaying}
            isBuffering={player.isBuffering}
            onPrev={player.prev}
            onPlayPause={player.playPause}
            onNext={player.next}
            light={!scrolled}
          />
        </nav>

        {/* Mobile hamburger — always light, matching the mobile bar's
            solid dark background regardless of scroll position. */}
        <button
          type="button"
          className={`flex z-50 h-10 w-10 items-center justify-center transition-colors duration-300 md:hidden ${
            scrolled ? "text-sumi" : "text-rice"
          }`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <X size={22} strokeWidth={1.5} />
          ) : (
            <Menu size={22} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Full-screen mobile menu, with a wallpaper slideshow background —
          same carousel treatment as the Hero, reskinned for a frosted-glass
          takeover feel. Desktop is untouched (md:hidden). */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 -z-10 overflow-hidden bg-sumi">
              {menuSlides.map((slide, i) => (
                <div
                  key={slide.url}
                  className="hero-slide absolute inset-0 bg-cover bg-center"
                  style={{
                    // Heavily blurred by the scrim on top of it, so a low
                    // width/quality here is invisible in practice and
                    // saves real bytes on mobile.
                    backgroundImage: `url(${optimizedImageUrl(slide.url, 720, 45)})`,
                    opacity: i === menuIndex ? 1 : 0,
                    transform: i === menuIndex ? "scale(1)" : "scale(1.06)",
                    filter: "grayscale(0.25) saturate(0.85)",
                  }}
                  role="img"
                  aria-label={slide.label}
                  aria-hidden={i !== menuIndex}
                />
              ))}
              <div className="absolute inset-0 bg-sumi/70 backdrop-blur-xl" />
            </div>

            <nav
              id="mobile-menu"
              className="flex h-full flex-col justify-center px-4"
            >
              <ul className="flex flex-col">
                {navItems.map((item, i) => (
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease,
                      delay: prefersReducedMotion ? 0 : 0.06 * i,
                    }}
                    className="border-b border-rice/10 last:border-0"
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-4 font-display text-2xl text-rice transition-colors duration-200 hover:text-moss-soft"
                    >
                      {item.label}
                    </a>
                  </m.li>
                ))}
              </ul>

              <m.a
                href="./pay.html"
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease,
                  delay: prefersReducedMotion ? 0 : 0.06 * navItems.length,
                }}
                className="mt-8 inline-flex items-center justify-center rounded-sm bg-moss px-6 py-3.5 font-mono text-[13px] uppercase tracking-wide text-sumi"
              >
                Say hello
              </m.a>

              <m.div
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease,
                  delay: prefersReducedMotion
                    ? 0
                    : 0.06 * (navItems.length + 1),
                }}
                className="mt-6 flex justify-center"
              >
                <MusicPlayerControls
                  ready={player.ready}
                  isPlaying={player.isPlaying}
                  isBuffering={player.isBuffering}
                  onPrev={player.prev}
                  onPlayPause={player.playPause}
                  onNext={player.next}
                  light
                />
              </m.div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
