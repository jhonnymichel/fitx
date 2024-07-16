-- AlterTable
ALTER TABLE "UserGoals" ADD COLUMN     "caloriesBurned" INTEGER NOT NULL DEFAULT 3000,
ADD COLUMN     "caloriesBurnedType" "GoalType" NOT NULL DEFAULT 'FLOOR';
