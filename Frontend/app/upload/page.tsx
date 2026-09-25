'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Music2, Sparkles, Crown, ShieldAlert } from 'lucide-react';
import { SongUploadForm } from '@/components/songs/SongUploadForm';
import { useAppSelector } from '@/lib/hooks';
import { isArtistUser } from '@/lib/auth';

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [refreshKey, setRefreshKey] = useState(0);

  const canUpload = isAuthenticated && isArtistUser(user);

  const handleUploadSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!canUpload) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 py-10 text-white">
        <section className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
            <ShieldAlert size={32} />
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-red-300">
            Access denied
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Artist access required
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            You need to apply for the artist role before you can upload songs to the platform.
          </p>

          <button
            type="button"
            onClick={() => router.push('/become-artist')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            <Crown size={16} />
            Apply as Artist
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-green-300">
                  <UploadCloud size={15} />
                  Upload Studio
                </div>

                <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                  Upload Content
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                  Upload your songs, add cover art, and publish tracks to your music library.
                </p>
              </div>

              <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-green-400/20 bg-green-400/10 text-green-300 shadow-lg shadow-green-500/10 md:flex">
                <Music2 size={36} />
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 backdrop-blur-xl md:p-6">
              <SongUploadForm key={refreshKey} onSuccess={handleUploadSuccess} />
            </div>

            <aside className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400 text-black shadow-lg shadow-green-500/20">
                <Sparkles size={24} />
              </div>

              <h2 className="text-xl font-bold text-white">
                Upload Tips
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Use clear song titles, proper artist names, and high-quality cover images for the best result.
              </p>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  Audio files should be clean and properly named.
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  Square cover images look best in cards and playlist pages.
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  After upload, your songs will appear in your library.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}