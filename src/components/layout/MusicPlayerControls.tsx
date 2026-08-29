import { AnimatePresence, m } from "framer-motion";
import {
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface MusicPlayerControlsProps {
  ready: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  track: { title: string; author: string } | null;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  light: boolean;
}

export default function MusicPlayerControls({
  ready,
  isPlaying,
  isBuffering,
  track,
  onPrev,
  onPlayPause,
  onNext,
  light,
}: MusicPlayerControlsProps) {
  const base =
    "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200 disabled:opacity-40";

  const theme = light
    ? "border-rice/30 text-rice hover:bg-rice/10"
    : "border-stone-line-strong text-sumi/70 hover:bg-sumi/5 hover:text-sumi";

  const isInitializing = isBuffering && !ready;
  const isLoading = isBuffering;

  // One key that identifies which icon should currently be showing, so
  // AnimatePresence knows exactly when to crossfade to a different one.
  const iconKey = isLoading ? "loading" : isPlaying ? "pause" : "play";
  const hasTrack = Boolean(track && (track.title || track.author));

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
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {hasTrack ? (
          <m.div
            key="track"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[4rem] overflow-hidden"
          >
            <div
              className={`flex w-max animate-marquee gap-8 whitespace-nowrap font-mono text-[10px] uppercase tracking-wide ${
                light ? "text-rice/55" : "text-sumi/45"
              }`}
            >
              <span>
                {track?.title}
                {track?.author ? ` — ${track.author}` : ""}
              </span>
              <span aria-hidden="true">
                {track?.title}
                {track?.author ? ` — ${track.author}` : ""}
              </span>
            </div>
          </m.div>
        ) : (
          <m.div
            key="empty"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[4rem] overflow-hidden"
          >
            <div
              className={`flex w-max animate-marquee gap-8 whitespace-nowrap font-mono text-[10px] uppercase tracking-wide ${
                light ? "text-rice/40" : "text-sumi/35"
              }`}
            >
              <span>Not playing any music</span>
              <span aria-hidden="true">Not playing any music</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}