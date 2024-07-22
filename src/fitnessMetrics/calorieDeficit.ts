import { DayGoals, UserGoals } from 'db'

export function getCaloriesGoalType(goals: UserGoals | DayGoals | null): 'SUPERAVIT' | 'DEFICIT' {
  return goals?.foodCaloriesType === 'FLOOR' ? 'SUPERAVIT' : 'DEFICIT'
}

type CalorieDeficitParserConstructor = {
  caloriesBurned: number
  foodCalories: number
  goals: UserGoals | DayGoals | null
}

export function parseCalorieDeficit(metrics: CalorieDeficitParserConstructor) {
  const { caloriesBurned, foodCalories, goals } = metrics

  let deficit = caloriesBurned - foodCalories
  const goal = (goals?.caloriesBurned ?? 3000) - (goals?.foodCalories ?? 2300)
  let score = deficit / goal

  const goalType = getCaloriesGoalType(goals)

  if (goalType === 'SUPERAVIT') {
    deficit *= -1
    score *= -1
  }

  return { deficit, score, goal, goalType }
}
