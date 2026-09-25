import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { RegisterDTO, LoginDTO } from "./auth.types";
import { findUserByEmail, findUserByEmailWithPassword, createUser } from "./auth.dao";
import { generateAuthToken } from "../../utils/jwt";

const generateToken = generateAuthToken;

const removePassword = (user: any) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const registerUser = async (data: RegisterDTO) => {
  const email = data.email.trim().toLowerCase();
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  let user;

  try {
    user = await createUser({
      name: data.name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("User already exists");
    }

    throw error;
  }

  const token = generateToken(user.id, user.role);

  const safeUser = removePassword(user);

  return {
    user: safeUser,
    token,
  };
};

export const loginUser = async (data: LoginDTO) => {
  const email = data.email.trim().toLowerCase();
  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id, user.role);

  const safeUser = removePassword(user);

  return {
    user: safeUser,
    token,
  };
};
