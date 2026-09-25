import { Router } from "express";
import { getMe, updateMyAvatar, uploadImage } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.put("/me/avatar", authMiddleware, uploadImage.single("avatar"), updateMyAvatar);

export default router;
