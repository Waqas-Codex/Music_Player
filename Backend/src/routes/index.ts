import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/user.routes";
import songRoutes from "../modules/songs/song.routes";
import playlistRoutes from "../modules/playlists/playlist.routes";
import favoriteRoutes from "../modules/favorites/favorite.routes";
import artistRoutes from "../modules/artists/artist.routes";
import express from "express";
import path from "path";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/artists", artistRoutes);

router.use("/songs", songRoutes);
router.use("/playlists", playlistRoutes);
router.use("/favorites", favoriteRoutes);

export default router;
