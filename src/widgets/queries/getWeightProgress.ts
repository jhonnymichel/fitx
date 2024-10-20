import { z } from 'zod'
import { NotFoundError } from 'blitz'
import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { getSameDayInUTC, subtractDays } from 'src/core/dateUtils'

const getWeightProgressSchema = z.object({
  from: z.date(),
  last: z.number().min(1).max(100),
})

export default resolver.pipe(
  resolver.zod(getWeightProgressSchema),
  resolver.authorize(),
  async function getDay({ from, last }, ctx) {
    const normalizedFrom = getSameDayInUTC(from)

    const currentGoals = await db.userGoals.findFirstOrThrow({
      where: {
        userId: ctx.session.userId,
        completed: false,
      },
    })

    const weightByDay = await db.bodyMetrics.findMany({
      where: {
        userId: ctx.session.userId,
        userGoalsId: currentGoals.id,
        date: { lte: normalizedFrom, gt: subtractDays(normalizedFrom, last) },
      },
      orderBy: { date: 'asc' },
      select: { weightInKilograms: true, date: true },
    })

    if (!weightByDay.length) throw new NotFoundError()

    return {
      weightByDay,
      dayCount: weightByDay.length,
      progress:
        weightByDay[weightByDay.length - 1].weightInKilograms - weightByDay[0].weightInKilograms,
      currentGoals,
    }
  }
)
