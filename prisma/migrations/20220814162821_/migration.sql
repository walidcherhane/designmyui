/*
  Warnings:

  - You are about to drop the `_savedpoststouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_savedpoststouser` DROP FOREIGN KEY `_SavedPostsToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_savedpoststouser` DROP FOREIGN KEY `_SavedPostsToUser_B_fkey`;

-- DropIndex
DROP INDEX `SavedPosts_userId_key` ON `savedposts`;

-- DropTable
DROP TABLE `_savedpoststouser`;

-- AddForeignKey
ALTER TABLE `SavedPosts` ADD CONSTRAINT `SavedPosts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
