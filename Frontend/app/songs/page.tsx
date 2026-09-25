'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { songService, Song } from '@/services/song.service';
import { useAppSelector } from '@/lib/hooks';
import { SongCard } from '@/components/songs/SongCard';

export default function SongsPage() {
  const searchParams = useSearchParams();
  const queryValue = searchParams?.get('q') ?? '';

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingSongId, setDeletingSongId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const user = useAppSelector((s) => s.auth.user);

  const loadSongs = useCallback(
    async (query?: string) => {
      try {
        setLoading(true);
        setError(null);

        const data = await songService.getAllSongs(query);
        const currentUserId = user?._id ?? (user as { id?: string } | null)?.id ?? null;

        if (currentUserId) {
          setSongs(data.filter((song) => song.uploadedBy === currentUserId));
        } else {
          setSongs([]);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || 'Unable to load songs.');
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    void loadSongs(queryValue);
  }, [loadSongs, queryValue]);

  const handleDelete = async (song: Song) => {
    const ok =
      typeof window !== 'undefined'
        ? window.confirm(
            `Delete “${song.title}” by ${song.artist}? This cannot be undone.`
          )
        : true;

    if (!ok) return;

    setDeleteError(null);
    setDeletingSongId(song._id);

    try {
      await songService.deleteSong(song._id);
      setSongs((prev) => prev.filter((s) => s._id !== song._id));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setDeleteError(
        message || 'Could not delete song. You may need to sign in.'
      );
    } finally {
      setDeletingSongId(null);
    }
  };

  return (
    <main className="min-h-screen text-white px-6 py-10">
      <section className="relative mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 md:p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />

        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">
              My Songs
            </h1>
            <p className="text-slate-300 text-lg">
              Manage songs uploaded by you
            </p>
          </div>

          {deleteError ? (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
              {deleteError}
            </div>
          ) : null}

          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-lg shadow-black/10 backdrop-blur-xl">
            {loading ? (
              <div className="flex min-h-[16rem] items-center justify-center py-12 text-sm text-zinc-400">
                Loading…
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-300">{error}</div>
            ) : songs.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No songs found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {songs.map((song) => (
                  <SongCard
                    key={song._id}
                    song={song}
                    onDelete={handleDelete}
                    isDeleting={deletingSongId === song._id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}