-- AlterTable
ALTER TABLE "DayGoals" ADD COLUMN     "caloriesBurned" INTEGER NOT NULL DEFAULT 3000,
ADD COLUMN     "caloriesBurnedType" "GoalType" NOT NULL DEFAULT 'FLOOR';
