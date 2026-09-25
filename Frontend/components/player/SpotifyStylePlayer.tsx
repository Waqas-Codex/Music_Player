"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export interface SpotifyStylePlayerProps {
  src: string;
  title: string;
  artist: string;
  posterUrl?: string | null;
  /** Used until `loadedmetadata` provides duration */
  durationHintSeconds?: number;
  autoPlay?: boolean;
  songId?: string;
  onPlay?: (songId: string) => void;
}

export function SpotifyStylePlayer({
  src,
  title,
  artist,
  posterUrl,
  durationHintSeconds = 0,
  autoPlay = false,
  songId,
  onPlay,
}: SpotifyStylePlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const scrubbingRef = useRef(false);
  const playRecordedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationHintSeconds);
  const [volume, setVolume] = useState(0.9);
  const [muted, setMuted] = useState(false);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  useEffect(() => {
    setDuration(durationHintSeconds);
  }, [durationHintSeconds]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const handlePlay = () => {
      setPlaying(true);
      // Record play only once per song
      if (songId && onPlay && !playRecordedRef.current) {
        playRecordedRef.current = true;
        onPlay(songId);
      }
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    setPlaying(false);
    playRecordedRef.current = false; // Reset play recording flag for new song
    if (autoPlay) {
      audio.play().catch(() => {
        /* autoplay policy */
      });
    }
  }, [src, autoPlay]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      e.preventDefault();
      const a = audioRef.current;
      if (!a) return;
      if (a.paused) void a.play();
      else a.pause();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const effectiveDuration = duration > 0 ? duration : durationHintSeconds || 1;
  const progress = Math.min(100, Math.max(0, (currentTime / effectiveDuration) * 100));

  const seekToRatio = useCallback(
    (ratio: number) => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(effectiveDuration)) return;
      const next = Math.min(effectiveDuration, Math.max(0, ratio * effectiveDuration));
      audio.currentTime = next;
      setCurrentTime(next);
    },
    [effectiveDuration]
  );

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const el = barRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      seekToRatio(Math.min(1, Math.max(0, ratio)));
    },
    [seekToRatio]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!scrubbingRef.current) return;
      seekFromClientX(e.clientX);
    };
    const onUp = () => {
      scrubbingRef.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [seekFromClientX]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  };

  const cycleRepeat = () => {
    setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"));
  };

  return (
    <div
      className="rounded-xl bg-[#181818] p-4 text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06] sm:p-6"
      role="region"
      aria-label="Playback"
    >
      <audio ref={audioRef} preload="metadata">
        <source src={src} type="audio/mpeg" />
      </audio>

      <div className="mb-4 flex items-center gap-3 sm:hidden">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-[#282828]">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${title} artwork`}
              fill
              className="object-cover"
              unoptimized
              sizes="56px"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="truncate text-xs text-[#b3b3b3]">{artist}</p>
        </div>
      </div>

      <div
        ref={barRef}
        className="group relative mb-2 h-3 cursor-pointer"
        onMouseDown={(e) => {
          e.preventDefault();
          scrubbingRef.current = true;
          seekFromClientX(e.clientX);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const el = barRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            seekFromClientX(rect.left + rect.width / 2);
          }
        }}
        role="slider"
        tabIndex={0}
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(effectiveDuration)}
        aria-label="Seek"
      >
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#4d4d4d] group-hover:h-1.5 group-hover:bg-[#5a5a5a] transition-all" />
        <div
          className="pointer-events-none absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white group-hover:h-1.5 transition-all"
          style={{ width: `${progress}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-md transition-opacity group-hover:opacity-100"
          style={{ left: `${progress}%` }}
        />
      </div>

      <div className="mb-5 flex justify-between text-[11px] font-medium tabular-nums text-[#b3b3b3]">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(effectiveDuration)}</span>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="hidden min-w-0 flex-[0.25] items-center gap-3 sm:flex">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-[#282828] shadow-lg">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${title} artwork`}
                fill
                className="object-cover"
                unoptimized
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[#535353]">
                <Play className="h-6 w-6" fill="currentColor" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold hover:underline">{title}</p>
            <p className="truncate text-xs text-[#b3b3b3] hover:text-white hover:underline">{artist}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setShuffleOn((v) => !v)}
              className={`rounded-full p-2 transition ${shuffleOn ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"
                }`}
              aria-pressed={shuffleOn}
              aria-label="Shuffle"
            >
              <Shuffle className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              disabled
              className="rounded-full p-2 text-[#535353]"
              aria-label="Previous track"
            >
              <SkipBack className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-white shadow-lg shadow-black/30 transition hover:scale-[1.06] hover:bg-[#1fdf64] active:scale-100 sm:h-14 sm:w-14"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="h-6 w-6 fill-white sm:h-7 sm:w-7" />
              ) : (
                <Play className="h-6 w-6 translate-x-0.5 fill-white sm:h-7 sm:w-7" />
              )}
            </button>
            <button
              type="button"
              disabled
              className="rounded-full p-2 text-[#535353]"
              aria-label="Next track"
            >
              <SkipForward className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
            </button>
            <button
              type="button"
              onClick={cycleRepeat}
              className={`rounded-full p-2 transition ${repeatMode !== "off" ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"
                }`}
              aria-label={`Repeat: ${repeatMode}`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              ) : (
                <Repeat className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-[0.25] items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="rounded-full p-2 text-[#b3b3b3] hover:text-white"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => {
              setMuted(false);
              setVolume(Number(e.target.value));
            }}
            className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-[#4d4d4d] accent-[#1ed760] sm:w-28 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}
