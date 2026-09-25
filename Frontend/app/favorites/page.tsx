'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft, Music } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import { SongCard } from '@/components/songs/SongCard';
import { Song } from '@/services/song.service';
import { favoriteService } from '@/services/favorite.service';

export default function FavoritesPage() {
  const { user, isAuthenticated, loading } = useAppSelector(state => state.auth);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const loadFavorites = async () => {
      try {
        setLoadingFavorites(true);
        setError(null);
        const data = await favoriteService.getFavorites(100);
        setFavorites(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || 'Unable to load favorites.');
      } finally {
        setLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, user]);

  const handleRemoveFavorite = async (song: Song) => {
    try {
      await favoriteService.removeFavorite(song._id);
      setFavorites(prev => prev.filter(s => s._id !== song._id));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <Heart size={48} className="mx-auto mb-4 text-red-500" />
            <h1 className="text-3xl font-bold mb-2">Please log in</h1>
            <p className="text-slate-400 mb-6">Sign in to view and manage your favorite songs.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart size={32} className="text-red-500" />
                <h1 className="text-4xl font-bold">Your Favorites</h1>
              </div>
              <p className="text-slate-400">
                {favorites.length} {favorites.length === 1 ? 'song' : 'songs'} saved
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/10">
          {loadingFavorites ? (
            <div className="text-center text-slate-300 py-12">Loading favorites…</div>
          ) : error ? (
            <div className="text-center text-red-300 py-12">{error}</div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <Music size={48} className="mx-auto mb-4 text-slate-500" />
              <p className="text-slate-400 mb-6">No favorites yet. Start adding songs you love!</p>
              <Link
                href="/"
                className="inline-block px-6 py-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors"
              >
                Explore Music
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {favorites.map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
                  onDelete={handleRemoveFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
