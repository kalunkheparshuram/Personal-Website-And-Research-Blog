import { useCallback, useEffect, useRef, useState } from "react";
import type { MusicPlaylist } from "../data/content";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadYouTubeIframeApi(): Promise<void> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("Failed to load YouTube IFrame API"));
    };
    document.head.appendChild(script);
  });

  return apiPromise;
}

const MAX_HISTORY = 50;
const MAX_ERROR_STREAK = 5;
// If a playlist hasn't started playing within this long, treat it as failed
// instead of leaving the spinner running forever.
const LOAD_TIMEOUT_MS = 15000;

export function useYouTubePlaylistPlayer(playlists: MusicPlaylist[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const historyRef = useRef<number[]>([]);
  const errorStreakRef = useRef(0);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bumped whenever a player is created or retired. Every player's event
  // handlers remember the number they were created with and ignore events
  // once it no longer matches, so a destroyed player can never affect state.
  const generationRef = useRef(0);

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

  /** Destroys the current player (if any) and invalidates all of its events. */
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

  /** Playlist couldn't load: stop everything and say so, rather than play something else. */
  const failLoad = useCallback(
    (label: string) => {
      retirePlayer();
      setReady(false);
      setIsPlaying(false);
      setIsBuffering(false);
      setCurrentTrack({ title: `${label} unavailable`, author: "" });
    },
    [retirePlayer],
  );

  /** Jumps to a random track in this player's own playlist. */
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

  /** Creates a brand-new player bound to exactly one playlist. */
  const buildPlayer = useCallback(
    (entry: MusicPlaylist, generation: number) => {
      const host = containerRef.current;
      if (!host || !window.YT?.Player) {
        failLoad(entry.label);
        return;
      }

      const stale = () => generation !== generationRef.current;

      clearWatchdog();
      watchdogRef.current = setTimeout(() => {
        if (!stale()) failLoad(entry.label);
      }, LOAD_TIMEOUT_MS);

      // YT.Player replaces the element it's given with an iframe, so give it
      // a throwaway child instead of the React-owned container itself.
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
          },
          events: {
            onReady: (e: any) => {
              if (stale()) return;
              setReady(true);
              if (!jumpToRandom(e.target, false)) e.target.playVideo();
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
                  // Keep the shuffle going instead of walking the list in order.
                  setIsPlaying(false);
                  if (!jumpToRandom(e.target, true)) setIsBuffering(false);
                  break;
              }
            },

            onError: (e: any) => {
              if (stale()) return;
              console.error("YouTube player error:", e.data, "playlist:", entry.label);

              // 100/101/150 = this one video is missing or can't be embedded.
              // Skip it — but only if the playlist itself loaded, and give up
              // after a few in a row so a broken playlist can't loop forever.
              const list = e.target.getPlaylist?.();
              const playlistLoaded = Array.isArray(list) && list.length > 0;
              const skippable = [100, 101, 150].includes(e.data);

              if (skippable && playlistLoaded && errorStreakRef.current < MAX_ERROR_STREAK) {
                errorStreakRef.current += 1;
                if (jumpToRandom(e.target, false)) return;
              }

              failLoad(entry.label);
            },
          },
        });
      } catch (error) {
        console.error("Could not create YouTube player:", error);
        failLoad(entry.label);
      }
    },
    [clearWatchdog, failLoad, jumpToRandom],
  );

  /** Starts (or restarts) playback of one playlist from scratch. */
  const startPlayback = useCallback(
    (playlistKey: string) => {
      const entry = playlists.find((p) => p.id === playlistKey);
      if (!entry) return;

      retirePlayer();
      const generation = ++generationRef.current;
      historyRef.current = [];
      errorStreakRef.current = 0;

      setReady(false);
      setIsPlaying(false);
      setIsBuffering(true);
      setCurrentTrack(null);

      // If the API is already loaded, build synchronously so the player is
      // created inside the same click that requested it (browsers are
      // strictest about that for autoplay).
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
          if (generation === generationRef.current) failLoad(entry.label);
        });
    },
    [playlists, retirePlayer, buildPlayer, failLoad],
  );

  useEffect(() => {
    return () => {
      retirePlayer();
    };
  }, [retirePlayer]);

  const playPause = () => {
    const player = playerRef.current;

    // Nothing built yet (first press) or the last load failed: (re)start
    // whichever playlist is currently selected.
    if (!player) {
      startPlayback(activePlaylistIdRef.current);
      return;
    }
    if (!ready) return;

    if (player.getPlayerState() === window.YT?.PlayerState?.PLAYING) {
      player.pauseVideo();
    } else {
      setIsBuffering(true);
      player.playVideo();
    }
  };

  const selectPlaylist = (id: string) => {
    // Already loaded or loading this one — nothing to do. (If it previously
    // failed there's no player, so picking it again retries.)
    if (id === activePlaylistIdRef.current && playerRef.current) return;

    activePlaylistIdRef.current = id;
    setActivePlaylistId(id);
    startPlayback(id);
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
    if (last === undefined) return; // nothing played before this yet
    setIsBuffering(true);
    player.playVideoAt(last);
  };

  return {
    containerRef,
    ready,
    isPlaying,
    isBuffering,
    currentTrack,
    playlists,
    activePlaylistId,
    playPause,
    selectPlaylist,
    next,
    prev,
  };
}