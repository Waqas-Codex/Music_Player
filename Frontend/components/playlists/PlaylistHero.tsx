'use client';

import Image from 'next/image';
import { Music, Pause, Play, Shuffle, ListMusic } from 'lucide-react';
import { Playlist } from '@/services/playlist.service';
import { getMediaUrl } from '@/lib/mediaUrl';

interface PlaylistHeroProps {
  playlist: Playlist;
  isPlaying: boolean;
  activeSong: number | null;
  shuffleMode: boolean;
  onPlay: () => void;
  onShuffle: () => void;
}

export function PlaylistHero({
  playlist,
  isPlaying,
  activeSong,
  shuffleMode,
  onPlay,
  onShuffle,
}: PlaylistHeroProps) {
  const fallbackCover = playlist.songs?.[0]?.coverImage || '';
  const coverImageUrl = getMediaUrl(playlist.coverImage || fallbackCover);
  const hasCoverImage = Boolean(coverImageUrl);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-[0_24px_64px_-8px_rgba(0,0,0,0.85)]">

      {/* Blurred background image — color wash only */}
      {hasCoverImage ? (
        <div className="absolute inset-0">
          <Image
            src={coverImageUrl}
            alt={playlist.name}
            fill
            className="object-cover scale-110 blur-3xl opacity-20"
            sizes="100vw"
            priority
            unoptimized
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-slate-950 to-emerald-950/40" />
      )}

      {/* Hard left anchor: keeps text fully legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/80 to-slate-950/40" />
      {/* Bottom fade into page */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />

      {/* Ambient color orbs — purely decorative, no blur on UI elements */}
      <div className="pointer-events-none absolute -top-24 right-12 h-72 w-72 rounded-full bg-green-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-80 w-80 rounded-full bg-purple-600/12 blur-[100px]" />

      {/* ── Main content ── */}
      <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end">

          {/* ── Cover art ── */}
          <div className="relative shrink-0 self-start">
            {/* Colour glow behind the art */}
            <div
              className="absolute -inset-2 rounded-2xl"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.18) 0%, rgba(74,222,128,0.10) 60%, transparent 100%)',
                filter: 'blur(16px)',
              }}
            />

            <div
              className="relative h-44 w-44 overflow-hidden rounded-2xl bg-slate-900 sm:h-52 sm:w-52 md:h-60 md:w-60"
              style={{ boxShadow: '0 24px 64px -8px rgba(0,0,0,0.75)' }}
            >
              {hasCoverImage ? (
                <Image
                  src={coverImageUrl}
                  alt={playlist.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                  sizes="240px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-900/70 via-slate-900 to-emerald-900/50">
                  <Music size={64} className="text-white/25" />
                </div>
              )}
            </div>
          </div>

          {/* ── Metadata & controls ── */}
          <div className="min-w-0 flex-1 space-y-6">

            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <ListMusic size={13} className="text-green-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-green-400">
                Playlist
              </span>
            </div>

            {/* Title + subtitle */}
            <div>
              <h2 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {playlist.name}
              </h2>
              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                {playlist.songs.length} song{playlist.songs.length === 1 ? '' : 's'}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px w-16 bg-gradient-to-r from-green-400/40 to-transparent" />

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-3">

              {/* Play / Pause */}
              <button
                type="button"
                onClick={onPlay}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-green-400 px-8 py-3.5 text-sm font-bold text-black transition-all duration-150 hover:bg-green-300 hover:scale-[1.02] active:scale-[0.97]"
                style={{ boxShadow: '0 0 0 0 rgba(74,222,128,0), 0 4px 20px rgba(74,222,128,0.25)' }}
              >
                {/* Shimmer sweep */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[20deg] bg-white/25 transition-transform duration-[400ms] group-hover:translate-x-full" />
                {isPlaying && activeSong !== null ? (
                  <>
                    <Pause size={18} fill="currentColor" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                    Play
                  </>
                )}
              </button>

              {/* Shuffle */}
              <button
                type="button"
                onClick={onShuffle}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold transition-all duration-150 active:scale-[0.97] ${
                  shuffleMode
                    ? 'bg-slate-100 text-slate-950'
                    : 'border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                <Shuffle size={16} />
                {shuffleMode ? 'Shuffle On' : 'Shuffle'}
              </button>

              {/* Track count — plain text badge, no glass */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-3.5">
                <ListMusic size={13} className="text-slate-600" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {playlist.songs.length} Tracks
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}