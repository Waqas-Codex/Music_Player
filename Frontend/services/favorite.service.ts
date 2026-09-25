import axiosInstance from "@/lib/axios";
import { ApiRoutes } from "@/services/api";
import { normalizeSong, Song } from "@/services/song.service";

export const favoriteService = {
  async getFavorites(limit: number = 50): Promise<Song[]> {
    const response = await axiosInstance.get(ApiRoutes.favorites.root, {
      params: { limit },
    });
    return response.data.map(normalizeSong);
  },

  async addFavorite(songId: string): Promise<void> {
    await axiosInstance.post(ApiRoutes.favorites.add(songId));
  },

  async removeFavorite(songId: string): Promise<void> {
    await axiosInstance.delete(ApiRoutes.favorites.remove(songId));
  },

  async isFavorited(songId: string): Promise<boolean> {
    const response = await axiosInstance.get(ApiRoutes.favorites.check(songId));
    return response.data.isFavorited;
  },

  async toggleFavorite(songId: string, currentlyFavorited: boolean): Promise<void> {
    if (currentlyFavorited) {
      await this.removeFavorite(songId);
    } else {
      await this.addFavorite(songId);
    }
  },
};
