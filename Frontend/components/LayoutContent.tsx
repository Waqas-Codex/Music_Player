'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Aside } from '@/components/Aside';
import { Navbar } from '@/components/Navbar';
import { logout } from '@/lib/slices/authSlice';
import { authService } from '@/services/auth.service';
import { Search, X } from 'lucide-react';

interface LayoutContentProps {
  children: React.ReactNode;
}

function LayoutContentInner({ children }: LayoutContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  const [activeNavId, setActiveNavId] = useState<string>('home');
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchModalOpen, setMobileSearchModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showMusicLayout =
    isAuthenticated &&
    (pathname === '/' ||
      pathname.startsWith('/songs') ||
      pathname.startsWith('/playlists') ||
      pathname.startsWith('/upload') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/profile'));

  const showNavbarOnly = pathname === '/' && !isAuthenticated;

  const queryValue = searchParams.get('q') ?? '';

  useEffect(() => {
    if (mobileSearchModalOpen) {
      searchInputRef.current?.focus();
    }
  }, [mobileSearchModalOpen]);

  if (loading) {
    return <div className="min-h-screen bg-black text-white" />;
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch(logout());
      router.push('/login');
    }
  };

  const handleLogin = () => router.push('/login');
  const handleSignup = () => router.push('/register');

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedValue = value.trim();

    if (trimmedValue) {
      params.set('q', trimmedValue);
    } else {
      params.delete('q');
    }

    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(url);
  };

  const openMobileSearchModal = () => {
    setMobileSearchModalOpen(true);
    setMobileMenuOpen(false);
  };

  const getNavbarTitle = () => {
    if (pathname === '/') return 'Home';
    if (pathname.startsWith('/songs')) return 'Songs';
    if (pathname.startsWith('/playlists')) return 'Playlists';
    if (pathname.startsWith('/upload')) return 'Upload';
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/profile')) return 'Profile';
    return 'Chuchify';
  };

  if (showMusicLayout) {
    return (
      <div className="flex h-screen overflow-hidden bg-black font-sans text-white antialiased">
        <div className="hidden md:block">
          <Aside
            activeNavId={activeNavId}
            setActiveNavId={setActiveNavId}
            activePlaylistId={activePlaylistId}
            setActivePlaylistId={setActivePlaylistId}
            navLinks={[
              { id: 'home', label: 'Home', icon: 'home', href: '/' },
              { id: 'search', label: 'Search', icon: 'search' },
              { id: 'songs', label: 'Songs', icon: 'library', href: '/songs' },
              { id: "favorites", label: "Favorites", icon: "favorites", href: "/favorites" },
            ]}
            playlists={[]}
            onSearchOpen={openMobileSearchModal}
          />
        </div>

        {mobileMenuOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
          />
        )}

        <div
          className={`fixed inset-y-0 left-0 z-40 w-72 -translate-x-full transition-transform duration-200 md:hidden ${
            mobileMenuOpen ? 'translate-x-0' : ''
          }`}
        >
          <Aside
            activeNavId={activeNavId}
            setActiveNavId={(id) => {
              setActiveNavId(id);
              setMobileMenuOpen(false);
            }}
            activePlaylistId={activePlaylistId}
            setActivePlaylistId={(id) => {
              setActivePlaylistId(id);
              setMobileMenuOpen(false);
            }}
            navLinks={[
              { id: 'home', label: 'Home', icon: 'home', href: '/' },
              { id: 'search', label: 'Search', icon: 'search' },
              { id: 'songs', label: 'Songs', icon: 'library', href: '/songs' },
            ]}
            playlists={[]}
            onSearchOpen={openMobileSearchModal}
          />
        </div>

        {mobileSearchModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm md:hidden">
            <div className="mx-auto flex h-full w-full max-w-md flex-col px-4 py-4">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/95 px-3 py-2 shadow-2xl shadow-black/30">
                <Search size={18} className="text-neutral-400" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={queryValue}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder={pathname.startsWith('/songs') ? 'Search songs...' : pathname.startsWith('/playlists') ? 'Search playlists...' : 'Search songs, artists or playlists'}
                  className="flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-neutral-500"
                />
                <button
                  type="button"
                  onClick={() => setMobileSearchModalOpen(false)}
                  className="rounded-full p-1 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-900/80 p-4 text-sm text-neutral-400">
                Search across your music library from here.
              </div>
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col bg-black">
          <Navbar
            title={getNavbarTitle()}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onUploadClick={() => router.push('/upload')}
            onBecomeArtistClick={() => router.push('/become-artist')}
            showNavigation={true}
            showSearch={true}
            showUpgrade={true}
            showMobileMenuButton={true}
            onMenuToggle={() => setMobileMenuOpen((value) => !value)}
            searchValue={queryValue}
            onSearchChange={handleSearchChange}
            searchPlaceholder={
              pathname.startsWith('/songs')
                ? 'Search songs...'
                : pathname.startsWith('/playlists')
                  ? 'Search playlists...'
                  : 'What do you want to play?'
            }
          />

          <main className="flex-1 overflow-y-auto bg-black bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-black px-4 pb-10 pt-6 sm:px-8">
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (showNavbarOnly) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar
          title={getNavbarTitle()}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onUploadClick={() => router.push('/upload')}
          onBecomeArtistClick={() => router.push('/become-artist')}
          showNavigation={true}
          showSearch={true}
          showUpgrade={false}
          searchValue={queryValue}
          onSearchChange={handleSearchChange}
        />

        <main className="min-h-screen bg-black text-white">{children}</main>
      </div>
    );
  }

  return <div className="min-h-screen bg-black text-white">{children}</div>;
}

export function LayoutContent({ children }: LayoutContentProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white" />}>
      <LayoutContentInner>{children}</LayoutContentInner>
    </Suspense>
  );
}