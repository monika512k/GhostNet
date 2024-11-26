/*
  Warnings:

  - You are about to drop the column `reminderAt` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `reminderTime` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "reminderAt",
ADD COLUMN     "reminderTime" TIMESTAMP(3) NOT NULL;
