'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  Heart,
  Loader2,
  Pause,
  Play,
  Plus,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { songService, Song } from '@/services/song.service';
import { playlistService, Playlist } from '@/services/playlist.service';
import { getCoverImageUrl } from '@/lib/songUtils';
import { getMediaUrl } from '@/lib/mediaUrl';

interface SongSliderProps {
  title: string;
  songs: Song[];
  onPlay?: (song: Song) => void;
  onFavorite?: (song: Song) => void;
  isFavorited?: (songId: string) => boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function SongSlider({
  title,
  songs,
  onPlay,
  onFavorite,
  isFavorited,
  loading = false,
  icon,
}: SongSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScroll({
      left: scrollLeft > 0,
      right: scrollLeft + clientWidth < scrollWidth - 5,
    });
  };

  useEffect(() => {
    checkScroll();

    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [songs]);

  const scroll = (direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({
      left: direction === 'left' ? -400 : 400,
      behavior: 'smooth',
    });
  };

  const renderEmpty = () => (
    <div className="mb-10 w-full overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-lg">{icon}</div>}
          <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-56 w-48 shrink-0 animate-pulse rounded-xl bg-slate-800/70"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 text-center text-slate-400">
          No songs available
        </div>
      )}
    </div>
  );

  if (loading || !songs?.length) return renderEmpty();

  return (
    <div className="mb-10 w-full overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-lg">{icon}</div>}
          <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
        </div>
      </div>

      <div className="group relative w-full overflow-hidden">
        {canScroll.left && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/80 p-2 text-white opacity-0 transition-all hover:bg-slate-800 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {songs.map((song, index) => {
            const isFav = isFavorited?.(song._id) ?? false;

            return (
              <SongSliderCard
                key={`${song._id}-${index}`}
                song={song}
                isFavorited={isFav}
                onPlay={onPlay}
                onFavorite={onFavorite}
              />
            );
          })}
        </div>

        {canScroll.right && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/80 p-2 text-white opacity-0 transition-all hover:bg-slate-800 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}

interface SongSliderCardProps {
  song: Song;
  isFavorited: boolean;
  onPlay?: (song: Song) => void;
  onFavorite?: (song: Song) => void;
}

function SongSliderCard({
  song,
  isFavorited,
  onPlay,
  onFavorite,
}: SongSliderCardProps) {
  const coverImageUrl = getCoverImageUrl(song.coverImage);
  const [modalOpen, setModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayback = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    if (!audio.src || !audio.src.includes(`/songs/stream/${song._id}`)) {
      audio.src = songService.getStreamUrl(song._id);
      audio.onended = () => setIsPlaying(false);
    }

    try {
      if (audio.paused) {
        await audio.play();
        onPlay?.(song);
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.warn('Unable to play song:', error);
      setIsPlaying(false);
    }
  };

  return (
    <>
      <div className="group/card w-44 shrink-0 sm:w-48">
        <div className="relative overflow-hidden rounded-md bg-neutral-900 transition-colors duration-300 hover:bg-neutral-800">
          <div className="relative aspect-square w-full overflow-hidden bg-slate-700">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={song.title}
                fill
                className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                unoptimized
                sizes="192px"
                loading='eager'
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-5xl opacity-50">
                ♪
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/20 to-black/0 opacity-0 transition-all duration-300 group-hover/card:opacity-100">
              <button
                type="button"
                onClick={togglePlayback}
                className="rounded-full bg-green-500 p-4 text-white shadow-xl transition-all duration-200 hover:bg-green-600 hover:shadow-green-500/50 active:scale-95"
                aria-label={isPlaying ? 'Pause song' : 'Play song'}
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>
            </div>
          </div>

          <div className="p-3 pt-3">
            <Link href={`/songs/${song.slug}`} className="block min-w-0">
              <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover/card:text-green-300">
                {song.title}
              </h3>

              <p className="mt-1 truncate text-xs text-neutral-400">
                {song.artist}
              </p>
            </Link>

            <div className="mt-3 flex items-center justify-between gap-2">
              {song.plays !== undefined ? (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
                  <Headphones size={12} className="text-emerald-400" />
                  <span>{song.plays}</span>
                </div>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                {onFavorite && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite(song);
                    }}
                    className={`rounded-full p-1.5 transition active:scale-95 ${
                      isFavorited
                        ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                    aria-label={
                      isFavorited ? 'Remove favorite' : 'Add favorite'
                    }
                    title={isFavorited ? 'Remove favorite' : 'Add favorite'}
                  >
                    <Heart
                      size={17}
                      fill={isFavorited ? 'currentColor' : 'none'}
                    />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalOpen(true);
                  }}
                  className="rounded-full bg-green-500 p-1.5 text-black shadow-lg shadow-green-500/20 transition hover:bg-green-400 hover:shadow-green-500/40 active:scale-95"
                  aria-label="Add to playlist"
                  title="Add to playlist"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddToPlaylistModal
        open={modalOpen}
        song={song}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

interface AddToPlaylistModalProps {
  open: boolean;
  song: Song;
  onClose: () => void;
}

function AddToPlaylistModal({ open, song, onClose }: AddToPlaylistModalProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setMessage(null);

        const data = await playlistService.getAllPlaylists();
        setPlaylists(data);
      } catch (err) {
        const text =
          err instanceof Error ? err.message : 'Failed to load playlists.';
        setMessage(text);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const addSongToPlaylist = async (playlistId: string) => {
    try {
      setSavingId(playlistId);
      setMessage(null);

      await playlistService.addSongToPlaylist(playlistId, song._id);

      setMessage('Song added to playlist.');

      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 700);
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Failed to add song.';
      setMessage(text);
    } finally {
      setSavingId(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-300">
              Add to playlist
            </p>

            <h3 className="mt-2 text-xl font-black text-white">
              {song.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Choose a playlist where you want to save this song.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-sm text-slate-400">
              <Loader2 size={18} className="animate-spin text-green-300" />
              Loading playlists...
            </div>
          ) : playlists.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <p className="text-sm font-semibold text-white">
                No playlists found
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Create a playlist first, then add songs to it.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {playlists.map((playlist) => {
                const cover =
                  getMediaUrl(
                    playlist.coverImage || playlist.songs?.[0]?.coverImage
                  ) || '';

                const isSaving = savingId === playlist.id;

                return (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => addSongToPlaylist(playlist.id)}
                    disabled={Boolean(savingId)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition hover:border-green-400/40 hover:bg-green-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={playlist.name}
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

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {playlist.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {playlist.songs?.length || 0} songs
                      </p>
                    </div>

                    {isSaving ? (
                      <Loader2
                        size={18}
                        className="shrink-0 animate-spin text-green-300"
                      />
                    ) : (
                      <Plus size={18} className="shrink-0 text-green-300" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {message && (
            <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-200">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}