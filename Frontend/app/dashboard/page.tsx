'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Music, ListMusic, Upload, Sparkles, Heart, Flame, Star, UserCircle2 } from 'lucide-react';
import { useAppSelector } from '@/lib/hooks';
import { SongSlider } from '@/components/songs';
import { Song, songService } from '@/services/song.service';
import { favoriteService } from '@/services/favorite.service';

function DashboardPage() {
  const { user, isAuthenticated, loading } = useAppSelector(state => state.auth);
  const [mostPlayed, setMostPlayed] = useState<Song[]>([]);
  const [recent, setRecent] = useState<Song[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [favoritedSongs, setFavoritedSongs] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const loadData = async () => {
      try {
        setLoadingData(true);

        // Load most played songs
        const mostPlayedData = await songService.getMostPlayed(12);
        setMostPlayed(mostPlayedData);

        // Load recent songs
        const recentData = await songService.getRecent(12);
        setRecent(recentData);

        // Load favorites
        const favoritesData = await favoriteService.getFavorites(12);
        setFavorites(favoritesData);
        setFavoritedSongs(new Set(favoritesData.map(s => s._id)));
      } catch (error) {
        console.error('Failed to load music data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  const handlePlaySong = (song: Song) => {
    // Trigger play event - player should listen to this
    window.dispatchEvent(new CustomEvent('play-song', { detail: song }));
  };

  const handleToggleFavorite = async (song: Song) => {
    try {
      const isFav = favoritedSongs.has(song._id);

      if (isFav) {
        await favoriteService.removeFavorite(song._id);
        setFavoritedSongs(prev => {
          const next = new Set(prev);
          next.delete(song._id);
          return next;
        });
        // Remove from favorites list
        setFavorites(prev => prev.filter(s => s._id !== song._id));
      } else {
        await favoriteService.addFavorite(song._id);
        setFavoritedSongs(prev => new Set(prev).add(song._id));
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const isFavoritedCheck = (songId: string) => favoritedSongs.has(songId);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="animate-pulse text-lg">Loading your vibe...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        Please log in
      </div>
    );
  }

  const cards = [
    {
      title: 'Browse Songs',
      desc: 'Discover fresh tracks and trending sounds.',
      href: '/songs',
      icon: Music,
    },
    {
      title: 'My Favorites',
      desc: 'Your collection of loved songs.',
      href: '/favorites',
      icon: Heart,
    },
    {
      title: 'My Playlists',
      desc: 'Manage your favorite collections.',
      href: '/playlists',
      icon: ListMusic,
    },
    {
      title: 'Upload Music',
      desc: 'Share your sound with the world.',
      href: '/upload',
      icon: Upload,
    },
    {
      title: 'My Profile',
      desc: 'View your account details and update your photo.',
      href: '/profile',
      icon: UserCircle2,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Animated background gradients */}
      <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="absolute right-[-10%] top-[20%] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[30%] h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        {/* Hero section */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl mb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
                <Sparkles size={16} />
                Your personal music space
              </div>

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Welcome back,{' '}
                <span className="bg-linear-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  {user?.name}
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-slate-300">
                Explore trending tracks, your favorites, and newly added songs.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Signed in as</p>
              <p className="mt-1 font-medium text-slate-100">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* Quick action cards */}
        <section className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-3xl border border-white/10 bg-white/4 p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:bg-white/8 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/20">
                  <Icon size={26} />
                </div>

                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {card.desc}
                </p>

                <div className="mt-6 text-sm font-medium text-purple-300 transition group-hover:text-cyan-300">
                  Open →
                </div>
              </Link>
            );
          })}
        </section>

        {/* Music sliders section */}
        <div className="space-y-16">
          {/* Favorites slider */}
          {favorites.length > 0 && (
            <SongSlider
              title="Your Favorites"
              songs={favorites}
              onPlay={handlePlaySong}
              onFavorite={handleToggleFavorite}
              isFavorited={isFavoritedCheck}
              loading={loadingData}
              icon={<Heart size={28} className="text-red-500" />}
            />
          )}

          {/* Most played slider */}
          <SongSlider
            title="Most Played"
            songs={mostPlayed}
            onPlay={handlePlaySong}
            onFavorite={handleToggleFavorite}
            isFavorited={isFavoritedCheck}
            loading={loadingData}
            icon={<Flame size={28} className="text-orange-500" />}
          />

          {/* Recently added slider */}
          <SongSlider
            title="Latest Added"
            songs={recent}
            onPlay={handlePlaySong}
            onFavorite={handleToggleFavorite}
            isFavorited={isFavoritedCheck}
            loading={loadingData}
            icon={<Star size={28} className="text-yellow-500" />}
          />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
