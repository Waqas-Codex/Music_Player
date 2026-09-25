import { Song } from '@/types/Song/service';

export interface Album {
  _id?: string;
  id?: string;
  title: string;
  artist: string;
  coverImage?: string;
  releaseYear?: number;
  description?: string;
  slug?: string;
  songs?: string[] | Song[];
  createdAt?: string;
  updatedAt?: string;
}
