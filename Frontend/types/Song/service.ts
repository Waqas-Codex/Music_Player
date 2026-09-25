export interface Song {
  _id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  fileUrl: string;
  description?: string;
  coverImage?: string;
  slug?: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
  plays?: number;
}