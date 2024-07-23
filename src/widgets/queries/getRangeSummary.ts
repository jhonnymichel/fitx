import { z } from 'zod'
import { NotFoundError } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { subtractDays } from 'src/days/dateUtils'

const GetRangeSummarySchema = z.object({
  from: z.date(),
  last: z.number().min(1).max(100),
})

export default resolver.pipe(
  resolver.zod(GetRangeSummarySchema),
  resolver.authorize(),
  async function getDay({ from, last }, ctx) {
    const activeGoals = await db.userGoals.findFirstOrThrow({
      where: {
        completed: false,
      },
    })

    const days = await db.day.findMany({
      where: {
        userId: ctx.session.userId,
        userGoalsId: activeGoals.id,
        date: { lte: from, gt: subtractDays(from, last) },
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

    return days.reduce(
      (summary, day) => {
        return {
          ...summary,
          caloriesBurned: summary.caloriesBurned + day.caloriesBurned,
          foodCalories: summary.foodCalories + day.foodCalories,
          foodCarbs: summary.foodCarbs + day.foodCarbs,
          foodFat: summary.foodFat + day.foodFat,
          foodProtein: summary.foodProtein + day.foodProtein,
        }
      },
      {
        dayCount: days.length,
        caloriesBurned: 0,
        foodCalories: 0,
        foodCarbs: 0,
        foodProtein: 0,
        foodFat: 0,
        currentGoals: activeGoals,
      }
    )
  }
)
