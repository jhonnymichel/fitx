-- Step 1: Add the new column as nullable
ALTER TABLE "BodyMetrics" ADD COLUMN "userGoalsId" INTEGER;

-- Step 2: Update existing BodyMetrics rows with the latest UserGoals for each user
WITH latest_goals AS (
  SELECT "id" as "userGoalsId", "userId"
  FROM "UserGoals"
  WHERE "completed" = false 
  AND "id" IN (SELECT MAX("id") FROM "UserGoals" GROUP BY "userId")
)
UPDATE "BodyMetrics" bm
SET "userGoalsId" = lg."userGoalsId"
FROM latest_goals lg
WHERE bm."userId" = lg."userId";

-- Step 3: Alter the column to be NOT NULL now that all records are updated
ALTER TABLE "BodyMetrics" ALTER COLUMN "userGoalsId" SET NOT NULL;

-- Step 4: Add the foreign key constraint
ALTER TABLE "BodyMetrics" ADD CONSTRAINT "BodyMetrics_userGoalsId_fkey" FOREIGN KEY ("userGoalsId") REFERENCES "UserGoals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
