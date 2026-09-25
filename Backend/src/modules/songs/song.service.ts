import fs from "fs";
import path from "path";
import * as songDao from "./song.dao";
import { prisma } from "../../config/db";
import { SongUploadDTO } from "./song.types";

const AUDIO_CONTENT_TYPES: Record<string, string> = {
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".webm": "audio/webm",
};

const getAudioContentType = (filePath: string) =>
  AUDIO_CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";

/**
 * DB me saved url ko real local file path me convert karta hai.
 *
 * Example:
 * DB: /uploads/song.mp3
 * Real path: project-root/uploads/song.mp3
 */
const resolveUploadPath = (fileUrl: string) => {
  const cleanPath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;

  return path.join(process.cwd(), cleanPath);
};

/**
 * Song upload karta hai:
 * - logged-in user ko artist banata hai
 * - duration validate karta hai
 * - audio file + optional cover image save karta hai
 * - DB me song record create karta hai
 */
export const uploadSongService = async (
  file: Express.Multer.File,
  body: SongUploadDTO,
  userId: string,
  coverImageFile?: Express.Multer.File,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  const durationNum =
    typeof body.duration === "string" ? Number.parseFloat(body.duration) : body.duration;

  if (Number.isNaN(durationNum) || durationNum <= 0) {
    throw new Error("Invalid duration");
  }

  const song = await songDao.createSong({
    title: body.title,
    artist: user.name,
    album: body.album?.trim() || "Unknown",
    duration: durationNum,
    description: body.description,

    // Browser/public URL ke liye
    fileUrl: `/uploads/${file.filename}`,

    coverImage: coverImageFile ? `/uploads/${coverImageFile.filename}` : "",

    uploadedBy: userId,
  });

  return song;
};

/**
 * Songs fetch karta hai.
 * Agar query aaye to search karega.
 */
export const getSongsService = async (query?: string) => {
  const normalizedQuery = query?.trim();

  return songDao.findSongs(normalizedQuery);
};

/**
 * Slug se single song fetch karta hai.
 */
export const getSongBySlugService = async (slug: string) => {
  const song = await songDao.findSongBySlug(slug);

  if (!song) {
    throw new Error("Song not found");
  }

  return song;
};

/**
 * Song stream ke liye:
 * - song ID validate karta hai
 * - DB se song fetch karta hai
 * - local file check karta hai
 * - range headers handle karta hai
 * - audio stream return karta hai
 */
export const getSongStreamService = async (songId: string, rangeHeader?: string | string[]) => {
  if (!songId) {
    throw new Error("Invalid song ID");
  }

  const song = await songDao.findSongById(songId);

  if (!song) {
    throw new Error("Song not found");
  }

  // DB URL ko actual file path me convert karo
  const filePath = resolveUploadPath(song.fileUrl);

  let fileStats: fs.Stats;

  try {
    fileStats = await fs.promises.stat(filePath);
  } catch {
    throw new Error("Audio file not found");
  }

  if (!fileStats.isFile()) {
    throw new Error("Audio file not found");
  }

  const fileSize = fileStats.size;

  const range = Array.isArray(rangeHeader) ? rangeHeader[0] : rangeHeader;

  const { start, end, headers, statusCode } = buildAudioRange(
    range,
    fileSize,
    getAudioContentType(filePath),
  );

  const stream = fs.createReadStream(filePath, {
    start,
    end,
  });

  return {
    song,
    stream,
    statusCode,
    headers,
  };
};

type RangeResult = {
  start: number;
  end: number;
  statusCode: number;
  headers: Record<string, string>;
};

/**
 * Browser audio player range header bhejta hai:
 *
 * Range: bytes=0-999999
 *
 * Is function ka kaam:
 * - decide karna file ka kaunsa part bhejna hai
 * - correct headers banana
 */
const buildAudioRange = (
  rangeHeader: string | undefined,
  fileSize: number,
  contentType: string,
): RangeResult => {
  const baseHeaders = {
    "Accept-Ranges": "bytes",
    "Content-Type": contentType,
  };

  // Agar browser range na bheje to full file stream karo
  if (!rangeHeader) {
    return {
      start: 0,
      end: fileSize - 1,
      statusCode: 200,
      headers: {
        ...baseHeaders,
        "Content-Length": `${fileSize}`,
      },
    };
  }

  if (!rangeHeader.startsWith("bytes=")) {
    throw new Error("Invalid range header");
  }

  const parts = rangeHeader.replace("bytes=", "").split("-");

  const start = Number(parts[0]);
  const end = parts[1] ? Number(parts[1]) : fileSize - 1;

  if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end < start || start >= fileSize) {
    throw new Error("Invalid range header");
  }

  return {
    start,
    end,
    statusCode: 206,
    headers: {
      ...baseHeaders,
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Content-Length": `${end - start + 1}`,
    },
  };
};

/**
 * Song delete karta hai:
 * - DB se song find
 * - audio file delete
 * - cover image delete
 * - DB record delete
 */
export const deleteSongService = async (songId: string) => {
  if (!songId) {
    throw new Error("Invalid song ID");
  }

  const song = await songDao.findSongById(songId);

  if (!song) {
    throw new Error("Song not found");
  }

  // Audio file delete
  await deleteLocalFile(song.fileUrl);

  // Cover image delete, agar exist karti ho
  if (song.coverImage) {
    await deleteLocalFile(song.coverImage);
  }

  // DB se record delete
  await songDao.deleteSongById(songId);
};

/**
 * Local file safely delete karta hai.
 * Agar file missing ho to app crash nahi karega.
 */
const deleteLocalFile = async (fileUrl: string) => {
  try {
    const fullPath = resolveUploadPath(fileUrl);

    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (error) {
    console.error("File delete failed:", error);
  }
};

/**
 * Get most played songs
 */
export const getMostPlayedService = async (limit: number = 10) => {
  return songDao.getMostViewedSongs(limit);
};

/**
 * Get recently added songs
 */
export const getRecentService = async (limit: number = 10) => {
  return songDao.getRecentSongs(limit);
};

/**
 * Record a song play and increment play count
 */
export const recordPlayService = async (songId: string) => {
  if (!songId) {
    throw new Error("Invalid song ID");
  }

  const updatedSong = await songDao.incrementPlayCount(songId);

  if (!updatedSong) {
    throw new Error("Song not found");
  }

  return updatedSong;
};
