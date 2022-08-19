import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { verify } from "argon2";
import { prisma } from "../../../server/db/client";
import { loginSchema } from "../../../schema/auth";
import { env } from "../../../server/env.mjs";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        try {
          const creds = await loginSchema.parseAsync(credentials);

          const user = await prisma.user.findFirst({
            where: { email: creds.email },
          });

          if (!user) {
            return null;
          }

          if (!user.password) {
            return  null;
          }

          const isValidPassword = await bcrypt.compare(
            creds.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }
          return await prisma.user.findFirst({
            where: { email: creds.email },
            select: {
              id: true,
              username: true,
              email: true,
              name: true,
            },
          });
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
  },
  jwt: {
    secret: env.NEXTAUTH_SECRET,
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
};
export default NextAuth(authOptions);
