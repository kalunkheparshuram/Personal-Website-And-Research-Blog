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
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  light: boolean;
}

export default function MusicPlayerControls({
  ready,
  isPlaying,
  isBuffering,
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

  const isLoading = !ready || isBuffering;

  return (
    <div
      className="flex items-center gap-1.5"
      role="group"
      aria-label="Music player"
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={!ready || isBuffering}
        aria-label="Previous track"
        className={`${base} ${theme}`}
      >
        <SkipBack size={13} strokeWidth={1.8} />
      </button>

      <button
        type="button"
        onClick={onPlayPause}
        disabled={!ready}
        aria-label={
          isLoading
            ? "Loading"
            : isPlaying
              ? "Pause"
              : "Play"
        }
        className={`${base} ${theme}`}
      >
        {isLoading ? (
          <Loader2
            size={13}
            strokeWidth={1.8}
            className="animate-spin"
          />
        ) : isPlaying ? (
          <Pause size={13} strokeWidth={1.8} />
        ) : (
          <Play size={13} strokeWidth={1.8} />
        )}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!ready || isBuffering}
        aria-label="Next track"
        className={`${base} ${theme}`}
      >
        <SkipForward size={13} strokeWidth={1.8} />
      </button>
    </div>
  );
}