import { prisma } from "../../config/db";
import { RegisterDTO } from "./auth.types";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByEmailWithPassword = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const createUser = async (data: RegisterDTO & { password: string }) => {
  return prisma.user.create({
    data: { name: data.name, email: data.email, password: data.password },
  });
};
