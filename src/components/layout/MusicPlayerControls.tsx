import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  Check,
  ListMusic,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import type { MusicPlaylist } from "../../data/content";

const ease = [0.22, 1, 0.36, 1] as const;

interface MusicPlayerControlsProps {
  ready: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  track: { title: string; author: string } | null;
  /** Returns 0..1. Read on a timer by ProgressBar only — never state. */
  getProgress: () => number;
  playlists: MusicPlaylist[];
  activePlaylistId: string;
  onSelectPlaylist: (id: string) => void;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  light: boolean;
  /** Which way the playlist menu opens. Use "up" near the bottom of the screen. */
  pickerPlacement?: "down" | "up";
}

interface PlaylistPickerProps {
  playlists: MusicPlaylist[];
  activeId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
  placement: "down" | "up";
  buttonClass: string;
}

function PlaylistPicker({
  playlists,
  activeId,
  onSelect,
  disabled,
  placement,
  buttonClass,
}: PlaylistPickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside press or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (playlists.length < 2) return null;

  const active = playlists.find((p) => p.id === activeId);
  const offset = placement === "up" ? 6 : -6;

  return (
    <div ref={wrapperRef} className="relative">
      <m.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-label={`Choose playlist. Current: ${active?.label ?? "none"}`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={active?.label}
        whileTap={{ scale: 0.85 }}
        className={buttonClass}
      >
        <ListMusic size={13} strokeWidth={1.8} />
      </m.button>

      <AnimatePresence>
        {open && (
          <m.ul
            role="menu"
            aria-label="Choose a playlist"
            initial={{ opacity: 0, y: offset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: offset }}
            transition={{ duration: 0.2, ease }}
            className={`absolute right-0 z-50 w-44 overflow-hidden rounded-md border border-stone-line bg-rice py-1 shadow-lift ${
              placement === "up" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {playlists.map((p) => {
              const selected = p.id === activeId;
              return (
                <li key={p.id} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={selected}
                    onClick={() => {
                      onSelect(p.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left font-mono text-[11px] uppercase tracking-wide transition-colors duration-150 hover:bg-sumi/5 ${
                      selected ? "text-moss-deep" : "text-sumi/70"
                    }`}
                  >
                    <span className="truncate">{p.label}</span>
                    {selected && <Check size={13} strokeWidth={2} aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Text scrolling right-to-left in a seamless loop, at a consistent speed
 * regardless of length. Spacing lives inside each copy (trailing padding)
 * so 50% of the doubled row is exactly one full repeat.
 */
function MarqueeText({ text, className }: { text: string; className: string }) {
  const seconds = Math.max(6, (text.length * 6.25 + 32) / 22);

  return (
    <div
      className={`flex w-max animate-marquee whitespace-nowrap font-mono text-[10px] uppercase tracking-wide ${className}`}
      style={{ animationDuration: `${seconds}s` }}
    >
      <span className="pr-8">{text}</span>
      <span className="pr-8" aria-hidden="true">
        {text}
      </span>
    </div>
  );
}

/**
 * Owns its own polling and writes to the DOM directly, so playback time
 * advancing never re-renders the navbar. Polls only while playing.
 */
function ProgressBar({
  getProgress,
  active,
  light,
}: {
  getProgress: () => number;
  active: boolean;
  light: boolean;
}) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${getProgress()})`;
      }
    };
    update();
    if (!active) return undefined;
    const id = setInterval(update, 500);
    return () => clearInterval(id);
  }, [active, getProgress]);

  return (
    <div
      className={`h-[2px] w-full overflow-hidden rounded-full ${
        light ? "bg-rice/20" : "bg-sumi/12"
      }`}
      role="progressbar"
      aria-label="Track progress"
    >
      <div
        ref={fillRef}
        className={`h-full w-full origin-left rounded-full transition-transform duration-500 ease-linear ${
          light ? "bg-rice/70" : "bg-sumi/55"
        }`}
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export default function MusicPlayerControls({
  ready,
  isPlaying,
  isBuffering,
  track,
  getProgress,
  playlists,
  activePlaylistId,
  onSelectPlaylist,
  onPrev,
  onPlayPause,
  onNext,
  light,
  pickerPlacement = "down",
}: MusicPlayerControlsProps) {
  const base =
    "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-40";

  const theme = light
    ? "border-rice/30 text-rice hover:bg-rice/10"
    : "border-stone-line-strong text-sumi/70 hover:bg-sumi/5 hover:text-sumi";

  const isInitializing = isBuffering && !ready;
  const isLoading = isBuffering;

  const iconKey = isLoading ? "loading" : isPlaying ? "pause" : "play";
  const hasTrack = Boolean(track && (track.title || track.author));

  const caption = hasTrack
    ? `${track?.title ?? ""}${track?.author ? ` — ${track.author}` : ""}`
    : "Not playing any music";

  const captionColor = hasTrack
    ? light
      ? "text-rice/55"
      : "text-sumi/45"
    : light
      ? "text-rice/40"
      : "text-sumi/35";

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-1.5" role="group" aria-label="Music player">
        <m.button
          type="button"
          onClick={onPrev}
          disabled={!ready || isBuffering}
          aria-label="Previous track"
          whileTap={{ scale: 0.85 }}
          className={`${base} ${theme}`}
        >
          <SkipBack size={13} strokeWidth={1.8} />
        </m.button>

        <m.button
          type="button"
          onClick={onPlayPause}
          disabled={isInitializing}
          aria-label={isLoading ? "Loading" : isPlaying ? "Pause" : "Play"}
          whileTap={{ scale: 0.85 }}
          className={`${base} ${theme} relative overflow-hidden`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={iconKey}
              initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
              transition={{ duration: 0.22, ease }}
              className="flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 size={13} strokeWidth={1.8} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={13} strokeWidth={1.8} />
              ) : (
                <Play size={13} strokeWidth={1.8} />
              )}
            </m.span>
          </AnimatePresence>
        </m.button>

        <m.button
          type="button"
          onClick={onNext}
          disabled={!ready || isBuffering}
          aria-label="Next track"
          whileTap={{ scale: 0.85 }}
          className={`${base} ${theme}`}
        >
          <SkipForward size={13} strokeWidth={1.8} />
        </m.button>

        <PlaylistPicker
          playlists={playlists}
          activeId={activePlaylistId}
          onSelect={onSelectPlaylist}
          disabled={isInitializing}
          placement={pickerPlacement}
          buttonClass={`${base} ${theme}`}
        />
      </div>

      <div className="flex max-w-[4rem] flex-col gap-1">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={caption}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <MarqueeText text={caption} className={captionColor} />
          </m.div>
        </AnimatePresence>

        {hasTrack && (
          <ProgressBar getProgress={getProgress} active={isPlaying} light={light} />
        )}
      </div>
    </div>
  );
}