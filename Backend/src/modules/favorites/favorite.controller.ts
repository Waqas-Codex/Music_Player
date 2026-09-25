import { Request, Response } from "express";
import * as favoriteService from "./favorite.service";
import { getSingleParam } from "../songs/song.types";

/**
 * Add song to favorites
 */
export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const songId = getSingleParam(req.params.id);

    if (!songId) {
      return res.status(400).json({
        message: "Song ID is required",
      });
    }

    await favoriteService.addFavoriteService(userId, songId);

    res.json({
      message: "Added to favorites",
    });
  } catch (error: any) {
    if (error.message === "Song already in favorites") {
      return res.status(409).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: error.message || "Failed to add to favorites",
    });
  }
};

/**
 * Remove song from favorites
 */
export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const songId = getSingleParam(req.params.id);

    if (!songId) {
      return res.status(400).json({
        message: "Song ID is required",
      });
    }

    await favoriteService.removeFavoriteService(userId, songId);

    res.json({
      message: "Removed from favorites",
    });
  } catch (error: any) {
    if (error.message === "Favorite not found") {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: error.message || "Failed to remove from favorites",
    });
  }
};

/**
 * Get user's favorite songs
 */
export const getUserFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const favorites = await favoriteService.getUserFavoritesService(userId, limit);

    res.json(favorites);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to get favorites",
    });
  }
};

/**
 * Check if song is favorited
 */
export const checkIsFavorited = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const songId = getSingleParam(req.params.id);

    if (!songId) {
      return res.status(400).json({
        message: "Song ID is required",
      });
    }

    const isFavorited = await favoriteService.isFavoritedService(userId, songId);

    res.json({
      isFavorited,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to check favorite status",
    });
  }
};
