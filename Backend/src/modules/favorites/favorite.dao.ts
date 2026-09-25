import { prisma } from "../../config/db";

/**
 * Add a song to favorites
 */
export const addToFavorites = async (userId: string, songId: string) => {
  // Check if already favorited
  const existing = await prisma.favorite.findUnique({
    where: { userId_songId: { userId, songId } },
  });

  if (existing) {
    throw new Error("Song already in favorites");
  }

  return prisma.favorite.create({ data: { userId, songId } });
};

/**
 * Remove a song from favorites
 */
export const removeFromFavorites = async (userId: string, songId: string) => {
  const result = await prisma.favorite.deleteMany({ where: { userId, songId } });

  if (result.count === 0) {
    throw new Error("Favorite not found");
  }

  return result;
};

/**
 * Get all favorite songs for a user
 */
export const getUserFavorites = async (userId: string, limit: number = 50) => {
  if (!userId) {
    throw new Error("Invalid user ID");
  }

  return prisma.favorite.findMany({
    where: { userId },
    include: { song: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
};

/**
 * Check if a song is favorited by user
 */
export const isSongFavorited = async (userId: string, songId: string) => {
  if (!userId || !songId) {
    throw new Error("Invalid user or song ID");
  }

  const favorite = await prisma.favorite.findUnique({
    where: { userId_songId: { userId, songId } },
  });
  return !!favorite;
};

/**
 * Get count of favorites for a song
 */
export const getFavoritesCount = async (songId: string) => {
  if (!songId) {
    throw new Error("Invalid song ID");
  }

  return prisma.favorite.count({ where: { songId } });
};
