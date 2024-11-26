/*
  Warnings:

  - You are about to drop the column `isNotified` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `reminderTime` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `reminderAt` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Reminder` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "isNotified",
DROP COLUMN "reminderTime",
DROP COLUMN "updatedAt",
ADD COLUMN     "reminderAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;
