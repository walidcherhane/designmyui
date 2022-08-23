import { NewPostSchema } from "../../schema/post";
import { createRouter } from "./context";
import cloudinary from "../../lib/cloudinary";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
export const posts = createRouter()
  .query("allPosts", {
    input: z.object({
      search: z.string().optional(),
    }),
    resolve: async ({ ctx, input }) => {
      try {
        if (input.search?.length) {
          // fetch all posts that match the search query
          return await ctx.prisma.post.findMany({
            where: {
              AND: [
                {
                  isPrivate: false,
                },
                {
                  OR: [
                    {
                      author: {
                        name: {
                          contains: input.search,
                        },
                      },
                    },
                    {
                      title: {
                        contains: input.search,
                      },
                    },
                    {
                      softwares: {
                        contains: input.search,
                      },
                    },
                    {
                      tags: {
                        contains: input.search,
                      },
                    },
                  ],
                },
              ],
            },
          });
        }
        const posts = await ctx.prisma.post.findMany({
          where: {
            isPrivate: false,
          },
        });
        return posts;
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          cause: error,
        });
      }
    },
  })
  .query("post", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      const postAuhthor = await ctx.prisma.user.findFirst({
        where: {
          Posts: {
            some: {
              id: input.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      return await ctx.prisma.post.findFirst({
        where:
          postAuhthor?.id === ctx.user?.id
            ? {
                id: input.id,
              }
            : {
                id: input.id,
                isPrivate: false,
              },
        include: {
          author: {
            include: {
              Profile: true,
              Posts: true,
            },
          },
          LikedPosts: {
            include: {
              user: {
                include: {
                  Profile: true,
                },
              },
            },
          },
        },
      });
    },
  })
  .query("likedPosts", {
    resolve: async ({ ctx }) => {
      if (!ctx.user) {
        return [];
      }
      return await ctx.prisma.likedPosts.findMany({
        where: { userId: ctx.user?.id },
      });
    },
  })
  .query("savedPosts", {
    resolve: async ({ ctx }) => {
      if (!ctx.user) {
        return [];
      }
      return await ctx.prisma.savedPosts.findMany({
        where: { userId: ctx.user?.id },
      });
    },
  })
  .mutation("newPost", {
    input: NewPostSchema,
    resolve: async ({ input, ctx }) => {
      try {
        const { secure_url } = await cloudinary.uploader.upload(
          input.image as string,
          { folder: "posts_thumbnails" }
        );
        const postData = {
          title: input.title,
          tags: input.tags.join(","),
          softwares: input.softwares.join(","),
          isPrivate: input.isPrivate ?? false,
          image: secure_url,
          authorId: ctx.user?.id as string,
        };
        const post = await ctx.prisma.post.create({
          data: postData,
        });
        return post;
      } catch (error: any) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
          cause: error,
        });
      }
    },
  })
  .mutation("updatePost", {
    input: z.object({
      id: z.string(),
      title: z.string(),
      tags: z.array(z.string()),
      softwares: z.array(z.string()),
      isPrivate: z.boolean().optional(),
      image: z.any(),
    }),
    resolve: async ({ input, ctx }) => {
      let postData: any = {};
      try {
        const targetPost = await ctx.prisma.post.findUnique({
          where: { id: input.id },
        });
        if (!targetPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        if (targetPost.authorId !== ctx.user?.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to update this post",
          });
        }

        if (input.image) {
          const imageId = targetPost.image.split("/").pop()?.split(".")[0];
          if (imageId) {
            await cloudinary.uploader.destroy(`posts_thumbnails/${imageId}`);
          }
          // upload new image
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            input.image[0].thumbUrl as string,
            { folder: "posts_thumbnails" }
          );
          postData.image = `${secure_url}?id=${public_id}`;
        }

        postData = {
          ...postData,
          title: input.title,
          tags: input.tags.join(","),
          softwares: input.softwares.join(","),
          isPrivate: input.isPrivate ?? false,
          authorId: ctx.user?.id as string,
        };
        for (const key in postData) {
          if (postData[key] === undefined) {
            delete postData[key];
          }
        }

        const post = await ctx.prisma.post.update({
          where: { id: input.id },
          data: postData,
        });
        return post;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error.message;
        }

        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sorry, an internal error has occurred",
          cause: error,
        });
      }
    },
  })
  .mutation("deletePost", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        const targetPost = await ctx.prisma.post.findUnique({
          where: { id: input.id },
        });
        if (!targetPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        if (targetPost.authorId !== ctx.user?.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to delete this post",
          });
        }
        const imageId = targetPost.image.split("/").pop()?.split(".")[0];
        if (!imageId) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
        await cloudinary.uploader.destroy(`posts_thumbnails/${imageId}`);

        const post = await ctx.prisma.post.delete({
          where: { id: input.id },
        });
        return post;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error.message;
        }

        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sorry, an internal error has occurred",
          cause: error,
        });
      }
    },
  })
  .mutation("savePost", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        const targetPost = await ctx.prisma.post.findUnique({
          where: { id: input.id },
        });
        if (!targetPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Please login to save this post",
          });
        }

        const isSaved = await ctx.prisma.savedPosts.findFirst({
          where: {
            userId: ctx.user?.id,
            postId: input.id,
          },
        });

        if (isSaved) {
          await ctx.prisma.savedPosts.deleteMany({
            where: {
              AND: [
                {
                  userId: ctx.user?.id,
                },
                {
                  postId: input.id,
                },
              ],
            },
          });
        } else {
          await ctx.prisma.savedPosts.create({
            data: {
              userId: ctx.user.id,
              postId: input.id,
            },
          });
        }

        return await ctx.prisma.savedPosts.findFirst({
          where: {
            userId: ctx.user.id,
            postId: input.id,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error.message;
        }

        console.log(error);
      }
    },
  })
  .mutation("likePost", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ input, ctx }) => {
      try {
        const targetPost = await ctx.prisma.post.findUnique({
          where: { id: input.id },
        });
        if (!targetPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Please login to like this post",
          });
        }

        const isLiked = await ctx.prisma.likedPosts.findFirst({
          where: {
            userId: ctx.user?.id,
            postId: input.id,
          },
        });

        if (isLiked) {
          await ctx.prisma.likedPosts.deleteMany({
            where: {
              AND: [
                {
                  userId: ctx.user?.id,
                },
                {
                  postId: input.id,
                },
              ],
            },
          });
        } else {
          await ctx.prisma.likedPosts.create({
            data: {
              userId: ctx.user.id,
              postId: input.id,
            },
          });
        }

        return await ctx.prisma.likedPosts.findFirst({
          where: {
            userId: ctx.user.id,
            postId: input.id,
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error.message;
        }
        console.log(error);
      }
    },
  });
