import { Router } from "express";
import {
  requestArtistRole,
  getMyRequestStatus,
  approveArtistRequest,
  getAllArtists,
  getArtistById,
} from "./artist.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import { Role } from "../users/user.model";

const router = Router();

// Public routes - list all artists
router.get("/", getAllArtists);

// User routes (must come before /:id to avoid conflicts)
router.post("/request", authMiddleware, requestArtistRole);
router.get("/my-status", authMiddleware, getMyRequestStatus);

// Admin routes (approve requests)
router.patch(
  "/:requestId/approve",
  authMiddleware,
  requireRole([Role.ADMIN]),
  approveArtistRequest,
);

// Public routes - get single artist (must be last to avoid matching named routes)
router.get("/:id", getArtistById);

export default router;
