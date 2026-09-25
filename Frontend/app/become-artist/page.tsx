'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Loader2, Music, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { artistService } from '@/services/artist.service';
import { useAppDispatch } from '@/lib/hooks';
import { setUser } from '@/lib/slices/authSlice';
import { persistAuthSession } from '@/lib/session';

export default function BecomeArtistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [stageName, setStageName] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await artistService.requestArtistRole({ stageName, bio });

      persistAuthSession(response.token, response.user);
      dispatch(setUser(response.user));
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(message || (err instanceof Error ? err.message : 'Failed to submit request'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-white">
      <Navbar title="Become an Artist" showSearch={false} />

      <main className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/50 p-8 backdrop-blur-xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20 text-red-500">
              <Crown size={32} />
            </div>
            <h1 className="text-2xl font-bold">Claim Your Artist Profile</h1>
            <p className="mt-2 text-sm text-neutral-400">
              Upload your own music, access analytics, and reach millions of listeners worldwide.
            </p>
          </div>

          {success ? (
            <div className="flex flex-col items-center space-y-4 text-center">
              <CheckCircle size={48} className="text-green-500" />
              <h2 className="text-xl font-semibold">You&apos;re an Artist!</h2>
              <p className="text-sm text-neutral-400">
                Your artist profile is active. You can upload music and manage your content now.
              </p>
              <button
                onClick={() => router.push('/upload')}
                className="mt-4 w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Upload Music
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full rounded-full bg-white/10 py-3 text-sm font-semibold transition hover:bg-white/20"
              >
                Return to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                  Artist / Stage Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  placeholder="e.g. Eminem, The Weeknd"
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-neutral-400">
                  Short Bio
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little bit about your music career..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    <Music size={18} />
                    Become an Artist
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
