import { useCallback, useEffect, useRef, useState } from "react";
import type { MusicPlaylist } from "../data/content";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

/**
 * Loads the YouTube IFrame API script once. Safe to call many times.
 * If the script fails, the failed tag is removed so the next call retries
 * cleanly (the old version left the dead tag behind and then waited
 * forever on a promise that could never resolve).
 */
function loadYouTubeIframeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      script.remove();
      apiPromise = null;
      reject(new Error("Failed to load YouTube IFrame API"));
    };
    document.head.appendChild(script);
  });

  return apiPromise;
}

const MAX_HISTORY = 50;
const MAX_ERROR_STREAK = 5;
// Covers API script + iframe + playlist fetch. GitHub Pages visitors on a
// cold cache can need well over the old 15s.
const LOAD_TIMEOUT_MS = 20000;

interface StartOptions {
  /** true = user wants sound now. false = quiet warm-up, no playback. */
  autoplay: boolean;
  attempt?: number;
}

export function useYouTubePlaylistPlayer(playlists: MusicPlaylist[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const historyRef = useRef<number[]>([]);
  const errorStreakRef = useRef(0);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generationRef = useRef(0);
  // User pressed play before the warmed-up player was ready.
  const pendingPlayRef = useRef(false);
  // Has the current player produced sound yet? The first play jumps to a
  // random track; later plays just resume.
  const hasStartedRef = useRef(false);

  const [activePlaylistId, setActivePlaylistId] = useState(playlists[0]?.id ?? "");
  const activePlaylistIdRef = useRef(activePlaylistId);

  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{
    title: string;
    author: string;
  } | null>(null);

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  // Progress is NOT React state: ProgressBar polls this and writes to the DOM.
  const getProgress = useCallback(() => {
    const p = playerRef.current;
    if (!p) return 0;
    const duration = p.getDuration?.() ?? 0;
    const current = p.getCurrentTime?.() ?? 0;
    return duration > 0 ? Math.min(current / duration, 1) : 0;
  }, []);

  const retirePlayer = useCallback(() => {
    generationRef.current += 1;
    clearWatchdog();
    const player = playerRef.current;
    playerRef.current = null;
    if (player) {
      try {
        player.destroy();
      } catch {
        // already gone
      }
    }
    containerRef.current?.replaceChildren();
  }, [clearWatchdog]);

  /** `silent` = background warm-up failed; don't show "unavailable". */
  const failLoad = useCallback(
    (label: string, silent = false) => {
      retirePlayer();
      pendingPlayRef.current = false;
      setReady(false);
      setIsPlaying(false);
      setIsBuffering(false);
      setCurrentTrack(silent ? null : { title: `${label} unavailable`, author: "" });
    },
    [retirePlayer],
  );

  const jumpToRandom = useCallback((player: any, recordHistory: boolean) => {
    const list = player.getPlaylist?.();
    if (!Array.isArray(list) || list.length === 0) return false;

    const currentIndex: number = player.getPlaylistIndex?.() ?? -1;
    if (recordHistory && currentIndex >= 0) {
      historyRef.current.push(currentIndex);
      if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
    }

    let index = Math.floor(Math.random() * list.length);
    if (list.length > 1 && index === currentIndex) {
      index = (index + 1) % list.length;
    }

    setIsBuffering(true);
    player.playVideoAt(index);
    return true;
  }, []);

  const buildPlayer = useCallback(
    (entry: MusicPlaylist, generation: number) => {
      const stale = () => generation !== generationRef.current;
      const quiet = () => !pendingPlayRef.current && !hasStartedRef.current;

      const host = containerRef.current;
      if (!host || !window.YT?.Player) {
        failLoad(entry.label, quiet());
        return;
      }

      const mount = document.createElement("div");
      host.appendChild(mount);

      try {
        playerRef.current = new window.YT.Player(mount, {
          width: "1",
          height: "1",
          playerVars: {
            listType: "playlist",
            list: entry.playlistId,
            controls: 0,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (e: any) => {
              if (stale()) return;
              setReady(true);

              if (pendingPlayRef.current) {
                // User already pressed play while we were loading.
                if (!jumpToRandom(e.target, false)) e.target.playVideo();
              } else {
                // Quiet warm-up finished: nothing left to wait for.
                clearWatchdog();
              }
            },

            onStateChange: (e: any) => {
              if (stale() || !window.YT?.PlayerState) return;
              const states = window.YT.PlayerState;

              switch (e.data) {
                case states.BUFFERING:
                  setIsBuffering(true);
                  setIsPlaying(false);
                  break;

                case states.PLAYING: {
                  clearWatchdog();
                  pendingPlayRef.current = false;
                  hasStartedRef.current = true;
                  errorStreakRef.current = 0;
                  setIsBuffering(false);
                  setIsPlaying(true);
                  const data = e.target.getVideoData?.();
                  if (data) {
                    setCurrentTrack({
                      title: data.title || "",
                      author: data.author || "",
                    });
                  }
                  break;
                }

                case states.PAUSED:
                case states.CUED:
                  setIsBuffering(false);
                  setIsPlaying(false);
                  break;

                case states.ENDED:
                  setIsPlaying(false);
                  if (!jumpToRandom(e.target, true)) setIsBuffering(false);
                  break;
              }
            },

            onError: (e: any) => {
              if (stale()) return;
              console.error("YouTube player error:", e.data, "playlist:", entry.label);

              const list = e.target.getPlaylist?.();
              const playlistLoaded = Array.isArray(list) && list.length > 0;
              const skippable = [100, 101, 150].includes(e.data);

              if (skippable && playlistLoaded && errorStreakRef.current < MAX_ERROR_STREAK) {
                errorStreakRef.current += 1;
                if (jumpToRandom(e.target, false)) return;
              }

              failLoad(entry.label, quiet());
            },
          },
        });
      } catch (error) {
        console.error("Could not create YouTube player:", error);
        failLoad(entry.label, quiet());
      }
    },
    [clearWatchdog, failLoad, jumpToRandom],
  );

  // Lets the watchdog call startPlayback again for its one automatic retry.
  const startRef = useRef<(key: string, opts: StartOptions) => void>(() => {});

  const startPlayback = useCallback(
    (playlistKey: string, { autoplay, attempt = 0 }: StartOptions) => {
      const entry = playlists.find((p) => p.id === playlistKey);
      if (!entry) return;

      retirePlayer();
      const generation = ++generationRef.current;
      historyRef.current = [];
      errorStreakRef.current = 0;
      hasStartedRef.current = false;
      pendingPlayRef.current = autoplay;

      setReady(false);
      setIsPlaying(false);
      setIsBuffering(autoplay);
      setCurrentTrack(null);

      // The watchdog now covers the API script download too, not just the
      // iframe. A slow first load gets one silent retry before giving up.
      watchdogRef.current = setTimeout(() => {
        if (generation !== generationRef.current) return;
        if (!pendingPlayRef.current) {
          failLoad(entry.label, true);
          return;
        }
        if (attempt < 1) {
          startRef.current(playlistKey, { autoplay: true, attempt: attempt + 1 });
          return;
        }
        failLoad(entry.label);
      }, LOAD_TIMEOUT_MS);

      if (window.YT?.Player) {
        buildPlayer(entry, generation);
        return;
      }

      loadYouTubeIframeApi()
        .then(() => {
          if (generation === generationRef.current) buildPlayer(entry, generation);
        })
        .catch((error) => {
          console.error("YouTube IFrame API failed:", error);
          if (generation === generationRef.current) {
            failLoad(entry.label, !pendingPlayRef.current);
          }
        });
    },
    [playlists, retirePlayer, buildPlayer, failLoad],
  );
  startRef.current = startPlayback;

  // Warm up in the background once the browser is idle: download the API
  // and build a paused player. By the time the visitor presses play, the
  // slow network work is done and playback starts inside their click,
  // which also keeps mobile browsers from blocking it as "autoplay".
  useEffect(() => {
    const w = window as any;
    const run = () => startRef.current(activePlaylistIdRef.current, { autoplay: false });
    const handle = w.requestIdleCallback
      ? w.requestIdleCallback(run, { timeout: 4000 })
      : setTimeout(run, 2000);

    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(handle);
      else clearTimeout(handle);
      retirePlayer();
    };
  }, [retirePlayer]);

  const playPause = () => {
    const player = playerRef.current;

    // Warm-up failed or never ran: build now and play when ready.
    if (!player) {
      startPlayback(activePlaylistIdRef.current, { autoplay: true });
      return;
    }

    // Still warming up: remember the click, onReady will start playback.
    if (!ready) {
      pendingPlayRef.current = true;
      setIsBuffering(true);
      return;
    }

    if (player.getPlayerState() === window.YT?.PlayerState?.PLAYING) {
      player.pauseVideo();
      return;
    }

    setIsBuffering(true);
    if (!hasStartedRef.current) {
      // First play: pick a random track, directly inside the click.
      if (!jumpToRandom(player, false)) player.playVideo();
    } else {
      player.playVideo();
    }
  };

  const selectPlaylist = (id: string) => {
    if (id === activePlaylistIdRef.current && playerRef.current) return;
    activePlaylistIdRef.current = id;
    setActivePlaylistId(id);
    startPlayback(id, { autoplay: true });
  };

  const next = () => {
    const player = playerRef.current;
    if (!player || !ready) return;
    jumpToRandom(player, true);
  };

  const prev = () => {
    const player = playerRef.current;
    if (!player || !ready) return;
    const last = historyRef.current.pop();
    if (last === undefined) return;
    setIsBuffering(true);
    player.playVideoAt(last);
  };

  return {
    containerRef,
    ready,
    isPlaying,
    isBuffering,
    currentTrack,
    getProgress,
    playlists,
    activePlaylistId,
    playPause,
    selectPlaylist,
    next,
    prev,
  };
}