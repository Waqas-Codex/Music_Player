const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BACKEND_URL = API_URL.replace("/api", "");

export const getCoverImageUrl = (coverImage?: string): string => {
  if (!coverImage) return "";
  if (coverImage.startsWith("http")) return coverImage;
  if (coverImage.startsWith("/")) return `${BACKEND_URL}${coverImage}`;
  return "";
};

export const getLikedSongs = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("likedSongs");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const toggleLikedSong = (songId: string, liked: boolean): void => {
  if (typeof window === "undefined") return;
  const likedSongs = getLikedSongs();
  const updated = liked
    ? [...likedSongs, songId]
    : likedSongs.filter((id) => id !== songId);
  localStorage.setItem("likedSongs", JSON.stringify(updated));
};

export const isLikedSong = (songId: string): boolean => {
  return getLikedSongs().includes(songId);
};
