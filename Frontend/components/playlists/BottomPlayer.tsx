'use client';

import Image from 'next/image';
import {
  Heart,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Song } from '@/services/song.service';
import { getMediaUrl } from '@/lib/mediaUrl';

interface BottomPlayerProps {
  song: Song;
  isPlaying: boolean;
  isLiked: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleLike: () => void;
}

export function BottomPlayer({
  song,
  isPlaying,
  isLiked,
  currentTime,
  duration,
  volume,
  isMuted,
  onSeek,
  onTogglePlay,
  onPrev,
  onNext,
  onToggleMute,
  onVolumeChange,
  onToggleLike,
}: BottomPlayerProps) {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const coverImageUrl = getMediaUrl(song.coverImage);

  const formatTime = (secs: number) => {
    if (!secs || Number.isNaN(secs)) return '0:00';

    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, '0');

    return `${m}:${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-2xl">
      <div
        className="group absolute left-0 right-0 top-0 h-1.5 cursor-pointer bg-slate-800"
        onClick={onSeek}
      >
        <div
          className="relative h-full bg-gradient-to-r from-green-400 to-emerald-300"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-lg transition group-hover:opacity-100" />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <div className="flex w-56 min-w-0 shrink-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-800 shadow-lg">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={song.title}
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                ♪
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {song.title}
            </p>
            <p className="truncate text-xs text-slate-500">{song.artist}</p>
          </div>

          <button
            type="button"
            onClick={onToggleLike}
            className={`ml-1 shrink-0 rounded-full p-2 transition ${
              isLiked
                ? 'bg-green-500/15 text-green-400'
                : 'text-slate-500 hover:bg-white/10 hover:text-white'
            }`}
            aria-label="Like"
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onPrev}
              className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white active:scale-95"
              aria-label="Previous"
            >
              <SkipBack size={22} fill="currentColor" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-white/10 transition hover:scale-105 active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={22} fill="currentColor" />
              ) : (
                <Play size={22} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={onNext}
              className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white active:scale-95"
              aria-label="Next"
            >
              <SkipForward size={22} fill="currentColor" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden w-40 shrink-0 items-center gap-3 md:flex">
          <button
            type="button"
            onClick={onToggleMute}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Toggle mute"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={20} />
            ) : volume < 0.5 ? (
              <Volume1 size={20} />
            ) : (
              <Volume2 size={20} />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            className="h-1 w-full cursor-pointer accent-green-400"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}