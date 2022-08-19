/*
  Warnings:

  - You are about to drop the column `email_verified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profile` MODIFY `avatar` VARCHAR(191) NOT NULL DEFAULT 'https://ik.imagekit.io/buw7k7rvw40/avatar_p0Wyeh2b_.svg',
    MODIFY `banner` VARCHAR(191) NOT NULL DEFAULT 'https://ik.imagekit.io/buw7k7rvw40/user_header_ztdMQDSVg.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1648647216517';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `email_verified`;
