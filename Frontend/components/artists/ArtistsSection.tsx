'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Artist, artistService } from '@/services/artist.service';
import { ArtistCard } from '@/components/artists';

interface ArtistsSectionProps {
  title?: string;
  icon?: React.ReactNode;
  limit?: number;
}

const ARTISTS_LIMIT = 12;

export function ArtistsSection({ title = "Featured Artists", icon, limit = ARTISTS_LIMIT }: ArtistsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScroll({
      left: scrollLeft > 0,
      right: scrollLeft + clientWidth < scrollWidth - 5,
    });
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await artistService.getAllArtists();
        // Limit the number of artists displayed
        setArtists(data.artists.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load artists');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [limit]);

  useEffect(() => {
    checkScroll();

    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [artists]);

  const scroll = (direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({
      left: direction === 'left' ? -400 : 400,
      behavior: 'smooth',
    });
  };

  const renderEmpty = () => (
    <div className="mb-10 w-full overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        {icon || <Users className="h-5 w-5 text-neutral-400" />}
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-56 w-48 shrink-0 animate-pulse rounded-xl bg-slate-800/70"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 text-center text-red-400">
          {error}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 text-center text-slate-400">
          No artists available
        </div>
      )}
    </div>
  );

  const uniqueArtists = Array.from(
    new Map(artists.map((artist) => [artist._id, artist])).values(),
  );

  if (loading || !uniqueArtists.length) return renderEmpty();

  return (
    <div className="mb-10 w-full overflow-hidden">
      <div className="mb-4 flex items-center gap-2">
        {icon || <Users className="h-5 w-5 text-neutral-400" />}
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      </div>

      <div className="group relative w-full overflow-hidden">
        {canScroll.left && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/80 p-2 text-white opacity-0 transition-all hover:bg-slate-800 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {uniqueArtists.map((artist, index) => (
            <div key={`${artist._id}-${index}`} className="w-48 shrink-0">
              <ArtistCard artist={artist} />
            </div>
          ))}
        </div>

        {canScroll.right && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-slate-950/80 p-2 text-white opacity-0 transition-all hover:bg-slate-800 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
