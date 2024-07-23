-- Step 1: Create a temporary column to hold the default user goal
ALTER TABLE "Day" ADD COLUMN "temp_userGoalsId" INTEGER;

-- Step 2: Update the temporary column with the first goal of the user for each day
UPDATE "Day" 
SET "temp_userGoalsId" = (
  SELECT "id"
  FROM "UserGoals"
  WHERE "UserGoals"."userId" = "Day"."userId"
  ORDER BY "UserGoals"."id"
  LIMIT 1
);

-- Step 3: Ensure that all rows have a non-null value in the temporary column
-- For days without a user goal, set a default goal (if necessary, create a default user goal)
UPDATE "Day"
SET "temp_userGoalsId" = (
  SELECT "id"
  FROM "UserGoals"
  WHERE "UserGoals"."userId" = "Day"."userId"
  ORDER BY "UserGoals"."id"
  LIMIT 1
)
WHERE "temp_userGoalsId" IS NULL;

-- Step 4: Add the new column with NOT NULL constraint and set it with a default value from the temporary column
ALTER TABLE "Day" ADD COLUMN "userGoalsId" INTEGER NOT NULL DEFAULT 0;

-- Step 5: Copy the values from the temporary column to the new column
UPDATE "Day" SET "userGoalsId" = "temp_userGoalsId";

-- Step 6: Remove the default value and drop the temporary column
ALTER TABLE "Day" ALTER COLUMN "userGoalsId" DROP DEFAULT;
ALTER TABLE "Day" DROP COLUMN "temp_userGoalsId";

-- Step 7: Add the foreign key constraint
ALTER TABLE "Day" ADD CONSTRAINT "Day_userGoalsId_fkey" FOREIGN KEY ("userGoalsId") REFERENCES "UserGoals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 8: Delete all records from the DayGoals table
DELETE FROM "DayGoals";