import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils";
import { prisma } from "../db/client";

export const getUserFromRequest = async (req: NextApiRequest) => {
  const user = await getToken({ req });
  if (!user?.email) {
    return null;
  }
  return await getUserFromEmail(user.email);
};

export const getUserFromEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      Profile: true,
    },
  });

  if (!user) {
    return null;
  }

  if (!user.username) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: user.name.split(" ").join("").toLocaleLowerCase(),
      },
    });
  }
  if (!user.Profile) {
    await prisma.profile.create({
      data: {
        userId: user.id,
        avatar: user.image || undefined,
      },
    });
  }

  return user;
};
