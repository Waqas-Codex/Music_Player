"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PlaylistCreateForm } from "@/components/songs/PlaylistCreateForm";
import { Button } from "@/components/ui/Button";
import { playlistService, Playlist } from "@/services/playlist.service";

const formatPlaylistDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));

export default function PlaylistsPage() {
  const searchParams = useSearchParams();
  const queryValue = searchParams?.get("q") ?? "";
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await playlistService.getAllPlaylists();
        setPlaylists(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setError(message || "Failed to load playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [refreshKey]);

  const handleCreateSuccess = () => {
    setRefreshKey((prev) => prev + 1);
    setShowCreateModal(false);
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    try {
      await playlistService.deletePlaylist(playlistId);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message || "Failed to delete playlist");
    }
  };

  const closeModal = () => {
    setShowCreateModal(false);
  };

  const filteredPlaylists = queryValue
    ? playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(queryValue.toLowerCase())
      )
    : playlists;

  const addPlaylistCard = (
    <div
      onClick={() => setShowCreateModal(true)}
      className="group cursor-pointer rounded-3xl border border-dashed border-zinc-700 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/40 p-6 text-left transition hover:border-emerald-500/60 hover:bg-zinc-800"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">
            New playlist
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white">Add playlist</h3>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-3xl font-bold text-black transition group-hover:scale-105">
          +
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-zinc-400">
        Open the create playlist modal and add a name plus an optional cover image.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#121212] p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
              Library
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Playlists
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Your curated mixes, saved favorites, and personal listens.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="max-w-max bg-emerald-500 text-black hover:bg-emerald-400"
          >
            New playlist
          </Button>
        </div>

        <div className="w-full">
          <div className="rounded-3xl border border-white/10 bg-[#181818] p-6 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.9)]">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your playlists</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Jump into a saved collection or create a fresh one.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded border border-red-500 bg-red-950 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-zinc-400">
                Loading playlists...
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {addPlaylistCard}
                {filteredPlaylists.length === 0 ? (
                  <div className="rounded-3xl border border-zinc-700 bg-zinc-800/80 p-8 text-center text-zinc-400 md:col-span-2 xl:col-span-2">
                    No playlists match your search.
                  </div>
                ) : (
                  filteredPlaylists.map((playlist) => (
                    <Link
                      key={playlist.id}
                      href={`/playlists/${playlist.id}`}
                      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1d1d1d] to-[#101010] p-4 transition hover:border-emerald-500/40 hover:bg-[#1d1d1d] hover:shadow-[0_18px_40px_-18px_rgba(29,185,84,0.5)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-800 shadow-lg shadow-black/30">
                          {playlist.coverImage ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/${playlist.coverImage}`}
                              alt={`${playlist.name} cover`}
                              width={84}
                              height={84}
                              className="h-[84px] w-[84px] object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-[84px] w-[84px] items-center justify-center bg-gradient-to-br from-emerald-500/20 via-zinc-800 to-violet-500/20 text-zinc-200">
                              <svg
                                className="h-10 w-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-semibold text-white">
                            {playlist.name}
                          </h3>
                          <p className="mt-2 text-sm text-zinc-400">
                            {playlist.songs.length} song{playlist.songs.length === 1 ? "" : "s"}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {formatPlaylistDate(playlist.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                          Preview
                        </span>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleDeletePlaylist(playlist.id);
                          }}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200 transition hover:bg-red-500/20 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/20 p-6 shadow-2xl shadow-black/40">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Create new playlist</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Add a name and optional cover image in one quick step.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full bg-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700"
              >
                Close
              </button>
            </div>
            <PlaylistCreateForm key={refreshKey} onSuccess={handleCreateSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}
