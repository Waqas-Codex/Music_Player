import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../modules/users/user.model";
import { prisma } from "../config/db";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;

    // Fetch user to get the latest role and details
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = {
      ...user,
      userId: user.id,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const user = (req as any).user;
    if (!user || (!roles.includes(user.role) && user.role !== Role.ADMIN)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};
