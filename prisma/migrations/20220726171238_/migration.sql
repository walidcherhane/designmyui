/*
  Warnings:

  - You are about to drop the column `software` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `software`,
    ADD COLUMN `softwares` TEXT NULL;
