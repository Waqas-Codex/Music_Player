import { prisma } from "../../config/db";
import slugify from "slugify";

/**
 * Create a new song
 */
export const createSong = (data: any) => {
  return prisma.song.create({
    data: {
      ...data,
      slug: slugify(data.title, { lower: true, strict: true }),
    },
  });
};

/**
 * Get all songs
 * If query exists → search by title, artist, album
 */
export const findSongs = (query?: string) => {
  return prisma.song.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { artist: { contains: query, mode: "insensitive" } },
            { album: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get single song by slug
 */
export const findSongBySlug = (slug: string) => {
  return prisma.song.findUnique({ where: { slug } });
};

/**
 * Get single song by ID
 */
export const findSongById = (id: string) => {
  return prisma.song.findUnique({ where: { id } });
};

/**
 * Delete song by ID
 */
export const deleteSongById = (id: string) => {
  return prisma.song.delete({ where: { id } });
};

/**
 * Increase play count by 1
 *
 * Increment the play count atomically.
 */
export const incrementPlayCount = (id: string) => {
  return prisma.song.update({ where: { id }, data: { plays: { increment: 1 } } });
};

/**
 * Get top played songs
 *
 * Example:
 * Song A = 150 plays
 * Song B = 90 plays
 * Song C = 300 plays
 *
 * Result:
 * Song C
 * Song A
 * Song B
 */
export const getMostViewedSongs = (limit = 10) => {
  return prisma.song.findMany({ orderBy: { plays: "desc" }, take: limit });
};

/**
 * Get recently added songs
 * Sorted by creation date in descending order
 */
export const getRecentSongs = (limit = 10) => {
  return prisma.song.findMany({ orderBy: { createdAt: "desc" }, take: limit });
};
