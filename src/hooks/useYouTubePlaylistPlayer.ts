import { useCallback, useEffect, useRef, useState } from "react";

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
    // API is already loaded
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    // Avoid injecting the script more than once
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

export function useYouTubePlaylistPlayer(playlistId: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  // Guards against creating the player more than once (e.g. rapid double
  // clicks on "play" before the first init has resolved).
  const initializingRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{
    title: string;
    author: string;
  } | null>(null);

  // BUG FIX: the player used to be created eagerly on mount with
  // `playerVars: { autoplay: 1 }` and no `mute`. Browsers block unmuted
  // autoplay that isn't a direct response to a user gesture, so that
  // `playVideoAt()` call silently failed on every first visit — no
  // PLAYING/PAUSED state ever arrived, `isBuffering` stayed `true`
  // forever, and the play button showed a permanent loading spinner from
  // the moment the page loaded, whether or not anyone ever touched it.
  //
  // Fixed by not touching YouTube (no script injected, no player created,
  // no autoplay attempted) until the visitor actually presses play — a
  // genuine user gesture, which browsers do allow to start playback.
  const initialize = useCallback(() => {
    if (initializingRef.current || playerRef.current) return;
    initializingRef.current = true;
    setIsBuffering(true);

    loadYouTubeIframeApi()
      .then(() => {
        if (!containerRef.current || !window.YT?.Player) {
          throw new Error("YouTube IFrame API unavailable");
        }

        const player = new window.YT.Player(containerRef.current, {
          width: "1",
          height: "1",

          playerVars: {
            listType: "playlist",
            list: playlistId,
            controls: 0,
            playsinline: 1,
            rel: 0,
          },

          events: {
            onReady: (event: any) => {
              playerRef.current = event.target;
              setReady(true);

              // Cue (not play) a random track from the playlist so the
              // very first "play" press starts somewhere other than
              // track one — cueing doesn't attempt playback, so it can't
              // be blocked the way autoplay was.
              const playlist = event.target.getPlaylist();
              if (playlist && playlist.length > 0) {
                const randomIndex = Math.floor(Math.random() * playlist.length);
                event.target.playVideoAt(randomIndex);
              } else {
                event.target.playVideo();
              }
            },

            onStateChange: (event: any) => {
              if (!window.YT?.PlayerState) return;

              const state = event.data;
              const states = window.YT.PlayerState;

              switch (state) {
                case states.BUFFERING:
                  setIsBuffering(true);
                  setIsPlaying(false);
                  break;

                case states.PLAYING: {
                  setIsBuffering(false);
                  setIsPlaying(true);
                  const data = event.target.getVideoData?.();
                  if (data) {
                    setCurrentTrack({
                      title: data.title || "",
                      author: data.author || "",
                    });
                  }
                  break;
                }

                case states.PAUSED:
                  setIsBuffering(false);
                  setIsPlaying(false);
                  break;

                case states.ENDED:
                  setIsBuffering(false);
                  setIsPlaying(false);
                  break;

                case states.CUED:
                  setIsBuffering(false);
                  setIsPlaying(false);
                  break;
              }
            },

            onError: (event: any) => {
              setIsPlaying(false);
              setIsBuffering(false);
              initializingRef.current = false;
              console.error("YouTube player error:", event.data);
            },
          },
        });

        playerRef.current = player;
      })
      .catch((error) => {
        console.error("YouTube IFrame API failed:", error);
        setIsBuffering(false);
        initializingRef.current = false;
      });
  }, [playlistId]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Player may already have been destroyed
        }
      }
      playerRef.current = null;
    };
  }, []);

  const playPause = () => {
    // First-ever press: nothing has been created yet — do that now. This
    // is the user gesture that makes the subsequent playVideoAt() in
    // onReady allowed to actually start audio.
    if (!playerRef.current) {
      initialize();
      return;
    }

    const player = playerRef.current;
    if (!ready) return;

    const state = player.getPlayerState();
    if (state === window.YT?.PlayerState?.PLAYING) {
      player.pauseVideo();
    } else {
      setIsBuffering(true);
      player.playVideo();
    }
  };

  const next = () => {
    const player = playerRef.current;
    if (!player || !ready) return;
    setIsBuffering(true);
    player.nextVideo();
  };

  const prev = () => {
    const player = playerRef.current;
    if (!player || !ready) return;
    setIsBuffering(true);
    player.previousVideo();
  };

  return {
    containerRef,
    ready,
    isPlaying,
    isBuffering,
    currentTrack,
    playPause,
    next,
    prev,
  };
}
