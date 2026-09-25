import { prisma } from "../../config/db";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, avatarUrl: true },
  });
};
