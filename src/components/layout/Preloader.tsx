import { useEffect, useState } from "react";

interface PreloaderProps {
  onDone?: () => void;
}

/**
 * Full-screen preloader shown while the page's critical assets settle.
 * Ported 1:1 from the original site's Preloader — same crack-drawn-in-one-
 * stroke motif, same timings — reskinned from the original's forest/gold
 * palette to v2's ink/moss tokens (bg-sumi, stroke moss) so it matches the
 * zen aesthetic. Purely presentational — always resolves after a short
 * timer so it never traps a real visitor.
 */
export default function Preloader({ onDone }: PreloaderProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const drawTimer = setTimeout(() => setLeaving(true), 1100);
    const doneTimer = setTimeout(() => onDone?.(), 1700);
    return () => {
      clearTimeout(drawTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-5 bg-sumi transition-[opacity,visibility] duration-[550ms] ease-zen ${
        leaving ? "invisible pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <svg
        className="h-auto w-[min(200px,40vw)]"
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="preloader-crack"
          d="M10 90 L55 40 L80 70 L120 20 L150 55 L190 25"
          stroke="#9AAA8B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="m-0 font-mono text-[11px] uppercase tracking-[0.3em] text-rice/65">
        parshuram kalunkhe
      </p>
    </div>
  );
}
