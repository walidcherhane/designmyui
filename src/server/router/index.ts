// src/server/router/indusers.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { exampleRouter } from "./users";
import { posts } from "./posts";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("users.", exampleRouter)
  .merge("posts.", posts)

// export type definition of API
export type AppRouter = typeof appRouter;
