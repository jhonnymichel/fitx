import { UserGoals } from 'db'

export function getCaloriesGoalType(goals: UserGoals | null): 'SUPERAVIT' | 'DEFICIT' {
  return goals?.foodCaloriesType === 'FLOOR' ? 'SUPERAVIT' : 'DEFICIT'
}

export function getCaloriesGoalLabel(goals: UserGoals | null) {
  return getCaloriesGoalType(goals) === 'DEFICIT' ? 'Deficit' : 'Superavit'
}

type CalorieDeficitParserConstructor = {
  caloriesBurned: number
  foodCalories: number
  goals: UserGoals | null
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
