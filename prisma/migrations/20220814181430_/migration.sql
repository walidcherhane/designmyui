/*
  Warnings:

  - You are about to drop the `_likedpoststopost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_likedpoststopost` DROP FOREIGN KEY `_LikedPostsToPost_A_fkey`;

-- DropForeignKey
ALTER TABLE `_likedpoststopost` DROP FOREIGN KEY `_LikedPostsToPost_B_fkey`;

-- DropIndex
DROP INDEX `LikedPosts_postId_key` ON `likedposts`;

-- DropTable
DROP TABLE `_likedpoststopost`;

-- AddForeignKey
ALTER TABLE `LikedPosts` ADD CONSTRAINT `LikedPosts_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
