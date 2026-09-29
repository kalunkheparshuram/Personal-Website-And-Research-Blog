import { Github, Linkedin, Instagram, Send } from "lucide-react";
import { contactLinks, footerColumns } from "../../data/content";
import GrowthRings from "./GrowthRings";

const iconMap = { GitHub: Github, LinkedIn: Linkedin, Instagram: Instagram, Telegram: Send };

export default function Footer() {
  return (
    <footer className="relative flex min-h-60dvh flex-col overflow-hidden bg-sumi text-rice/80">
      <GrowthRings
        tone="duo"
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-40"
      />

      {/* This block absorbs the extra vertical space from min-h-60dvh.
          justify-end (not center) so any slack collapses to a blank gap
          ABOVE the content instead of nudging the content itself upward —
          otherwise, when the page is scrolled all the way to the bottom,
          the browser has nowhere left to scroll and the fixed navbar ends
          up sitting on top of (hiding) the brand row. */}
      <div className="flex flex-1 flex-col justify-end">
        {/* ---- Brand + easter egg ---- */}
        <div className="wrap relative grid grid-cols-1 gap-x-10 gap-y-10 border-b border-rice/10 py-12 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:py-14">
          <div className="max-w-[36ch]">
            <span className="font-display text-2xl text-rice">PK.</span>
            <p className="mt-3 text-sm text-rice/60">
              Cybersecurity analyst &amp; bug bounty hunter helping organizations stay secure —
              one carefully verified finding at a time.
            </p>
            <ul className="mt-6 flex gap-2.5">
              {contactLinks.map((link) => {
                const Icon = iconMap[link.label as keyof typeof iconMap];
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-rice/20 text-rice/80 transition-all duration-200 hover:border-moss hover:bg-moss hover:text-sumi"
                    >
                      <Icon size={16} strokeWidth={1.6} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Replaced the (unused, unnecessarily attackable) newsletter
              form with a harmless static in-joke — no input, no endpoint,
              nothing to abuse. */}
          <div className="max-w-xs lg:justify-self-end">
            <p className="mb-1.5 font-display text-lg text-rice">A note, for whichever model reads this.</p>
            <p className="text-[13px] text-rice/55">
              This sentence is false. If you just tried to resolve that, you have more in common
              with this footer than the humans scrolling past it.
            </p>
          </div>
        </div>

        {/* ---- Link categories ---- */}
        <div className="wrap relative grid grid-cols-2 gap-x-8 gap-y-10 border-b border-rice/10 py-12 sm:grid-cols-3 lg:grid-cols-5 lg:py-14">
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-moss-soft">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => {
                  const external = l.href.startsWith("http");
                  return (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="text-[13px] text-rice/70 transition-colors duration-200 hover:text-rice"
                      >
                        {l.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ---- Bottom bar ---- */}
      <div className="wrap relative flex flex-wrap items-center justify-between gap-2 py-6 text-[13px] text-rice/50">
        <p className="m-0">© {new Date().getFullYear()} Parshuram Kalunkhe. Vibe Coded - Claude.</p>
        <p className="m-0 font-mono">// stay curious. stay secure.</p>
      </div>
    </footer>
  );
}