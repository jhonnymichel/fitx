/*
  Warnings:

  - You are about to drop the column `goalId` on the `Day` table. All the data in the column will be lost.
  - You are about to drop the `DayGoals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DayGoals" DROP CONSTRAINT "DayGoals_dayId_fkey";

-- AlterTable
ALTER TABLE "Day" DROP COLUMN "goalId";

-- DropTable
DROP TABLE "DayGoals";
