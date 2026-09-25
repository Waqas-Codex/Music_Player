import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkIsFavorited,
} from "./favorite.controller";

const router = Router();

/**
 * All favorite routes require authentication
 */
router.use(authMiddleware);

/**
 * Get user's favorite songs
 * GET /api/favorites
 */
router.get("/", getUserFavorites);

/**
 * Check if a song is favorited
 * GET /api/favorites/check/:id
 */
router.get("/check/:id", checkIsFavorited);

/**
 * Add song to favorites
 * POST /api/favorites/:id
 */
router.post("/:id", addToFavorites);

/**
 * Remove song from favorites
 * DELETE /api/favorites/:id
 */
router.delete("/:id", removeFromFavorites);

export default router;
