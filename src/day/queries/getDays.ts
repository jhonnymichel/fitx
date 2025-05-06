import db, { Day } from 'db'
import { getSameDayInUTC, subtractDays } from '../../core/dateUtils'
import { z } from 'zod'
import { resolver } from '@blitzjs/rpc'

const GetDaysSchema = z.object({
  from: z.date(),
  last: z.number().min(1).max(31),
})

export default resolver.pipe(
  resolver.zod(GetDaysSchema),
  resolver.authorize(),
  async function getDays({ from, last }, ctx) {
    const normalizedFrom = getSameDayInUTC(from)
    const startRange = subtractDays(normalizedFrom, last)

    const normalizedDate = getSameDayInUTC(from)

    const days = await db.day.findMany({
      where: {
        date: { lte: normalizedDate, gt: startRange },
        userId: ctx.session.userId,
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

    return days
  }
)

export type DaysPayload = Array<Day>
