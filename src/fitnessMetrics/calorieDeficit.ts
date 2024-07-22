import { DayGoals, UserGoals } from 'db'

export function getCaloriesGoalType(goals: UserGoals | DayGoals | null) {
  return goals?.foodCaloriesType === 'FLOOR' ? 'SUPERAVIT' : 'DEFICIT'
}

export function parseCalorieDeficit(
  caloriesBurned: number,
  foodCalories: number,
  goals: UserGoals | DayGoals | null
) {
  let deficit = caloriesBurned - foodCalories
  const goal = (goals?.caloriesBurned ?? 3000) - (goals?.foodCalories ?? 2300)
  let score = deficit / goal

  const goalType = getCaloriesGoalType(goals)

  if (goalType === 'SUPERAVIT') {
    deficit *= -1
    score *= -1
  }

  return { deficit, score, goal }
}
