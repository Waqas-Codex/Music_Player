"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { Playlist, playlistService } from "@/services/playlist.service";
import { Song } from "@/services/song.service";
import { getMediaUrl } from "@/lib/mediaUrl";
import { PlaylistHero } from "@/components/playlists/PlaylistHero";
import { PlaylistSongTable } from "@/components/playlists/PlaylistSongTable";
import { BottomPlayer } from "@/components/playlists/BottomPlayer";

interface PlaylistDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function PlaylistDetailPage({
  params,
}: PlaylistDetailPageProps) {
  const { slug } = use(params);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSong, setActiveSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const activeSongData =
    activeSong !== null && playlist ? playlist.songs[activeSong] : null;

  const getNextIndex = useCallback(
    (currentIndex: number) => {
      if (!playlist) return null;

      if (shuffleMode && playlist.songs.length > 1) {
        let nextIndex = currentIndex;

        while (nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * playlist.songs.length);
        }

        return nextIndex;
      }

      const next = currentIndex + 1;
      return next < playlist.songs.length ? next : null;
    },
    [playlist, shuffleMode]
  );

  const playSong = useCallback(
    (index: number) => {
      const audio = audioRef.current;
      if (!audio || !playlist) return;

      const song = playlist.songs[index];
      if (!song?.fileUrl) return;

      const src = getMediaUrl(song.fileUrl);

      if (activeSong === index) {
        if (audio.paused) {
          audio.play().catch(() => { });
        } else {
          audio.pause();
        }

        return;
      }

      audio.src = src;
      audio.currentTime = 0;
      audio.load();

      setCurrentTime(0);
      setDuration(Number(song.duration) || 0);
      setActiveSong(index);

      audio.play().catch(() => { });
    },
    [activeSong, playlist]
  );

  const playPlaylist = () => {
    if (!playlist || playlist.songs.length === 0) return;

    if (activeSong === null) {
      playSong(0);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => { });
    } else {
      audio.pause();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;

    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);

    setVolume(val);
    setIsMuted(val === 0);

    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextMuted = !isMuted;

    setIsMuted(nextMuted);
    audio.volume = nextMuted ? 0 : volume;
  };

  const skipPrev = () => {
    if (activeSong === null || !playlist) return;

    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const prev = activeSong - 1;
    if (prev >= 0) playSong(prev);
  };

  const skipNext = () => {
    if (activeSong === null || !playlist) return;

    const next = getNextIndex(activeSong);
    if (next !== null) playSong(next);
  };

  const toggleLike = (index: number) => {
    setLikedSongs((prev) => {
      const next = new Set(prev);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  const handleRemoveSong = async (song: Song, index: number) => {
    if (!playlist || !song._id) return;

    try {
      const updatedPlaylist = await playlistService.removeSongFromPlaylist(
        playlist.id,
        song._id
      );

      setPlaylist((prev) =>
        prev ? { ...prev, songs: updatedPlaylist.songs } : prev
      );

      const shouldStopPlayback = activeSong === index;

      setActiveSong((prevActive) => {
        if (prevActive === null) return null;
        if (prevActive < index) return prevActive;
        if (prevActive === index) return null;
        return prevActive - 1;
      });

      setLikedSongs((prev) => {
        const next = new Set<number>();

        prev.forEach((likedIndex) => {
          if (likedIndex < index) {
            next.add(likedIndex);
          } else if (likedIndex > index) {
            next.add(likedIndex - 1);
          }
        });

        return next;
      });

      if (shouldStopPlayback) {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Unable to remove song from playlist.");
    }
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await playlistService.getPlaylist(slug);
        setPlaylist(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Unable to load playlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [slug]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncTime = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const syncDuration = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      if (!playlist || activeSong === null) return;

      const next = getNextIndex(activeSong);

      if (next !== null) {
        playSong(next);
      } else {
        setIsPlaying(false);
        setActiveSong(null);
        setCurrentTime(0);
        setDuration(0);
      }
    };

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [activeSong, getNextIndex, playlist, playSong]);

  return (
    <main className="min-h-screen bg-[#121212] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(29,185,84,0.22),transparent_55%)]" />
      <audio ref={audioRef} preload="metadata" />

      <div className="relative z-10 px-6 pb-4 pt-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Link href="/playlists" className="transition hover:text-white">
              Playlists
            </Link>
            <span>/</span>
            <span className="text-slate-300">
              {loading ? "Loading..." : playlist?.name || "Playlist"}
            </span>
          </div>

          <Link
            href="/playlists"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/20 hover:bg-white/10"
          >
            Back to library
          </Link>
        </div>
      </div>

      <section
        className={`relative z-10 mx-auto max-w-7xl px-6 ${activeSong !== null ? "pb-32" : "pb-8"}`}
      >
        {loading ? (
          <div className="flex min-h-[20rem] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-sm text-zinc-400 backdrop-blur-xl">
            Loading…
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-950/40 p-6 text-red-200">
            {error}
          </div>
        ) : !playlist ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-slate-400 backdrop-blur-xl">
            Playlist not found.
          </div>
        ) : (
          <div className="space-y-6">
            <PlaylistHero
              playlist={playlist}
              isPlaying={isPlaying}
              activeSong={activeSong}
              shuffleMode={shuffleMode}
              onPlay={playPlaylist}
              onShuffle={() => setShuffleMode((prev) => !prev)}
            />

            <PlaylistSongTable
              songs={playlist.songs}
              activeSong={activeSong}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onPlaySong={playSong}
              onRemoveSong={handleRemoveSong}
            />
          </div>
        )}
      </section>

      {activeSong !== null && activeSongData && (
        <BottomPlayer
          song={activeSongData}
          isPlaying={isPlaying}
          isLiked={likedSongs.has(activeSong)}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          onSeek={handleProgressClick}
          onTogglePlay={() => {
            const audio = audioRef.current;
            if (!audio) return;

            if (isPlaying) {
              audio.pause();
            } else {
              audio.play().catch(() => { });
            }
          }}
          onPrev={skipPrev}
          onNext={skipNext}
          onToggleMute={toggleMute}
          onVolumeChange={handleVolumeChange}
          onToggleLike={() => toggleLike(activeSong)}
        />
      )}
    </main>
  );
}