import { createRouter } from "./context";
import * as trpc from "@trpc/server";
import { hash } from "argon2";
import { signUpSchema } from "../../schema/auth";
import { z } from "zod";
import imagekit from "../../lib/imageKit";
import bcrypt from "bcryptjs";

export const exampleRouter = createRouter()
  .query("me", {
    async resolve({ ctx }) {
      const user = ctx.user;
      if (!user) return null;
      return await ctx.prisma.user.findUnique({
        where: { id: user?.id },
        include: {
          Profile: true,
        },
      });
    },
  })
  .query("user", {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ input, ctx }) {
      const targetUser = await ctx.prisma.user.findUnique({
        where: { username: input.username },
        include: {
          Profile: true,
        },
      });
      if (!targetUser) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (!targetUser.Profile) {
        await ctx.prisma.profile.create({
          data: {
            userId: targetUser.id,
            avatar: targetUser.image as string,
          },
        });
      }

      return await ctx.prisma.user.findUnique({
        where: { username: input.username },
        include: {
          Profile: true,
          SavedPosts:
            targetUser.id !== ctx.user?.id
              ? {
                  where: {
                    post: {
                      isPrivate: false,
                    },
                  },
                }
              : true,
          LikedPosts:
            targetUser.id !== ctx.user?.id
              ? {
                  where: {
                    post: {
                      isPrivate: false,
                    },
                  },
                }
              : true,
          Posts:
            targetUser.id !== ctx.user?.id
              ? {
                  where: {
                    isPrivate: false,
                  },
                }
              : true,
        },
      });
    },
  })
  .mutation("signup", {
    input: signUpSchema,
    resolve: async ({ input, ctx }) => {
      const { username, email, password } = input;

      try {
        const exists = await ctx.prisma.user.findFirst({
          where: { email },
        });

        if (exists) {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "User already exists.",
          });
        }

        const hashedPassword = await hash(password);

        const result = await ctx.prisma.user.create({
          data: { username, email, password: hashedPassword, name: username },
        });
        await ctx.prisma.profile.create({
          data: {
            userId: result.id,
          },
        });
        return {
          status: 201,
          message: "Account created successfully",
          result: result.email,
        };
      } catch (error: any) {
        // check if the error from prisma
        if (error.code === "CONFLICT") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "User already exists",
            cause: error,
          });
        }
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    },
  })
  .query("requestUserData", {
    resolve: async ({ ctx }) => {
      const user = ctx.user;
      if (!user) return null;

      return {
        hasOldPassword: !!user.password,
      };
    },
  })
  .mutation("createProfile", {
    input: z.object({
      username: z.string(),
      banner: z.string().optional(),
      bio: z.string().optional(),
      avatar: z.string().optional(),
    }),
    resolve: async ({ input, ctx }) => {
      const { username, banner, bio, avatar } = input;
      try {
        const user = ctx.user;
        if (!user) {
          throw new trpc.TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to perform this action",
          });
        }
        if (banner) {
          // upload banner to imagekit
          const uploadResult = await imagekit.upload({
            file: banner,
            fileName: `${ctx.user?.name}'s banner`,
          });
          input.banner = uploadResult.url;
          console.log(banner, uploadResult);
        }
        if (avatar) {
          // upload banner to imagekit
          const uploadResult = await imagekit.upload({
            file: avatar,
            fileName: `${ctx.user?.name}'s avatar`,
          });
          input.avatar = uploadResult.url;
          console.log(avatar, uploadResult);
        }

        const result = await ctx.prisma.profile.create({
          data: {
            userId: user.id,
            banner: input.banner,
            bio,
            avatar,
          },
        });
        if (username) {
          await ctx.prisma.user.update({
            where: { id: user.id },
            data: { username },
          });
        }
        return {
          status: 201,
          message: "Profile created successfully",
          result: result,
        };
      } catch (error) {
        if (error instanceof trpc.TRPCError) {
          throw error.message;
        }
        console.log(error);

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    },
  })
  .mutation("updateProfile", {
    input: z.object({
      banner: z.any().optional(),
      bio: z.string().optional(),
      avatar: z.any().optional(),
      name: z.string().optional(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        const user = ctx.user;
        if (!user) {
          throw new trpc.TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to perform this action",
          });
        }
        if (input.banner) {
          if (user.Profile?.banner) {
            const bannerUrl = new URL(user.Profile?.banner).searchParams;
            const bannerId = bannerUrl.get("id");
            if (bannerId) {
              await imagekit.deleteFile(bannerId);
            }
          }
          const uploadResult = await imagekit.upload({
            file: input.banner,
            fileName: `${ctx.user?.name}'s banner`,
          });
          input.banner = `${uploadResult.url}?id=${uploadResult.fileId}`;
        }
        if (input.avatar) {
          if (user.Profile?.avatar) {
            const avatarUrl = new URL(user.Profile?.avatar as string)
              .searchParams;
            const avatarId = avatarUrl.get("id");
            if (avatarId) {
              await imagekit.deleteFile(avatarId);
            }
          }
          const uploadResult = await imagekit.upload({
            file: input.avatar,
            fileName: `${ctx.user?.name}'s avatar`,
          });
          input.avatar = `${uploadResult.url}?id=${uploadResult.fileId}`;
        }

        await ctx.prisma.profile.update({
          where: { userId: user.id },
          data: {
            banner: input.banner?.length ? input.banner : user.Profile?.banner,
            bio: input.bio?.length! > 4 ? input.bio : user.Profile?.bio,
            avatar: input.avatar?.length ? input.avatar : user.Profile?.avatar,
          },
        });
        await ctx.prisma.user.update({
          where: { id: user.id },
          data: { name: input.name },
        });
        return await ctx.prisma.user.findUnique({
          where: { id: user.id },
        });
      } catch (error) {
        console.log(error);
        if (error instanceof trpc.TRPCError) {
          throw error.message;
        }

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    },
  })
  .mutation("updatePassword", {
    input: z.object({
      oldPassword: z.string().optional(),
      newPassword: z.string(),
      confirmPassword: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        const user = ctx.user;
        if (!user) {
          throw new trpc.TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to perform this action",
          });
        }
        const { oldPassword, newPassword, confirmPassword } = input;
        if (user.password) {
          if (!oldPassword) {
            throw new trpc.TRPCError({
              code: "BAD_REQUEST",
              message: "Please provide current password",
            });
          }
          const isValidOldPassword = await bcrypt.compare(
            oldPassword,
            user.password
          );
          if (!isValidOldPassword) {
            throw new trpc.TRPCError({
              code: "UNAUTHORIZED",
              message: "Password is incorrect",
            });
          }
        }
        if (newPassword !== confirmPassword) {
          throw new trpc.TRPCError({
            code: "UNAUTHORIZED",
            message: "Passwords do not match",
          });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const result = await ctx.prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
        return {
          status: 201,
          message: "Password updated successfully",
          result: result,
        };
      } catch (error) {
        if (error instanceof trpc.TRPCError) {
          throw error.message;
        }

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    },
  })
  .mutation("deleteAccount", {
    input: z.object({
      confirmation: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      try {
        const user = ctx.user;

        if (!user) {
          throw new trpc.TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to perform this action",
          });
        }

        const canDelete = input.confirmation === "delete my account";
        if (!canDelete) {
          throw new trpc.TRPCError({
            code: "UNAUTHORIZED",
            message: "Please enter 'delete my account' to confirm",
          });
        }

        if (user.Profile?.banner) {
          const bannerUrl = new URL(user.Profile?.banner).searchParams;
          const bannerId = bannerUrl.get("id");
          if (bannerId) {
            await imagekit.deleteFile(bannerId);
          }
        }
        if (user.Profile?.avatar) {
          const avatarUrl = new URL(user.Profile?.avatar as string)
            .searchParams;
          const avatarId = avatarUrl.get("id");
          if (avatarId) {
            await imagekit.deleteFile(avatarId);
          }
        }

        await ctx.prisma.user.delete({
          where: { id: user.id },
        });
        return {
          message: "Account deleted successfully",
        };
      } catch (error) {
        if (error instanceof trpc.TRPCError) {
          throw error.message;
        }

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
          cause: error,
        });
      }
    },
  });
