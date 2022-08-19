/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `LikedPosts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `LikedPosts_postId_key` ON `LikedPosts`(`postId`);
