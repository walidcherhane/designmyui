/*
  Warnings:

  - Added the required column `software` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tags` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `software` TEXT NOT NULL,
    ADD COLUMN `tags` MEDIUMTEXT NOT NULL;
