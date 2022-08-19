-- AlterTable
ALTER TABLE `user` ADD COLUMN `email_verified` DATETIME(3) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `username` VARCHAR(191) NULL;
