'use client';

import Link from 'next/link';
import { Music2, UserRound } from 'lucide-react';
import { Artist } from '@/services/artist.service';
import { getMediaUrl } from '@/lib/mediaUrl';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const avatarSrc = artist.avatarUrl ? getMediaUrl(artist.avatarUrl) : artist.avatar ? getMediaUrl(artist.avatar) : '';
  const initials = artist.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full group/card">
      <Link href={`/artist/${artist._id}`}>
        <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-slate-800 to-slate-900 shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-700/50 hover:border-purple-500/50">
          <div className="relative w-full aspect-square overflow-hidden bg-slate-700">
            {avatarSrc ? (
              <img src={avatarSrc} alt={artist.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-500/30 to-pink-500/30">
                <Music2 size={64} className="opacity-50 text-purple-400" />
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/0 opacity-0 group-hover/card:opacity-100 transition-all duration-300" />
          </div>

          <div className="relative z-10 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/70 text-sm font-semibold text-white">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={artist.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-white transition-colors duration-200 group-hover/card:text-purple-400">
                  {artist.name}
                </h3>
                <p className="truncate text-sm text-gray-400">Artist</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
