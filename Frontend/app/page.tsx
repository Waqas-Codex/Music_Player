'use client';

import Image from 'next/image';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock3, Disc3, Heart, Pause, Play, Sparkles } from 'lucide-react';
import { SongSlider } from '@/components/songs';
import { ArtistsSection } from '@/components/artists';
import { songService } from '@/services/song.service';
import { favoriteService } from '@/services/favorite.service';
import { getCoverImageUrl } from '@/lib/songUtils';
import { Song } from '@/types/Song/service';

function QuickPick({ song, onPlay }: { song: Song; onPlay: (song: Song) => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cover = getCoverImageUrl(song.coverImage);

  const handlePlay = async () => {
    const audio = audioRef.current ?? new Audio(songService.getStreamUrl(song._id));
    audioRef.current = audio;

    try {
      if (audio.paused) {
        await audio.play();
        onPlay(song);
      } else {
        audio.pause();
      }
    } catch (error) {
      console.warn('Unable to play recent song:', error);
    }
  };

  return (
    <button type="button" onClick={handlePlay} className="group flex min-w-0 items-center gap-3 overflow-hidden rounded-md bg-white/[0.08] text-left transition-colors hover:bg-white/[0.16]">
      <div className="relative h-16 w-16 shrink-0 bg-neutral-800">
        {cover ? <Image src={cover} alt="" fill sizes="64px" className="object-cover" unoptimized /> : <div className="flex h-full items-center justify-center text-xl text-neutral-500">♪</div>}
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100"><Play className="h-5 w-5 fill-white text-white" /></span>
      </div>
      <span className="min-w-0 truncate pr-3 text-sm font-bold text-white">{song.title}</span>
    </button>
  );
}

function HeroSection({ song, onPlay }: { song: Song | null; onPlay: (song: Song) => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const cover = song ? getCoverImageUrl(song.coverImage) : '';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    audio.src = songService.getStreamUrl(song._id);
    audio.load();
    setIsPlaying(false);
    setPlaybackError(false);
  }, [song]);

  const togglePlayback = async () => {
    if (!song || !audioRef.current) return;

    try {
      const audio = audioRef.current;
      const streamUrl = songService.getStreamUrl(song._id);

      if (audio.src !== streamUrl) {
        audio.src = streamUrl;
        audio.load();
      }

      if (audio.paused) {
        setPlaybackError(false);
        await audio.play();
        onPlay(song);
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.warn('Unable to play featured song:', error);
      setIsPlaying(false);
      setPlaybackError(true);
    }
  };

  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#193b2b] via-[#14241d] to-[#111111] px-6 py-8 shadow-2xl shadow-black/30 sm:px-10 sm:py-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
      <audio
        ref={audioRef}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setPlaybackError(true);
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-400/15 blur-3xl" />
      <div className="relative z-10 max-w-xl">
        <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-green-300"><Sparkles className="h-4 w-4" /> Fresh from Chuchify</p>
        <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">Discover your next favorite track</h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-neutral-300">Find something new to play, save the songs you love, and make your everyday listening feel better.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={togglePlayback} disabled={!song} className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50">{isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />} {isPlaying ? 'Pause song' : 'Start listening'}</button>
          <button type="button" onClick={() => document.getElementById('music-library')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">Explore library</button>
        </div>
        {playbackError && <p className="mt-3 text-xs text-red-200">This track could not be played. Please check that its audio file is available.</p>}
      </div>

      <div className="relative z-10 mt-8 w-full max-w-xs shrink-0 lg:mt-0">
        <div className="rounded-xl border border-white/10 bg-black/30 p-3 backdrop-blur-sm">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-900">
            {cover ? <Image src={cover} alt={song?.title ?? 'Featured song'} fill sizes="320px" className="object-cover" loading="eager" unoptimized /> : <div className="flex h-full items-center justify-center text-green-400"><Disc3 className="h-16 w-16 animate-[spin_8s_linear_infinite]" /></div>}
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-lg bg-black/60 p-3 backdrop-blur-md">
              <div className="min-w-0"><p className="text-[10px] uppercase tracking-widest text-neutral-400">Featured track</p><p className="truncate text-sm font-bold text-white">{song?.title ?? 'Your next favorite'}</p><p className="truncate text-xs text-neutral-300">{song?.artist ?? 'Chuchify'} </p></div>
              <button type="button" onClick={togglePlayback} className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-black transition hover:bg-green-400" aria-label={isPlaying ? 'Pause featured song' : 'Play featured song'}>{isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const queryValue = (searchParams.get('q') ?? '').trim();
  const [songs, setSongs] = useState<Song[]>([]);
  const [mostPlayed, setMostPlayed] = useState<Song[]>([]);
  const [recent, setRecent] = useState<Song[]>([]);
  const [favoritedSongs, setFavoritedSongs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const playedSongs = useRef<Set<string>>(new Set());
  const greeting = 'Good day';

  useEffect(() => {
    const fetchHome = async () => {
      try {
        setLoading(true);
        setError(null);
        const favoritesPromise = favoriteService.getFavorites(50).catch(() => []);

        if (queryValue) {
          const [results, favorites] = await Promise.all([songService.getAllSongs(queryValue), favoritesPromise]);
          setSongs(results);
          setMostPlayed([]);
          setRecent([]);
          setFavoritedSongs(new Set(favorites.map((song) => song._id)));
          return;
        }

        const [all, most, latest, favorites] = await Promise.all([
          songService.getAllSongs(),
          songService.getMostPlayed(12),
          songService.getRecent(12),
          favoritesPromise,
        ]);
        setSongs(all);
        setMostPlayed(most);
        setRecent(latest);
        setFavoritedSongs(new Set(favorites.map((song) => song._id)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load music');
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, [queryValue]);

  const handlePlaySong = async (song: Song) => {
    window.dispatchEvent(new CustomEvent('play-song', { detail: song }));
    if (playedSongs.current.has(song._id)) return;
    playedSongs.current.add(song._id);
    try {
      await songService.recordPlay(song._id);
    } catch (err) {
      console.warn('Play tracking failed (non-blocking):', err);
    }
  };

  const handleToggleFavorite = async (song: Song) => {
    const isFavorite = favoritedSongs.has(song._id);
    try {
      if (isFavorite) await favoriteService.removeFavorite(song._id);
      else await favoriteService.addFavorite(song._id);
      setFavoritedSongs((current) => {
        const next = new Set(current);
        if (isFavorite) next.delete(song._id);
        else next.add(song._id);
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const quickPicks = Array.from(
    new Map([...recent, ...mostPlayed].map((song) => [song._id, song])).values(),
  ).slice(0, 6);

  return (
    <main className="mx-auto min-h-full w-full max-w-[1500px] px-1 pb-12 pt-2 sm:px-2 sm:pt-5">
      {queryValue ? (
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-white">Search results for {queryValue}</h1>
      ) : (
        <>
          <HeroSection song={recent[0] ?? songs[0] ?? null} onPlay={handlePlaySong} />
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-400"><Sparkles className="h-4 w-4 text-green-400" /> Made for your listening</p>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {greeting}
              </h1>
            </div>
            <button type="button" className="hidden items-center gap-2 text-sm font-semibold text-neutral-400 transition hover:text-white sm:flex"><Clock3 className="h-4 w-4" /> Recently played</button>
          </div>

          {quickPicks.length > 0 && (
            <section className="mb-10" aria-labelledby="quick-picks-heading">
              <h2 id="quick-picks-heading" className="sr-only">Quick picks</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {quickPicks.map((song, index) => <QuickPick key={`${song._id}-${index}`} song={song} onPlay={handlePlaySong} />)}
              </div>
            </section>
          )}
        </>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[...Array(4)].map((_, index) => <div key={index} className="aspect-square animate-pulse rounded-md bg-white/[0.06]" />)}</div>
      ) : error ? (
        <p className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>
      ) : (
        <>
          <div id="music-library">
            {!queryValue && <ArtistsSection title="Your favorite artists" />}
            {!queryValue && <SongSlider title="Made for you" songs={mostPlayed} onPlay={handlePlaySong} onFavorite={handleToggleFavorite} isFavorited={(id) => favoritedSongs.has(id)} icon={<Heart className="h-5 w-5 text-green-400" />} />}
            <SongSlider title={queryValue ? 'Songs' : 'Fresh releases'} songs={queryValue ? songs : recent} onPlay={handlePlaySong} onFavorite={handleToggleFavorite} isFavorited={(id) => favoritedSongs.has(id)} />
            {!queryValue && <SongSlider title="All songs" songs={songs} onPlay={handlePlaySong} onFavorite={handleToggleFavorite} isFavorited={(id) => favoritedSongs.has(id)} />}
          </div>
        </>
      )}
    </main>
  );
}

export default function Home() {
  return <Suspense fallback={<main className="p-8 text-sm text-neutral-400">Loading your music...</main>}><HomeContent /></Suspense>;
}
