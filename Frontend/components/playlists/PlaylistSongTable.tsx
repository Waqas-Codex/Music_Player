'use client';

import Image from 'next/image';
import { Play, Trash2 } from 'lucide-react';
import { Song } from '@/services/song.service';
import { getMediaUrl } from '@/lib/mediaUrl';

interface PlaylistSongTableProps {
  songs: Song[];
  activeSong: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlaySong: (index: number) => void;
  onRemoveSong: (song: Song, index: number) => void | Promise<void>;
}

function formatDuration(seconds?: number): string {
  if (!seconds || Number.isNaN(seconds)) return '0:00';

  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${m}:${s}`;
}

export function PlaylistSongTable({
  songs,
  activeSong,
  isPlaying,
  currentTime,
  duration,
  onPlaySong,
  onRemoveSong,
}: PlaylistSongTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/90 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="grid grid-cols-[32px_48px_1fr_auto_96px] items-center gap-3 border-b border-white/10 px-5 py-3 md:grid-cols-[32px_48px_1fr_1fr_auto_120px]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          #
        </span>

        <span />

        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Title
        </span>

        <span className="hidden text-[10px] font-bold uppercase tracking-widest text-slate-600 md:block">
          Album
        </span>

        <span className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Delete
        </span>

        <span className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-600">
          Time
        </span>
      </div>

      {songs.length === 0 ? (
        <div className="px-5 py-12 text-sm text-slate-500">
          No songs in this playlist yet.
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {songs.map((song, index) => {
            const isActive = activeSong === index;
            const coverImageUrl = getMediaUrl(song.coverImage);

            const songDuration = Number(song.duration) || 0;
            const activeDuration = Number(duration) || songDuration || 0;

            const progressPercent =
              isActive && activeDuration > 0
                ? Math.max(
                    0,
                    Math.min((Number(currentTime) / activeDuration) * 100, 100)
                  )
                : 0;

            return (
              <div
                key={song._id ? `${song._id}-${index}` : song.slug ? `${song.slug}-${index}` : `song-${index}`}
                onClick={() => onPlaySong(index)}
                className={`group relative cursor-pointer overflow-hidden transition ${
                  isActive
                    ? 'bg-green-400/[0.08]'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-green-400 shadow-lg shadow-green-400/30" />
                )}

                <div className="grid grid-cols-[32px_48px_1fr_auto_96px] items-center gap-3 px-5 py-3 md:grid-cols-[32px_48px_1fr_1fr_auto_120px]">
                  <div className="flex w-8 items-center justify-center text-sm tabular-nums">
                    {isActive ? (
                      isPlaying ? (
                        <span className="inline-flex h-4 items-end gap-[3px]">
                          <span className="h-2 w-[3px] animate-pulse rounded-full bg-green-400" />
                          <span className="h-4 w-[3px] animate-pulse rounded-full bg-green-400" />
                          <span className="h-3 w-[3px] animate-pulse rounded-full bg-green-400" />
                        </span>
                      ) : (
                        <Play
                          size={15}
                          fill="currentColor"
                          className="text-green-400"
                        />
                      )
                    ) : (
                      <>
                        <span className="text-xs text-slate-600 group-hover:hidden">
                          {index + 1}
                        </span>

                        <Play
                          size={14}
                          fill="currentColor"
                          className="hidden text-white group-hover:block"
                        />
                      </>
                    )}
                  </div>

                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-800">
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
                      <div className="flex h-full w-full items-center justify-center text-base text-slate-600">
                        ♪
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-semibold leading-tight ${
                        isActive ? 'text-green-400' : 'text-white'
                      }`}
                    >
                      {song.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {song.artist}
                    </p>
                  </div>

                  <p className="hidden max-w-[220px] truncate text-xs text-slate-500 md:block">
                    {song.album || '—'}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSong(song, index);
                    }}
                    className="mx-auto rounded-full p-2 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Remove from playlist"
                  >
                    <Trash2 size={17} />
                  </button>

                  <span
                    className={`text-right text-xs tabular-nums ${
                      isActive ? 'text-green-300' : 'text-slate-500'
                    }`}
                  >
                    {isActive
                      ? `${formatDuration(currentTime)} / ${formatDuration(
                          activeDuration
                        )}`
                      : formatDuration(songDuration)}
                  </span>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                      className="relative h-full rounded-r-full bg-gradient-to-r from-green-600 via-green-400 to-emerald-300 shadow-[0_0_14px_rgba(74,222,128,0.8)] transition-[width] duration-300 ease-linear"
                      style={{ width: `${progressPercent}%` }}
                    >
                      <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}