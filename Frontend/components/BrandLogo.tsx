import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  compact?: boolean;
}

export function BrandLogo({
  href = "/",
  compact = false,
}: BrandLogoProps) {
  const content = (
    <span
      className={`group inline-flex items-center ${
        compact ? "gap-2" : "gap-2.5"
      }`}
    >
      <span
        className={`
          relative flex shrink-0 items-center justify-center
          overflow-hidden rounded-[16px]
          bg-gradient-to-br from-[#1ed760] via-[#1db954] to-[#0d7a33]
          shadow-[0_8px_28px_rgba(30,183,84,0.35)]
          ring-1 ring-white/10
          transition-all duration-300
          group-hover:-rotate-3 group-hover:scale-105
          ${compact ? "h-9 w-9" : "h-11 w-11"}
        `}
        aria-hidden
      >
        <svg
          viewBox="0 0 44 44"
          className="relative z-10 h-[31px] w-[31px]"
          fill="none"
          aria-hidden="true"
        >
          {/* Flowing sound-wave arcs forming a dynamic "C" shape */}
          <path
            d="M30.5 12.5c-3-3-7.5-4-11.5-2.5C14 12 11 16.5 11 22s3 10 8 12c4 1.5 8.5 0.5 11.5-2.5"
            stroke="#0a1f12"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Inner sound wave — lighter accent */}
          <path
            d="M27 17c-1.5-1.5-4-2-6-1.2-2.5 1-4 3.5-4 6.2s1.5 5.2 4 6.2c2 0.8 4.5 0.3 6-1.2"
            stroke="#a8f0c2"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          {/* Play triangle nestled at the heart of the waves */}
          <path
            d="M20.5 19.5v5l4.3-2.5z"
            fill="#ffffff"
          />
        </svg>
      </span>

      {/* Wordmark */}
      <span
        className={`
          tracking-[-0.065em] text-white
          transition-opacity duration-200
          group-hover:opacity-90
          ${compact ? "text-lg" : "text-xl"}
        `}
        style={{
          fontFamily: '"Sora", "Inter", sans-serif',
          fontWeight: 700,
          letterSpacing: "-0.08em",
        }}
      >
        chuchify
      </span>
    </span>
  );

  return href ? (
    <Link href={href} aria-label="Chuchify home">
      {content}
    </Link>
  ) : (
    content
  );
}