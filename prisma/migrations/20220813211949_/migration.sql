/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `LikedPosts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `SavedPosts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LikedPosts_userId_postId_key` ON `LikedPosts`(`userId`, `postId`);

-- CreateIndex
CREATE UNIQUE INDEX `SavedPosts_userId_postId_key` ON `SavedPosts`(`userId`, `postId`);
