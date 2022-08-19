/*
  Warnings:

  - You are about to drop the `likedposts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `likedposts` DROP FOREIGN KEY `LikedPosts_postId_fkey`;

-- DropForeignKey
ALTER TABLE `likedposts` DROP FOREIGN KEY `LikedPosts_userId_fkey`;

-- DropTable
DROP TABLE `likedposts`;
