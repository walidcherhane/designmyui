-- DropForeignKey
ALTER TABLE `likedposts` DROP FOREIGN KEY `LikedPosts_postId_fkey`;

-- CreateTable
CREATE TABLE `_LikedPostsToPost` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_LikedPostsToPost_AB_unique`(`A`, `B`),
    INDEX `_LikedPostsToPost_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_LikedPostsToPost` ADD CONSTRAINT `_LikedPostsToPost_A_fkey` FOREIGN KEY (`A`) REFERENCES `LikedPosts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LikedPostsToPost` ADD CONSTRAINT `_LikedPostsToPost_B_fkey` FOREIGN KEY (`B`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
