import { Request, Response } from "express";
import * as songService from "./song.service";
import { UploadedFiles, getSingleParam } from "./song.types";

/**
 * Upload song controller
 */
export const uploadSong = async (req: Request, res: Response) => {
  try {
    const files = req.files as UploadedFiles;

    const file = files?.file?.[0];
    const coverImageFile = files?.coverImage?.[0];

    const userId = (req as any).user.userId;
    const { description } = req.body;

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }
    const song = await songService.uploadSongService(
      file,
      {
        ...req.body,
        description,
      },
      userId,
      coverImageFile,
    );

    res.status(201).json({
      message: "Song uploaded",
      song,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Upload failed",
    });
  }
};

/**
 * Get songs controller
 */
export const getSongs = async (req: Request, res: Response) => {
  try {
    const query = getSingleParam(req.query.q as string | string[] | undefined);

    const songs = await songService.getSongsService(query);

    res.json(songs);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Get single song by slug
 */
export const getSongBySlug = async (req: Request, res: Response) => {
  try {
    const slug = getSingleParam(req.params.slug);

    if (!slug) {
      return res.status(400).json({
        message: "Slug is required",
      });
    }

    const song = await songService.getSongBySlugService(slug);

    res.json(song);
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};

/**
 * Stream song controller
 */
export const streamSong = async (req: Request, res: Response) => {
  try {
    const songId = getSingleParam(req.params.id);

    if (!songId) {
      return res.status(400).json({
        message: "Song ID is required",
      });
    }

    const { stream, headers, statusCode } = await songService.getSongStreamService(
      songId,
      req.headers.range,
    );

    res.status(statusCode).set(headers);

    stream.on("error", () => {
      if (!res.headersSent) {
        res.status(500).json({
          message: "Stream failed",
        });
      } else {
        res.end();
      }
    });

    req.on("close", () => {
      stream.destroy();
    });

    stream.pipe(res);
  } catch (error: any) {
    if (error.message === "Song not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Audio file not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Invalid song ID") {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === "Invalid range header") {
      return res.status(416).json({
        message: "Range Not Satisfiable",
      });
    }

    res.status(500).json({
      message: error.message || "Stream failed",
    });
  }
};

/**
 * Delete song controller
 */
export const deleteSong = async (req: Request, res: Response) => {
  try {
    const songId = getSingleParam(req.params.id);

    if (!songId) {
      return res.status(400).json({
        message: "Song ID is required",
      });
    }

    await songService.deleteSongService(songId);

    res.json({
      message: "Song deleted",
    });
  } catch (error: any) {
    if (error.message === "Song not found") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Invalid song ID") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({
      message: error.message || "Delete failed",
    });
  }
};

/**
 * Get most played songs controller
 */
export const getMostPlayed = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const songs = await songService.getMostPlayedService(limit);
    res.json(songs);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to get most played songs",
    });
  }
};

/**
 * Get recently added songs controller
 */
export const getRecent = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const songs = await songService.getRecentService(limit);
    res.json(songs);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to get recent songs",
    });
  }
};

/**
 * Increment play count controller
 */
export const recordPlay = async (req: Request, res: Response) => {
  try {
    const songId = getSingleParam(req.params.id);

    if (!songId) {
      return res.status(400).json({
        message: "Song ID is required",
      });
    }

    const song = await songService.recordPlayService(songId);
    res.json(song);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to record play",
    });
  }
};
