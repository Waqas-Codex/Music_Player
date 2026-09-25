import axiosInstance from '@/lib/axios';
import { ApiRoutes } from '@/services/api';
import { Album } from '@/types/Album/service';
import { Song } from '@/types/Song/service';
import axios from 'axios';

export const albumService = {
  async getAllAlbums(query?: string): Promise<Album[]> {
    const response = await axiosInstance.get(ApiRoutes.albums.root, {
      params: query ? { q: query } : undefined,
    });
    return response.data;
  },

  async getAlbumById(id: string): Promise<Album> {
    const response = await axiosInstance.get(ApiRoutes.albums.byId(id));
    return response.data;
  },

  async getAlbumBySlug(slug: string): Promise<Album> {
    // If you actually use slug-based route from ApiRoutes.albums.bySlug
    const response = await axiosInstance.get(ApiRoutes.albums.bySlug(slug));
    return response.data;
  },

  async getAlbumSongs(id: string): Promise<Song[]> {
    const response = await axiosInstance.get(ApiRoutes.albums.songs(id));
    return response.data;
  },

  async createAlbum(data: Partial<Album>): Promise<Album> {
    const response = await axiosInstance.post(ApiRoutes.albums.root, data);
    return response.data;
  },

  async uploadAlbumCover(id: string, formData: FormData): Promise<Album> {
    const response = await axiosInstance.post(
      `${ApiRoutes.albums.byId(id)}/cover`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  async updateAlbum(id: string, data: Partial<Album>): Promise<Album> {
    const response = await axiosInstance.put(ApiRoutes.albums.byId(id), data);
    return response.data;
  },

  async deleteAlbum(id: string): Promise<void> {
    try {
      const response = await axiosInstance.delete(ApiRoutes.albums.byId(id));
      console.log('DELETE ALBUM RESPONSE:', response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('DELETE ALBUM API ERROR:', error.response?.data);
        console.error('STATUS:', error.response?.status);
      } else {
        console.error('UNKNOWN ERROR:', error);
      }
      throw error;
    }
  },
};
