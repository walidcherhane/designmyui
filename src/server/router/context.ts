// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db/client";
import { getUserFromRequest } from "../helpers/auth";

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const user = await getUserFromRequest(req);
  return {
    req,
    res,
    prisma,
    user,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
