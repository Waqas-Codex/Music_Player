import { Request } from "express";

export type UploadedFiles = {
  [fieldname: string]: Express.Multer.File[];
};

export type SongUploadRequest = Request<{}, any, SongUploadDTO>;

export interface SongUploadDTO {
  title: string;
  album?: string;
  duration: string | number;
  description: string;
}

/**
 * Express params/query kabhi string ya string[] ho sakte hain.
 * Ye helper safely first string return karta hai.
 */
export const getSingleParam = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};
