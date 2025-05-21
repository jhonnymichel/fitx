import { z } from 'zod'
import { NotFoundError } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { getSameDayInUTC, subtractDays } from 'src/core/dateUtils'
import { parseCalorieDeficit } from 'src/fitnessMetrics/calorieDeficit'
import { parseMacros } from 'src/fitnessMetrics/macros'

const GetRangeScoresSchema = z.object({
  from: z.date(),
  last: z.number().min(1).max(100),
})

export default resolver.pipe(
  resolver.zod(GetRangeScoresSchema),
  resolver.authorize(),
  async function getRangeDailyScores({ from, last }, ctx) {
    const normalizedFrom = getSameDayInUTC(from)

    const activeGoals = await db.userGoals.findFirstOrThrow({
      where: {
        userId: ctx.session.userId,
        completed: false,
      },
    })

    const days = await db.day.findMany({
      where: {
        userId: ctx.session.userId,
        userGoalsId: activeGoals.id,
        date: { lte: normalizedFrom, gt: subtractDays(normalizedFrom, last) },
      },
      select: {
        date: true,
        caloriesBurned: true,
        foodCalories: true,
        foodCarbs: true,
        foodProtein: true,
        foodFat: true,
        goals: true,
      },
    })

    if (!days.length) throw new NotFoundError()

    return days.map((day) => {
      return {
        day,
        scores: {
          calories: parseCalorieDeficit({
            caloriesBurned: day.caloriesBurned,
            foodCalories: day.foodCalories,
            goals: day.goals,
          }),
          macros: parseMacros({
            foodCarbs: day.foodCarbs,
            foodFat: day.foodFat,
            foodProtein: day.foodProtein,
            goals: day.goals,
          }),
        },
      }
    })
  }
)
