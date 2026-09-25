"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from 'react';
import { playlistService } from '@/services/playlist.service';
import { Heart } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

type NavIconId = "home" | "search" | "library" | "favorites";

interface SidebarNavLink {
  id: string;
  label: string;
  icon: NavIconId;
  /** When set, the row navigates with Next.js and highlights from the URL. */
  href?: string;
}

function navLinkIsActive(pathname: string, href: string | undefined, linkId: string, activeNavId: string) {
  if (href) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return activeNavId === linkId;
}

interface PlaylistLink {
  id: string;
  name: string;
}

const DEFAULT_NAV_LINKS: SidebarNavLink[] = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  { id: "search", label: "Search", icon: "search" },
  { id: "favorites", label: "Favorites", icon: "favorites", href: "/favorites" },
  { id: "library", label: "Your Library", icon: "library" },
];

const DEFAULT_PLAYLISTS: PlaylistLink[] = [
  { id: "p1", name: "Liked Songs" },
  { id: "p2", name: "Daily Mix 1" },
  { id: "p3", name: "Discover Weekly" },
  { id: "p4", name: "Release Radar" },
  { id: "p5", name: "On Repeat" },
  { id: "p6", name: "Chill Vibes" },
];

function NavIcon({ name }: { name: NavIconId }) {
  const common = "h-6 w-6 shrink-0";
  if (name === "home") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.5 3.247a1 1 0 0 0-1 0l-8 4.5A1 1 0 0 0 3 8.69v10.5a1 1 0 0 0 1 1h5v-8h6v8h5a1 1 0 0 0 1-1V8.69a1 1 0 0 0-.5-.943l-8-4.5Z" />
      </svg>
    );
  }
  if (name === "search") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M10.5 3a7.5 7.5 0 1 0 4.55 13.44l4.21 4.21 1.06-1.06-4.21-4.21A7.5 7.5 0 0 0 10.5 3Zm0 1.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
      </svg>
    );
  }
  if (name === "favorites") {
    return <Heart className={common} strokeWidth={1.8} aria-hidden />;
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.5 3.75h15v1.5h-15v-1.5Zm0 4.5h9v1.5h-9v-1.5Zm0 4.5h15v1.5h-15v-1.5Zm0 4.5h9v1.5h-9v-1.5Z" />
    </svg>
  );
}

interface AsideProps {
  activeNavId?: string;
  setActiveNavId?: (id: string) => void;
  activePlaylistId?: string | null;
  setActivePlaylistId?: (id: string | null) => void;
  navLinks?: SidebarNavLink[];
  playlists?: PlaylistLink[];
  onSearchOpen?: () => void;
}

export function Aside({
  activeNavId = "home",
  setActiveNavId,
  activePlaylistId = "p1",
  setActivePlaylistId,
  navLinks = DEFAULT_NAV_LINKS,
  playlists = DEFAULT_PLAYLISTS,
  onSearchOpen,
}: AsideProps) {
  const pathname = usePathname();
  const [apiPlaylists, setApiPlaylists] = useState<PlaylistLink[]>(playlists);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches);

    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await playlistService.getAllPlaylists();
        setApiPlaylists(data.map((playlist) => ({ id: playlist.id, name: playlist.name })));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setError(message || "Unable to load playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const activePlaylistIdFromPath = pathname.startsWith('/playlists/')
    ? pathname.split('/').pop() ?? null
    : null;
  const selectedPlaylistId = activePlaylistIdFromPath || activePlaylistId;

  const handleNavClick = (linkId: string) => {
    setActiveNavId?.(linkId);

    if (linkId === 'search' && isMobile && onSearchOpen) {
      onSearchOpen();
    }
  };

  return (
    <aside
      className="flex w-70 shrink-0 flex-col border-r border-white/10 bg-black"
      aria-label="Main navigation"
    >
      <div className="px-6 pb-2 pt-6">
        <BrandLogo />
      </div>

      <nav className="px-3 pb-4" aria-label="Primary">
        <ul className="space-y-1">
          {navLinks.map((link) => {
            const active = navLinkIsActive(pathname, link.href, link.id, activeNavId);
            const className = `flex w-full items-center gap-4 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              active
                ? "bg-green-600/20 text-white ring-1 ring-green-500/40"
                : "text-neutral-400 hover:bg-white/10 hover:text-white"
            }`;
            return (
              <li key={link.id}>
                {link.href ? (
                  <Link
                    href={link.href}
                    onClick={() => handleNavClick(link.id)}
                    className={className}
                  >
                    <NavIcon name={link.icon} />
                    <span>{link.label}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavClick(link.id)}
                    className={className}
                  >
                    <NavIcon name={link.icon} />
                    <span>{link.label}</span>
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mx-3 mb-2 h-px bg-white/10" />

      <div className="flex min-h-0 flex-1 flex-col px-3">
        <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
          Playlists
        </p>
        {error && (
          <div className="px-3 pb-2 text-sm text-red-400">
            {error}
          </div>
        )}
        <ul className="flex-1 space-y-0.5 overflow-y-auto pb-4" role="list">
          {loading && apiPlaylists.length === 0 ? (
            <li className="px-3 py-2 text-sm text-zinc-500">Loading playlists...</li>
          ) : apiPlaylists.length === 0 ? (
            <li className="px-3 py-2 text-sm text-zinc-500">No playlists found.</li>
          ) : (
            apiPlaylists.map((pl) => {
              const active = selectedPlaylistId === pl.id;
              return (
                <li key={pl.id}>
                  <Link
                    href={`/playlists/${pl.id}`}
                    onClick={() => setActivePlaylistId?.(pl.id)}
                    className={`block rounded-md px-3 py-2 text-sm transition-colors duration-200 ${
                      active
                        ? "bg-green-600/15 font-medium text-green-100"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {pl.name}
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </div>

      </aside>
  );
}