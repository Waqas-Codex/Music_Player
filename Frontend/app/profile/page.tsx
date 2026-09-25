'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { Camera, Mail, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setUser } from '@/lib/slices/authSlice';
import { authService } from '@/services/auth.service';
import { getMediaUrl } from '@/lib/mediaUrl';

function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const avatarSrc = useMemo(() => {
    if (user?.avatarUrl) return getMediaUrl(user.avatarUrl);
    return '';
  }, [user?.avatarUrl]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.updateProfileImage(file);
      dispatch(setUser(response.user));
      setSuccess('Profile photo updated successfully.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not update profile photo.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-lg text-slate-300">Loading your profile...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold">Please sign in to view your profile</h1>
          <Link href="/login" className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-5 py-2.5 text-sm font-medium text-white">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute left-[-8%] top-[-8%] h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="absolute right-[-10%] top-[15%] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[25%] h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="bg-gradient-to-r from-purple-600/30 via-fuchsia-500/20 to-cyan-500/20 p-8 sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-slate-900/80 shadow-lg shadow-black/30 sm:h-32 sm:w-32">
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserRound size={60} className="text-slate-400" />
                    )}
                  </div>

                  <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-slate-950/90 text-white shadow-lg transition hover:scale-105">
                    <Camera size={18} />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-200">
                    <Sparkles size={15} />
                    Personal profile
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{user.name}</h1>
                  <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
                    Keep your musical identity fresh with a profile photo that matches your vibe.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm text-slate-300">
                <p className="font-medium text-slate-100">Account status</p>
                <div className="mt-2 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>{user.role || 'USER'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="text-xl font-semibold">Profile details</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <UserRound size={18} className="text-purple-300" />
                  <div>
                    <p className="text-slate-400">Name</p>
                    <p className="font-medium text-slate-100">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Mail size={18} className="text-cyan-300" />
                  <div>
                    <p className="text-slate-400">Email</p>
                    <p className="font-medium text-slate-100">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 p-6">
              <h2 className="text-xl font-semibold">Quick actions</h2>
              <div className="mt-6 space-y-3">
                <Link href="/dashboard" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 transition hover:border-purple-400/40">
                  <span>Go to dashboard</span>
                  <span className="text-purple-300">→</span>
                </Link>
                <Link href="/songs" className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-400/40">
                  <span>Browse songs</span>
                  <span className="text-cyan-300">→</span>
                </Link>
              </div>

              {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}
              {success ? <p className="mt-4 text-sm text-emerald-400">{success}</p> : null}
              {uploading ? <p className="mt-4 text-sm text-slate-300">Uploading your photo...</p> : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
