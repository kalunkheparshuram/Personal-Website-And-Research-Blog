import { useEffect, useRef, useState } from "react";

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

  const [ready, setReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setReady(false);
    setIsPlaying(false);
    setIsBuffering(false);

    loadYouTubeIframeApi()
      .then(() => {
        if (cancelled || !containerRef.current || !window.YT?.Player) {
          return;
        }

        const player = new window.YT.Player(containerRef.current, {
          width: "1",
          height: "1",

          playerVars: {
            listType: "playlist",
            list: playlistId,
            autoplay: 1,
            controls: 0,
            playsinline: 1,
            rel: 0,
          },

          events: {
            onReady: (event: any) => {
              if (cancelled) return;

              playerRef.current = event.target;

              setReady(true);
              setIsBuffering(true);
              setIsPlaying(false);

              // Pick a random track from the playlist.
              const playlist = event.target.getPlaylist();

              if (playlist && playlist.length > 0) {
                const randomIndex = Math.floor(Math.random() * playlist.length);

                event.target.playVideoAt(randomIndex);
              }
            },

            onStateChange: (event: any) => {
              if (cancelled || !window.YT?.PlayerState) {
                return;
              }

              const state = event.data;
              const states = window.YT.PlayerState;

              switch (state) {
                case states.BUFFERING:
                  setIsBuffering(true);
                  setIsPlaying(false);
                  break;

                case states.PLAYING:
                  setIsBuffering(false);
                  setIsPlaying(true);
                  break;

                case states.PAUSED:
                  setIsBuffering(false);
                  setIsPlaying(false);
                  break;

                case states.ENDED:
                  setIsBuffering(false);
                  setIsPlaying(false);
                  break;

                case states.CUED:
                  setIsBuffering(true);
                  setIsPlaying(false);
                  break;
              }
            },

            onError: (event: any) => {
              if (cancelled) return;

              setIsPlaying(false);
              setIsBuffering(false);

              console.error("YouTube player error:", event.data);
            },
          },
        });

        playerRef.current = player;
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("YouTube IFrame API failed:", error);
        }
      });

    return () => {
      cancelled = true;

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Player may already have been destroyed
        }
      }

      playerRef.current = null;
    };
  }, [playlistId]);

  const playPause = () => {
    const player = playerRef.current;

    if (!player || !ready) return;

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
    playPause,
    next,
    prev,
  };
}
