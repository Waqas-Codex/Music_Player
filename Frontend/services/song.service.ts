import axiosInstance from '@/lib/axios';
import { ApiBaseUrl, ApiRoutes } from '@/services/api';
import axios from 'axios';
import { Song as SongType } from '@/types/Song/service';

export type Song = SongType;

type ApiSong = SongType & { id?: string; _id?: string };

export const normalizeSong = (song: ApiSong): SongType => ({
  ...song,
  _id: song._id ?? song.id ?? '',
});

export const songService = {
  async getAllSongs(query?: string): Promise<SongType[]> {
    const response = await axiosInstance.get(ApiRoutes.songs.root, {
      params: query ? { q: query } : undefined,
    });

    return response.data.map(normalizeSong);
  },

  async getSongBySlug(slug: string): Promise<SongType> {
    const response = await axiosInstance.get(ApiRoutes.songs.bySlug(slug));
    return normalizeSong(response.data);
  },

  async streamSong(songId: string): Promise<ArrayBuffer> {
    const response = await axiosInstance.get(ApiRoutes.songs.stream(songId), {
      responseType: 'arraybuffer',
    });

    return response.data;
  },

  getStreamUrl(songId: string): string {
    return `${ApiBaseUrl}${ApiRoutes.songs.stream(songId)}`;
  },

  async uploadSong(
    formData: FormData,
    onUploadProgress?: (progress: number) => void
  ) {
    const response = await axiosInstance.post(
      ApiRoutes.songs.upload || '/songs/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;

          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          onUploadProgress?.(progress);
        },
      }
    );

    return response.data;
  },

  async deleteSong(id: string): Promise<void> {

    try {
  const response = await axiosInstance.delete(ApiRoutes.songs.delete(id));
  console.log('DELETE RESPONSE:', response.data);
} catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error('DELETE API ERROR:', error.response?.data);
    console.error('STATUS:', error.response?.status);
  } else {
    console.error('UNKNOWN ERROR:', error);
  }

  throw error;
}
  },

  async getMostPlayed(limit: number = 10): Promise<SongType[]> {
    const response = await axiosInstance.get(ApiRoutes.songs.mostPlayed, {
      params: { limit },
    });

    return response.data.map(normalizeSong);
  },

  async getRecent(limit: number = 10): Promise<SongType[]> {
    const response = await axiosInstance.get(ApiRoutes.songs.recent, {
      params: { limit },
    });

    return response.data.map(normalizeSong);
  },

 async recordPlay(songId: string): Promise<void> {
  console.log(
    "RECORD PLAY REQUEST:",
    songId
  );

  try {
    const response =
      await axiosInstance.post(
        ApiRoutes.songs.recordPlay(songId)
      );

    console.log(
      "RECORD PLAY SUCCESS:",
      response.data
    );
  } catch (error) {
    console.error(
      "RECORD PLAY ERROR:",
      error
    );

    throw error;
  }
}
};