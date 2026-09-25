import { Request, Response } from "express";
import { RequestStatus } from "./artist.model";
import { Role } from "../users/user.model";
import { generateAuthToken } from "../../utils/jwt";
import { prisma } from "../../config/db";

const activateArtist = async (userId: string, requestId: string) => {
  await prisma.artistRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" },
  });
  await prisma.user.update({ where: { id: userId }, data: { role: "ARTIST" } });

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, avatarUrl: true },
  });
  if (!updatedUser) {
    throw new Error("User not found");
  }

  const token = generateAuthToken(updatedUser.id, Role.ARTIST);

  return { updatedUser, token };
};

export const requestArtistRole = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const currentUser = (req as any).user;
    const { stageName, bio } = req.body;

    if (currentUser.role === Role.ARTIST || currentUser.role === Role.ADMIN) {
      return res.status(400).json({ message: "You are already an artist." });
    }

    const existingRequest = await prisma.artistRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (existingRequest?.status === RequestStatus.APPROVED) {
      return res.status(400).json({ message: "You are already an artist." });
    }

    if (existingRequest?.status === RequestStatus.PENDING) {
      const { updatedUser, token } = await activateArtist(userId, existingRequest.id);

      return res.status(200).json({
        message: "Artist profile activated!",
        request: existingRequest,
        token,
        user: updatedUser,
      });
    }

    const newRequest = await prisma.artistRequest.create({
      data: { userId, stageName, bio, status: "APPROVED" },
    });

    const { updatedUser, token } = await activateArtist(userId, newRequest.id);

    res.status(201).json({
      message: "Artist profile activated!",
      request: newRequest,
      token,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error creating artist request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyRequestStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.userId;
    const request = await prisma.artistRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!request) {
      return res.status(200).json({ hasRequest: false });
    }

    res.status(200).json({ hasRequest: true, status: request.status, request });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const approveArtistRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const requestId = Array.isArray(req.params.requestId)
      ? req.params.requestId[0]
      : req.params.requestId;

    const request = await prisma.artistRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const { updatedUser, token } = await activateArtist(request.userId, request.id);

    res.status(200).json({
      message: "Artist request approved.",
      user: updatedUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllArtists = async (req: Request, res: Response): Promise<any> => {
  try {
    const artists = await prisma.user.findMany({
      where: { role: "ARTIST" },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    });
    res.status(200).json({ artists });
  } catch (error) {
    console.error("Error fetching artists:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getArtistById = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const artist = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    });

    if (!artist || artist.role !== Role.ARTIST) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json({ artist });
  } catch (error) {
    console.error("Error fetching artist:", error);
    res.status(500).json({ message: "Server error" });
  }
};
