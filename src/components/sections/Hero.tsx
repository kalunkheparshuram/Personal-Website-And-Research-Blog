import { useCallback, useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import GrowthRings from "../layout/GrowthRings";
import { loadGalleryItems, optimizedImageUrl, shuffled } from "../../lib/github";
import { HERO_GALLERY_CATEGORIES, HERO_SLIDE_COUNT } from "../../data/content";
import type { GalleryItem } from "../../types";

const ease = [0.22, 1, 0.36, 1] as const;
const AUTOPLAY_MS = 5200;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [slides, setSlides] = useState<GalleryItem[]>([]);
  const [index, setIndex] = useState(0);
  // Tracks which slide images have actually had their URL assigned. Only the
  // active slide plus the next one are ever eagerly requested — the rest
  // load lazily as the carousel advances — so the hero doesn't force the
  // browser to fetch every wallpaper image (large, jsDelivr-hosted photos)
  // on first paint just to show one of them.
  const [primedIndices, setPrimedIndices] = useState<Set<number>>(new Set());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bgParallax = useRef<HTMLDivElement>(null);

  // Wallpaper slideshow — sampled from the visitor's own gallery repo (see
  // Gallery.tsx / lib/github.ts) rather than stock imagery, so the hero
  // shows real photography. Falls back to a plain ink gradient if the
  // gallery manifest can't be reached.
  useEffect(() => {
    let cancelled = false;
    loadGalleryItems()
      .then((items) => {
        if (cancelled) return;
        const pool = items.filter((item) => HERO_GALLERY_CATEGORIES.includes(item.category));
        const picked = shuffled(pool.length ? pool : items).slice(0, HERO_SLIDE_COUNT);
        setSlides(picked);
      })
      .catch(() => {
        if (!cancelled) setSlides([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Priming the active + next slide (see below) is what actually triggers
  // the image fetch, but the browser only discovers that fetch once React
  // commits the style — a tick later than necessary. Preloading slide 0 as
  // soon as its URL is known starts the request immediately, at high
  // priority, since it's the page's LCP element.
  useEffect(() => {
    if (!slides.length) return undefined;
    const href = optimizedImageUrl(slides[0].url, 1600, 68);
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = href;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [slides]);

  const goTo = useCallback(
    (next: number) => {
      if (!slides.length) return;
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length]
  );

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!slides.length || prefersReducedMotion) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
  }, [slides.length, prefersReducedMotion]);

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartTimer]);

  // Slow depth-parallax on the hero background layer, ported from v1's
  // useParallax-adjacent scroll effect on the slide stack.
  useEffect(() => {
    const node = bgParallax.current;
    if (!node || prefersReducedMotion) return undefined;

    let raf: number;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const offset = window.scrollY * 0.28;
        node.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  // Prime the active slide, and pre-fetch the next one a little ahead of
  // time so the crossfade never has to wait on a network request.
  useEffect(() => {
    if (!slides.length) return;
    const next = (index + 1) % slides.length;
    setPrimedIndices((prev) => {
      if (prev.has(index) && prev.has(next)) return prev;
      const updated = new Set(prev);
      updated.add(index);
      updated.add(next);
      return updated;
    });
  }, [index, slides.length]);

  const handleNav = (dir: number) => {
    goTo(index + dir);
    restartTimer();
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.14 } },
  };
  const item = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
  };

  const activeSlide = slides[index];

  return (
    <header
      id="hero"
      className="relative flex min-h-[100dvh] items-center overflow-hidden border-b border-stone-line bg-sumi isolate"
      aria-label="Introduction"
    >
      {/* ---- Wallpaper slideshow layer ---- */}
      <div className="absolute -inset-y-[10%] inset-x-0 -z-20" ref={bgParallax}>
        {slides.map((slide, i) => (
          <div
            key={slide.url}
            className="hero-slide absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: primedIndices.has(i) ? `url(${optimizedImageUrl(slide.url, 1600, 68)})` : undefined,
              opacity: i === index ? 1 : 0,
              transform: i === index ? "scale(1)" : "scale(1.06)",
              filter: "grayscale(0.2) saturate(0.9)",
            }}
            role="img"
            aria-label={slide.label}
            aria-hidden={i !== index}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-tr from-sumi/95 via-sumi/72 to-indigo-deep/55" />
      </div>

      <GrowthRings
        tone="duo"
        className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-[560px] w-[560px] -translate-y-1/2 opacity-40 sm:opacity-60"
      />

      <m.div
        className="wrap relative z-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <m.p
          variants={item}
          className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-rice/70"
        >
          {activeSlide && (
            <span className="rounded-sm border border-moss-soft/50 px-2 py-0.5 text-moss-soft">
              {activeSlide.category}
            </span>
          )}
          Cybersecurity Analyst — Bug Bounty Hunter
        </m.p>

        <m.h1
          variants={item}
          className="max-w-3xl text-[2.6rem] leading-[1.05] text-rice sm:text-6xl lg:text-[5rem]"
        >
          Parshuram
          <br />
          <span className="italic text-moss-soft">Kalunkhe</span>
        </m.h1>

        <m.p variants={item} className="mt-6 max-w-[50ch] text-lg text-rice/80">
          I look for what's fragile in a system before someone with worse intentions does.
          Cybersecurity professional by craft — farmer, in time.
        </m.p>

        <m.div variants={item} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-sm bg-moss px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-sumi transition-transform duration-300 ease-zen hover:-translate-y-0.5 hover:shadow-soft"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="relative inline-flex items-center gap-2 overflow-hidden rounded-sm border border-rice/40 px-6 py-3 font-mono text-[13px] uppercase tracking-wide text-rice transition-colors duration-300 ease-zen hover:bg-rice hover:text-sumi"
          >
            Get in touch
          </a>
        </m.div>
      </m.div>

      {/* ---- Carousel controls ---- */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-6 z-10 hidden items-center gap-4 sm:flex lg:right-10">
          <button
            type="button"
            onClick={() => handleNav(-1)}
            aria-label="Previous slide"
            className="text-rice/70 transition-colors duration-200 hover:text-rice"
          >
            <ArrowLeft size={16} strokeWidth={1.6} />
          </button>
          <div className="flex gap-2" role="tablist" aria-label="Hero slides">
            {slides.map((slide, i) => (
              <button
                key={slide.url}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => {
                  goTo(i);
                  restartTimer();
                }}
                className={`h-2 w-2 rounded-full border transition-all duration-200 ${
                  i === index ? "scale-125 border-moss-soft bg-moss-soft" : "border-rice/50 bg-transparent"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => handleNav(1)}
            aria-label="Next slide"
            className="text-rice/70 transition-colors duration-200 hover:text-rice"
          >
            <ArrowRight size={16} strokeWidth={1.6} />
          </button>
        </div>
      )}

      {activeSlide && (
        <p
          key={activeSlide.url}
          className="absolute bottom-9 left-5 z-10 hidden max-w-[34ch] font-display text-[0.98rem] italic text-rice/70 sm:block sm:left-8 lg:left-10"
        >
          {activeSlide.label}
        </p>
      )}

      <m.a
        href="#about"
        aria-label="Scroll to About section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-rice/60 transition-colors hover:text-moss-soft"
      >
        <m.span
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <ArrowDown size={18} strokeWidth={1.5} />
        </m.span>
      </m.a>
    </header>
  );
}
