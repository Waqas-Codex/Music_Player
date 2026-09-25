'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Music2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Artist, artistService } from '@/services/artist.service';
import { songService, Song } from '@/services/song.service';
import { favoriteService } from '@/services/favorite.service';
import { SongSlider } from '@/components/songs';
import { getMediaUrl } from '@/lib/mediaUrl';

export default function ArtistDetailPage() {
  const params = useParams();
  const artistId = params?.slug as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoritedSongs, setFavoritedSongs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (!artistId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch artist details
        const artistData = await artistService.getArtistById(artistId);
        setArtist(artistData.artist);

        // Fetch all songs (we'll filter by artist on the frontend)
        const allSongs = await songService.getAllSongs();
        const artistSongs = allSongs.filter((song) => song.artist === artistData.artist.name);
        setSongs(artistSongs);

        // Fetch favorites
        const favorites = await favoriteService.getFavorites(50);
        setFavoritedSongs(new Set(favorites.map((s) => s._id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artist');
        console.error('Error fetching artist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistId]);

  const handlePlaySong = (song: Song) => {
    window.dispatchEvent(new CustomEvent('play-song', { detail: song }));
  };

  const handleToggleFavorite = async (song: Song) => {
    try {
      const isFav = favoritedSongs.has(song._id);

      if (isFav) {
        await favoriteService.removeFavorite(song._id);
        setFavoritedSongs((p) => {
          const n = new Set(p);
          n.delete(song._id);
          return n;
        });
      } else {
        await favoriteService.addFavorite(song._id);
        setFavoritedSongs((p) => {
          const n = new Set(p);
          n.add(song._id);
          return n;
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isFavoritedCheck = (id: string) => favoritedSongs.has(id);
  const avatarSrc = artist?.avatarUrl ? getMediaUrl(artist.avatarUrl) : artist?.avatar ? getMediaUrl(artist.avatar) : '';
  const initials = artist?.name
    ? artist.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AR';

  if (loading) {
    return (
      <main className="min-h-screen text-white px-6 py-6 sm:py-10">
        <section className="mx-auto flex min-h-[24rem] max-w-7xl items-center justify-center text-sm text-zinc-400">
          Loading…
        </section>
      </main>
    );
  }

  if (error || !artist) {
    return (
      <main className="min-h-screen text-white px-6 py-6 sm:py-10">
        <section className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <p className="text-red-400">{error || 'Artist not found'}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white px-6 py-6 sm:py-10">
      <section className="max-w-7xl mx-auto">
        {/* Header */}
        <Link href="/" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Artist Hero Section */}
        <div className="relative mb-12 w-full overflow-hidden rounded-[2rem] border border-[#1e1e1e] bg-[#0f0f0f] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.35)]">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#22c55e]/10 blur-[90px]" />
          <div className="pointer-events-none absolute left-[55%] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#4ade80]/8 blur-[90px]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_45%)]" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                <Music2 className="h-3.5 w-3.5 text-[#22c55e]" />
                Artist
              </div>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {artist.name}
              </h1>

              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-gray-500">
                Explore all songs from {artist.name}. Listen to their amazing tracks and discover what makes their music special.
              </p>

              <div className="mt-6">
                <p className="text-sm text-gray-400">
                  Total Songs: <span className="font-semibold text-white">{songs.length}</span>
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm">
              <div className="relative rounded-[1.75rem] border border-white/10 bg-white/5 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-[#22c55e]/20 via-transparent to-[#3b82f6]/10" />
                <div className="relative overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#111111] p-3">
                  <div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-[#181818] flex items-center justify-center">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={artist.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-500/20 to-cyan-500/20">
                        <span className="text-4xl font-semibold text-white">{initials}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Songs Section */}
        {songs.length > 0 ? (
          <SongSlider
            title={`${artist.name}'s Tracks`}
            songs={songs}
            onPlay={handlePlaySong}
            onFavorite={handleToggleFavorite}
            isFavorited={isFavoritedCheck}
          />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 text-center text-slate-400">
            No songs available from this artist yet
          </div>
        )}
      </section>
    </main>
  );
}
