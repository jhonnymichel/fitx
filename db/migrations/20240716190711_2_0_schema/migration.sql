-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('CEILING', 'FLOOR', 'EXACT');

-- AlterTable
ALTER TABLE "Day" ADD COLUMN     "caloriesBurned" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "foodCarbs" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "foodFat" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "foodProtein" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalId" INTEGER;

-- CreateTable
CREATE TABLE "UserGoals" (
    "id" SERIAL NOT NULL,
    "foodCalories" INTEGER NOT NULL DEFAULT 2300,
    "foodProtein" INTEGER NOT NULL DEFAULT 150,
    "foodCarbs" INTEGER NOT NULL DEFAULT 250,
    "foodFat" INTEGER NOT NULL DEFAULT 100,
    "foodCaloriesType" "GoalType" NOT NULL DEFAULT 'CEILING',
    "foodProteinType" "GoalType" NOT NULL DEFAULT 'FLOOR',
    "foodCarbsType" "GoalType" NOT NULL DEFAULT 'CEILING',
    "foodFatType" "GoalType" NOT NULL DEFAULT 'CEILING',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserGoals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayGoals" (
    "id" SERIAL NOT NULL,
    "foodCalories" INTEGER NOT NULL DEFAULT 2300,
    "foodProtein" INTEGER NOT NULL DEFAULT 150,
    "foodCarbs" INTEGER NOT NULL DEFAULT 250,
    "foodFat" INTEGER NOT NULL DEFAULT 100,
    "foodCaloriesType" "GoalType" NOT NULL DEFAULT 'CEILING',
    "foodProteinType" "GoalType" NOT NULL DEFAULT 'FLOOR',
    "foodCarbsType" "GoalType" NOT NULL DEFAULT 'CEILING',
    "foodFatType" "GoalType" NOT NULL DEFAULT 'CEILING',
    "dayId" INTEGER NOT NULL,

    CONSTRAINT "DayGoals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGoals_userId_key" ON "UserGoals"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DayGoals_dayId_key" ON "DayGoals"("dayId");

-- AddForeignKey
ALTER TABLE "UserGoals" ADD CONSTRAINT "UserGoals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayGoals" ADD CONSTRAINT "DayGoals_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM "User"
    LOOP
        INSERT INTO "UserGoals" ("foodCalories", "foodProtein", "foodCarbs", "foodFat", "foodCaloriesType", "foodProteinType", "foodCarbsType", "foodFatType", "userId")
        VALUES (2300, 150, 250, 100, 'CEILING', 'FLOOR', 'CEILING', 'CEILING', user_record.id);
    END LOOP;
END $$;