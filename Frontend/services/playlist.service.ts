import axiosInstance from "@/lib/axios";
import { ApiRoutes } from "@/services/api";
import { Song } from "./song.service";

/** Matches mongoose playlist (user + songs refs) */
export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  user: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

/** POST /playlists — user is taken from auth token on the server */
export interface CreatePlaylistRequest {
  name: string;
}

export interface UpdatePlaylistRequest {
  name?: string;
  description?: string;
}

export const playlistService = {
  async createPlaylist(data: CreatePlaylistRequest | FormData): Promise<Playlist> {
    const response = await axiosInstance.post(ApiRoutes.playlists.root, data, {
      headers: data instanceof FormData
        ? {
            "Content-Type": "multipart/form-data",
          }
        : undefined,
    });
    return response.data;
  },

  async getAllPlaylists(): Promise<Playlist[]> {
    const response = await axiosInstance.get(ApiRoutes.playlists.root);
    return response.data;
  },

  async getPlaylist(playlistId: string): Promise<Playlist> {
    const response = await axiosInstance.get(ApiRoutes.playlists.playlist(playlistId));
    return response.data;
  },

  async updatePlaylist(
    playlistId: string,
    data: UpdatePlaylistRequest
  ): Promise<Playlist> {
    const response = await axiosInstance.put(ApiRoutes.playlists.playlist(playlistId), data);
    return response.data.playlist;
  },

  async deletePlaylist(playlistId: string): Promise<void> {
    await axiosInstance.delete(ApiRoutes.playlists.playlist(playlistId));
  },

  async addSongToPlaylist(playlistId: string, songId: string): Promise<Playlist> {
    const response = await axiosInstance.post(
      ApiRoutes.playlists.songs(playlistId),
      { songId }
    );
    return response.data;
  },

  async removeSongFromPlaylist(
    playlistId: string,
    songId: string
  ): Promise<Playlist> {
    const response = await axiosInstance.delete(
      `${ApiRoutes.playlists.songs(playlistId)}/${songId}`
    );
    return response.data.playlist;
  },
};
