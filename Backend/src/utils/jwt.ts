import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateAuthToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: "7d" });
};
