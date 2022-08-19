-- DropForeignKey
ALTER TABLE `savedposts` DROP FOREIGN KEY `SavedPosts_postId_fkey`;

-- AddForeignKey
ALTER TABLE `SavedPosts` ADD CONSTRAINT `SavedPosts_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
