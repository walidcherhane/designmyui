-- DropForeignKey
ALTER TABLE `savedposts` DROP FOREIGN KEY `SavedPosts_postId_fkey`;

-- CreateTable
CREATE TABLE `_PostToSavedPosts` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PostToSavedPosts_AB_unique`(`A`, `B`),
    INDEX `_PostToSavedPosts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PostToSavedPosts` ADD CONSTRAINT `_PostToSavedPosts_A_fkey` FOREIGN KEY (`A`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PostToSavedPosts` ADD CONSTRAINT `_PostToSavedPosts_B_fkey` FOREIGN KEY (`B`) REFERENCES `SavedPosts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
