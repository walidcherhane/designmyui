/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `SavedPosts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SavedPosts_postId_key` ON `SavedPosts`(`postId`);
