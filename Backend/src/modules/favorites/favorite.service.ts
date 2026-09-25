import * as favoriteDao from "./favorite.dao";

/**
 * Add song to favorites service
 */
export const addFavoriteService = async (userId: string, songId: string) => {
  return favoriteDao.addToFavorites(userId, songId);
};

/**
 * Remove song from favorites service
 */
export const removeFavoriteService = async (userId: string, songId: string) => {
  return favoriteDao.removeFromFavorites(userId, songId);
};

/**
 * Get user's favorite songs service
 */
export const getUserFavoritesService = async (userId: string, limit?: number) => {
  const favorites = await favoriteDao.getUserFavorites(userId, limit);
  // Extract just the song data from populated favorites
  return favorites.map((fav: any) => fav.song);
};

/**
 * Check if song is favorited service
 */
export const isFavoritedService = async (userId: string, songId: string) => {
  return favoriteDao.isSongFavorited(userId, songId);
};

/**
 * Get favorites count for a song service
 */
export const getFavoritesCountService = async (songId: string) => {
  return favoriteDao.getFavoritesCount(songId);
};
