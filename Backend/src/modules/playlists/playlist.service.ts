import * as playlistDAO from "./playlist.dao";

export const createPlaylistService = async (
  name: string,
  userId: string,
  coverImagePath?: string | null,
) => {
  return playlistDAO.createPlaylistDAO({
    name,
    userId,
    coverImage: coverImagePath,
  });
};

export const addSongToPlaylistService = async (playlistId: string, songId: string) => {
  const playlist = await playlistDAO.findPlaylistByIdDAO(playlistId);

  if (!playlist) {
    throw new Error("Playlist not found");
  }

  const existing = playlist.songs.some((playlistSong: { songId: string }) => playlistSong.songId === songId);
  if (!existing) {
    await playlistDAO.addSongDAO(playlistId, songId);
  }
  return playlistDAO.findPlaylistByIdDAO(playlistId);
};

export const getPlaylistByIdService = async (playlistId: string) => {
  const playlist = await playlistDAO.findPlaylistByIdDAO(playlistId);
  return playlist
    ? { ...playlist, songs: playlist.songs.map((item: { song: unknown }) => item.song) }
    : playlist;
};

export const getUserPlaylistsService = async (userId: string) => {
  const playlists = await playlistDAO.findUserPlaylistsDAO(userId);
  return playlists.map((playlist: { songs: Array<{ song: unknown }> }) => ({
    ...playlist,
    songs: playlist.songs.map((item: { song: unknown }) => item.song),
  }));
};

export const removeSongFromPlaylistService = async (playlistId: string, songId: string) => {
  const playlist = await playlistDAO.findPlaylistByIdDAO(playlistId);

  if (!playlist) {
    throw new Error("Playlist not found");
  }

  const hasSong = playlist.songs.some((playlistSong: { songId: string }) => playlistSong.songId === songId);

  if (!hasSong) {
    throw new Error("Song not found in playlist");
  }

  await playlistDAO.removeSongDAO(playlistId, songId);
  const updatedPlaylist = await playlistDAO.findPlaylistByIdDAO(playlistId);
  return updatedPlaylist
    ? {
        ...updatedPlaylist,
        songs: updatedPlaylist.songs.map((item: { song: unknown }) => item.song),
      }
    : updatedPlaylist;
};

export const deletePlaylistService = async (playlistId: string) => {
  const deleted = await playlistDAO.deletePlaylistDAO(playlistId);
  if (!deleted) {
    throw new Error("Playlist not found");
  }
  return deleted;
};
