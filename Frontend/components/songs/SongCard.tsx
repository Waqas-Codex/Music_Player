'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Trash2 } from 'lucide-react';
import { Song } from '@/services/song.service';
import { getCoverImageUrl } from '@/lib/songUtils';

interface SongCardProps {
  song: Song;
  onDelete?: (song: Song) => void;
  isDeleting?: boolean;
}

export function SongCard({ song, onDelete, isDeleting = false }: SongCardProps) {
  const coverImageUrl = getCoverImageUrl(song.coverImage);

  return (
    <div className="w-full group/card">
      <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-slate-800 to-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50">
        <div className="relative w-full aspect-square overflow-hidden bg-slate-700">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={song.title}
              fill
              className="object-cover group-hover/card:scale-110 transition-transform duration-500"
              unoptimized
              sizes="300px"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <div className="text-5xl opacity-50">♪</div>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/0 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="flex gap-4 scale-75 group-hover/card:scale-100 transition-transform duration-300">
              <Link
                href={`/songs/${song.slug}`}
                className="p-4 bg-green-500 rounded-full text-white hover:bg-green-600 active:scale-95 transition-all duration-200 shadow-xl hover:shadow-green-500/50"
                aria-label="Open song"
                title="Open song"
              >
                <Play size={24} fill="currentColor" />
              </Link>

              {onDelete && (
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(song);
                  }}
                  className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all duration-200 shadow-xl hover:shadow-red-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Delete song"
                  title="Delete song"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          </div>
        </div>

        <Link href={`/songs/${song.slug}`}>
          <div className="p-4 bg-slate-900/90 backdrop-blur cursor-pointer hover:bg-slate-900 transition-colors duration-200">
            <h3 className="font-semibold text-white text-sm truncate group-hover/card:text-purple-300 transition-colors">
              {song.title}
            </h3>

            <p className="text-xs text-slate-400 truncate mt-1">
              {song.artist}
            </p>

            {song.plays !== undefined && (
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <span>▶</span> {song.plays} plays
              </p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}