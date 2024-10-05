/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `BodyMetrics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BodyMetrics_userId_date_key" ON "BodyMetrics"("userId", "date");
