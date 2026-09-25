import { prisma } from "../../config/db";

export const createPlaylistDAO = (data: any) => {
  return prisma.playlist.create({ data });
};

export const findUserPlaylistsDAO = (userId: string) => {
  return prisma.playlist.findMany({
    where: { userId },
    include: { songs: { include: { song: true }, orderBy: { addedAt: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
};

export const findPlaylistByIdDAO = (id: string) => {
  return prisma.playlist.findUnique({
    where: { id },
    include: { songs: { include: { song: true }, orderBy: { addedAt: "asc" } } },
  });
};

export const deletePlaylistDAO = (id: string) => {
  return prisma.playlist.delete({ where: { id } });
};

export const addSongDAO = (playlistId: string, songId: string) =>
  prisma.playlistSong.create({ data: { playlistId, songId } });

export const removeSongDAO = (playlistId: string, songId: string) =>
  prisma.playlistSong.delete({ where: { playlistId_songId: { playlistId, songId } } });
