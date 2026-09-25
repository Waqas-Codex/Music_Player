import { Router } from "express";
import {
  createPlaylist,
  addSongToPlaylist,
  getPlaylist,
  getUserPlaylists,
  removeSongFromPlaylist,
  deletePlaylist,
} from "./playlist.controller";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { uploadImage } from "../../utils/multer";

const router = Router();

router.post("/", authMiddleware, uploadImage.single("coverImage"), createPlaylist);

router.post("/:id/songs", authMiddleware, addSongToPlaylist);

router.delete("/:id/songs/:songId", authMiddleware, removeSongFromPlaylist);

router.get("/:id", authMiddleware, getPlaylist);

router.delete("/:id", authMiddleware, deletePlaylist);

router.get("/", authMiddleware, getUserPlaylists);

export default router;
