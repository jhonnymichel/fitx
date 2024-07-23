import { GoalType, UserGoals } from 'db'

export function calculateMacroPercentages(carbs: number, protein: number, fat: number) {
  // Caloric values per gram
  const caloriesPerGramCarbs = 4
  const caloriesPerGramProtein = 4
  const caloriesPerGramFat = 9

  // Calculate total calories for each macronutrient
  const totalCaloriesCarbs = carbs * caloriesPerGramCarbs
  const totalCaloriesProtein = protein * caloriesPerGramProtein
  const totalCaloriesFat = fat * caloriesPerGramFat

  // Calculate total caloric intake
  const totalCalories = totalCaloriesCarbs + totalCaloriesProtein + totalCaloriesFat

  // Calculate percentage of total calories for each macronutrient
  const carbsPercentage = (totalCaloriesCarbs / totalCalories) * 100
  const proteinPercentage = (totalCaloriesProtein / totalCalories) * 100
  const fatPercentage = (totalCaloriesFat / totalCalories) * 100

  return {
    carbsPercentage: Number(carbsPercentage.toFixed(2)),
    proteinPercentage: Number(proteinPercentage.toFixed(2)),
    fatPercentage: Number(fatPercentage.toFixed(2)),
  }
}

type MacroParserConstructor = {
  foodFat: number
  foodProtein: number
  foodCarbs: number
  goals: UserGoals | null
}

export type ParsedMacro = ReturnType<typeof parseMacros>['carbs']

export function parseMacros(macros: MacroParserConstructor) {
  const { foodFat, foodProtein, foodCarbs, goals } = macros

  const carbs = {
    value: foodCarbs,
    goalType: goals?.foodCarbsType ?? 'CEILING',
    goal: goals?.foodCarbs ?? 0,
  }

  const fat = {
    value: foodFat,
    goalType: goals?.foodFatType ?? 'CEILING',
    goal: goals?.foodFat ?? 0,
  }

  const protein = {
    value: foodProtein,
    goalType: goals?.foodProteinType ?? 'FLOOR',
    goal: goals?.foodProtein ?? 0,
  }

  return {
    carbs: {
      ...carbs,
      score: scoreMacro(carbs.value, carbs.goal, carbs.goalType),
    },
    fat: {
      ...fat,
      score: scoreMacro(fat.value, fat.goal, fat.goalType),
    },
    protein: {
      ...protein,
      score: scoreMacro(protein.value, protein.goal, protein.goalType),
    },
  }
}

function scoreMacro(value: number, goal: number, goalType: GoalType) {
  let score = 0
  if (goalType === 'CEILING') {
    score = value / goal
  }

  if (goalType === 'FLOOR') {
    score = goal / value
  }

  return score
}
