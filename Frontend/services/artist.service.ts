import axiosInstance from "@/lib/axios";
import { ApiRoutes } from "@/services/api";
import { Role } from "@/types";

export interface Artist {
  _id: string;
  name: string;
  email: string;
  role: Role | string;
  avatar?: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistRequestResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: Role | string;
  };
}

type ApiArtist = Artist & { id?: string; _id?: string };

const normalizeArtist = (artist: ApiArtist): Artist => ({
  ...artist,
  _id: artist._id ?? artist.id ?? '',
});

export const artistService = {
  async requestArtistRole(data: { stageName: string; bio?: string }): Promise<ArtistRequestResponse> {
    const response = await axiosInstance.post(ApiRoutes.artists.request, data);
    return response.data;
  },

  async getAllArtists(): Promise<{ artists: Artist[] }> {
    const response = await axiosInstance.get(ApiRoutes.artists.root);
    return {
      ...response.data,
      artists: (response.data.artists ?? []).filter(Boolean).map(normalizeArtist),
    };
  },

  async getArtistById(id: string): Promise<{ artist: Artist }> {
    const response = await axiosInstance.get(ApiRoutes.artists.byId(id));
    return {
      ...response.data,
      artist: normalizeArtist(response.data.artist),
    };
  },
};
