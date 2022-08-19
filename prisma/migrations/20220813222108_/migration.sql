/*
  Warnings:

  - You are about to drop the `_posttosavedposts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_posttosavedposts` DROP FOREIGN KEY `_PostToSavedPosts_A_fkey`;

-- DropForeignKey
ALTER TABLE `_posttosavedposts` DROP FOREIGN KEY `_PostToSavedPosts_B_fkey`;

-- DropIndex
DROP INDEX `SavedPosts_postId_key` ON `savedposts`;

-- DropTable
DROP TABLE `_posttosavedposts`;

-- AddForeignKey
ALTER TABLE `SavedPosts` ADD CONSTRAINT `SavedPosts_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
