-- DropForeignKey
ALTER TABLE `savedposts` DROP FOREIGN KEY `SavedPosts_userId_fkey`;

-- CreateTable
CREATE TABLE `_SavedPostsToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SavedPostsToUser_AB_unique`(`A`, `B`),
    INDEX `_SavedPostsToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_SavedPostsToUser` ADD CONSTRAINT `_SavedPostsToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `SavedPosts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SavedPostsToUser` ADD CONSTRAINT `_SavedPostsToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
