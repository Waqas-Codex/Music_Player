'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Settings,
  LogOut,
  Crown,
  Menu,
} from 'lucide-react';
import { isArtistUser } from '@/lib/auth';
import { getMediaUrl } from '@/lib/mediaUrl';

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return dir === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />;
}

interface UserProfile {
  name: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string | null;
  role?: string;
}

interface NavbarProps {
  title?: string;
  isAuthenticated?: boolean;
  user?: UserProfile | null;
  onLogout?: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
  showNavigation?: boolean;
  showSearch?: boolean;
  showUpgrade?: boolean;
  showMobileMenuButton?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  onUpgradeClick?: () => void;
  onUploadClick?: () => void;
  onBecomeArtistClick?: () => void;
  onMenuToggle?: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function Navbar({
  title = "Home",
  isAuthenticated = false,
  user = null,
  onLogout,
  onLogin,
  onSignup,
  showNavigation = true,
  showSearch = true,
  showUpgrade = true,
  showMobileMenuButton = false,
  onBack,
  onForward,
  onUpgradeClick,
  onUploadClick,
  onBecomeArtistClick,
  onMenuToggle,
  searchPlaceholder = "What do you want to play?",
  searchValue = "",
  onSearchChange,
}: NavbarProps) {
  const router = useRouter();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleBack = () => (onBack ? onBack() : router.back());
  const handleForward = () => (onForward ? onForward() : router.forward());

  const isArtist = isArtistUser(user);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const avatarSrc = user?.avatarUrl ? getMediaUrl(user.avatarUrl) : user?.avatar ? getMediaUrl(user.avatar) : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/5 bg-neutral-950/80 px-4 backdrop-blur-md sm:px-6">
      
      {/* Navigation */}
      {showNavigation && (
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={handleBack}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition"
          >
            <ChevronIcon dir="left" />
          </button>

          <button
            onClick={handleForward}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition"
          >
            <ChevronIcon dir="right" />
          </button>
        </div>
      )}

      {showMobileMenuButton && (
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Search */}
      {showSearch && (
        <div className="mx-auto hidden max-w-md flex-1 sm:block">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-full bg-white/10 pl-9 pr-4 text-sm text-white placeholder:text-neutral-500 outline-none focus:bg-white/15 focus:ring-2 focus:ring-green-500/30"
            />
          </div>
        </div>
      )}

      {/* Title (mobile) */}
      <div className="flex min-w-0 flex-1 justify-center sm:hidden">
        <h1 className="truncate text-sm font-semibold text-white">{title}</h1>
      </div>

      {/* Right Side */}
      <div className="ml-auto flex items-center gap-3">

        {/* Upload Button */}
        {isAuthenticated && user && isArtist && (
          <button
            onClick={onUploadClick}
            className="hidden sm:flex items-center gap-2 rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-500 transition"
          >
            Upload
          </button>
        )}

        {/* Upgrade */}
        {showUpgrade && (
          <button
            onClick={onUpgradeClick}
            className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/10 transition"
          >
            <Crown size={14} />
            Upgrade
          </button>
        )}

        {/* Auth */}
        {isAuthenticated && user ? (
          <div ref={menuRef} className="relative">
            
            {/* Avatar */}
            <button
              type="button"
              onClick={() => setOpenUserMenu((p) => !p)}
              aria-label="Open profile menu"
              aria-expanded={openUserMenu}
              className="flex items-center gap-2 rounded-full bg-white/5 p-1 pr-1 transition hover:bg-white/10 sm:pr-3"
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-green-600 text-xs font-bold text-white">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <span className="hidden max-w-32 truncate text-sm text-white sm:inline">
                {user.name}
              </span>
            </button>

            {/* Dropdown */}
            {openUserMenu && (
              <div className="absolute right-0 mt-3 w-60 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/95 shadow-2xl backdrop-blur-xl">
                
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-white/10 p-3">
<div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-green-600 text-xs font-bold">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="truncate text-xs text-neutral-400">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Menu */}
                <div className="p-2 text-sm text-white">
                  
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10">
                    <User size={16} className="text-neutral-400" />
                    Profile
                  </button>

                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10">
                    <Settings size={16} className="text-neutral-400" />
                    Settings
                  </button>

                  {!isArtist && (
                    <button onClick={onBecomeArtistClick} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 text-green-400">
                      <Crown size={16} className="text-green-400" />
                      Become an Artist
                    </button>
                  )}

                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10">
                    <Crown size={16} className="text-neutral-400" />
                    Upgrade
                  </button>

                  <div className="my-2 h-px bg-white/10" />

                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-green-400 hover:bg-green-500/10"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onLogin}
              className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
            >
              Login
            </button>

            <button
              onClick={onSignup}
              className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-500"
            >
              Sign up
            </button>
          </div>
        )}

        {/* Mobile login */}
        {!isAuthenticated && (
          <button
            onClick={onLogin}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white sm:hidden"
          >
            <User size={16} />
          </button>
        )}
      </div>
    </header>
  );
}