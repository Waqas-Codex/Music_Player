export interface ISong {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  fileUrl: string;
  coverImage?: string;
  description: string;
  uploadedBy?: string | null;
  slug: string;
  plays: number;
}
