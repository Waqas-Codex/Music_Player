"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { ChevronLeft, Clock } from "lucide-react";
import { SpotifyStylePlayer } from "@/components/player/SpotifyStylePlayer";
import { songService, Song } from "@/services/song.service";

interface SongDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function resolveCoverUrl(song: Song | null): string | null {
  if (!song?.coverImage) return null;
  if (song.coverImage.startsWith("http")) return song.coverImage;
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";
  return `${base}/${song.coverImage.replace(/^\//, "")}`;
}

function formatDuration(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function formatFixedDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export default function SongDetailPage({ params }: SongDetailPageProps) {
  const { slug } = use(params);
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioSrc = song ? songService.getStreamUrl(song._id) : "";
  const coverUrl = useMemo(() => resolveCoverUrl(song), [song]);

 useEffect(() => {
  const loadSong = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await songService.getSongBySlug(slug);

      setSong(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setError(
        message ||
          "Unable to load song details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (slug) {
    void loadSong();
  }
}, [slug]);

  return (
    <div className="relative min-h-full overflow-hidden pb-10">
      {/* Spotify-like tall gradient + vignette */}
      <div
        className="pointer-events-none absolute inset-0 -top-6 left-1/2 z-0 h-[min(55vh,520px)] w-[140%] -translate-x-1/2 rounded-[50%] blur-3xl opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 0%, rgba(29, 185, 84, 0.45) 0%, rgba(24, 24, 24, 0.15) 45%, transparent 70%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#121212] via-[#121212]/95 to-[#0a0a0a]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/songs"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#b3b3b3] transition hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/10 backdrop-blur-sm">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </span>
            All songs
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-sm font-medium text-[#b3b3b3]">
            Loading…
          </div>
        ) : error ? (
          <div className="rounded-lg bg-[#e91429]/15 p-6 text-[#ff6b7a] ring-1 ring-[#e91429]/30">
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-2 text-sm opacity-90">{error}</p>
            <Link
              href="/songs"
              className="mt-4 inline-block text-sm font-bold text-white underline underline-offset-4 hover:text-[#1ed760]"
            >
              Back to library
            </Link>
          </div>
        ) : !song ? (
          <p className="py-20 text-center text-[#b3b3b3]">Song not found.</p>
        ) : (
          <>
            <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-10 lg:pb-4">
              <div className="mx-auto w-full max-w-[min(100%,22rem)] shrink-0 shadow-[0_24px_64px_rgba(0,0,0,0.75)] sm:max-w-sm lg:mx-0">
                <div className="relative aspect-square overflow-hidden rounded shadow-2xl ring-1 ring-white/10">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={`${song.title} cover art`}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 384px"
                    />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-[#282828] text-[#535353]">
                      <span className="text-6xl font-black tracking-tighter">♪</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-4 text-center lg:pb-2 lg:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                  {song.album ? "Album" : "Track"}
                </p>
                <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                  {song.title}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-2 text-base font-semibold text-white lg:justify-start">
                  <span className="text-[#1ed760] hover:underline">{song.artist}</span>
                  {song.album ? (
                    <>
                      <span className="text-[#535353]" aria-hidden>
                        ·
                      </span>
                      <span className="text-[#b3b3b3]">{song.album}</span>
                    </>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#b3b3b3] lg:justify-start">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" aria-hidden />
                    {formatDuration(song.duration)}
                  </span>
                  {song.createdAt ? (
                    <span className="text-[#535353]">
                      Added {formatFixedDate(song.createdAt)}
                    </span>
                  ) : null}
                </div>
              </div>
            </header>

            <div className="mt-10 max-w-4xl">
              <SpotifyStylePlayer
                key={song._id}
                src={audioSrc}
                title={song.title}
                artist={song.artist}
                posterUrl={coverUrl}
                durationHintSeconds={song.duration}
                autoPlay
                songId={song._id}
                onPlay={(songId) => {
                  void songService.recordPlay(songId).catch((err) => {
                    console.error("PLAY COUNT FAILED:", err);
                  });
                }}
              />
            </div>

            <section className="mt-12 rounded-lg bg-[#181818] p-6 ring-1 ring-white/[0.06]">
              <h2 className="text-sm font-bold text-white">About the audio</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#b3b3b3]">
                {song.description || "No description provided."}
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
