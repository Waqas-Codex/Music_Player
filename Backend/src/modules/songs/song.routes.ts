import { Router } from "express";
import { upload } from "../../utils/multer";
import {
  uploadSong,
  getSongs,
  getSongBySlug,
  streamSong,
  deleteSong,
  getMostPlayed,
  getRecent,
  recordPlay,
} from "./song.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import { Role } from "../users/user.model";

const router = Router();

/**
 * Upload song
 *
 * form-data keys:
 * file       → audio file
 * coverImage → image file optional
 */
router.post(
  "/upload",
  authMiddleware,
  requireRole([Role.ARTIST, Role.ADMIN]),
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  uploadSong,
);

/**
 * Stream song by ID
 *
 * IMPORTANT:
 * Isko /:slug se pehle rakhna zaroori hai.
 */
router.get("/stream/:id", streamSong);

/**
 * Get most played songs
 */
router.get("/trending/most-played", getMostPlayed);

/**
 * Get recently added songs
 */
router.get("/trending/recent", getRecent);

/**
 * Record a song play
 */
router.post("/:id/play", recordPlay);

/**
 * Get all songs
 *
 * Optional search:
 * /api/songs?q=eminem
 */
router.get("/", getSongs);

/**
 * Delete song by ID
 *
 * IMPORTANT:
 * Isko /:slug se pehle rakhna better hai,
 * warna kabhi route conflict ho sakta hai.
 */
router.delete("/:id", authMiddleware, deleteSong);

/**
 * Get song by slug
 *
 * Ye catch-all type route hai,
 * isliye hamesha last me rakho.
 */
router.get("/:slug", getSongBySlug);

export default router;
