import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { uploadImage } from "../../utils/multer";

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateMyAvatar = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id || authUser.userId },
      data: { avatarUrl },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile image updated",
      user: {
        ...updatedUser,
        userId: updatedUser.id,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile image" });
  }
};

export { uploadImage };
