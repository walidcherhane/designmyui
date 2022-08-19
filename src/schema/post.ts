import * as z from "zod";

export const NewPostSchema = z.object({
  title: z.string(),
  image: z.any(),
  softwares: z.array(z.string()),
  tags: z.array(z.string()),
  isPrivate: z.boolean().default(false),
});

export type IPost = z.infer<typeof NewPostSchema>;
