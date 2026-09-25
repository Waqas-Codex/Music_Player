import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ token: result.token, user: result.user });
  } catch (error) {
    console.error("Registration error:", error);
    const message = error instanceof Error ? error.message : "Registration failed";
    const status = message === "User already exists" ? 409 : 500;
    res.status(status).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {     
    const result = await loginUser(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ token: result.token, user: result.user });
  } catch (error) {
    console.error("Login error:", error);
    const message = error instanceof Error ? error.message : "Login failed";
    res.status(401).json({
      error: message,
      message,
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};
