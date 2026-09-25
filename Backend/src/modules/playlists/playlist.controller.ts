import { Request, Response } from "express";
import * as playlistService from "./playlist.service";

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const coverImagePath = req.file ? req.file.path : null;

    const playlist = await playlistService.createPlaylistService(
      req.body.name,
      userId,
      coverImagePath,
    );

    res.status(201).json(playlist);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addSongToPlaylist = async (req: Request, res: Response) => {
  try {
    const playlistId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const playlist = await playlistService.addSongToPlaylistService(playlistId, req.body.songId);

    res.json(playlist);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPlaylist = async (req: Request, res: Response) => {
  try {
    const playlistId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const playlist = await playlistService.getPlaylistByIdService(playlistId);

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    res.json(playlist);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserPlaylists = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const playlists = await playlistService.getUserPlaylistsService(userId);

    res.json(playlists);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeSongFromPlaylist = async (req: Request, res: Response) => {
  try {
    const playlistId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const songId = Array.isArray(req.params.songId) ? req.params.songId[0] : req.params.songId;

    const playlist = await playlistService.removeSongFromPlaylistService(playlistId, songId);

    res.json({ playlist });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const playlistId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    await playlistService.deletePlaylistService(playlistId);
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
