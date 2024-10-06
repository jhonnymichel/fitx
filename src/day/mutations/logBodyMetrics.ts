import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { getSameDayInUTC } from 'src/core/dateUtils'
import { z } from 'zod'

const BodyMetrics = z.object({
  weightInKilograms: z.number(),
  date: z.date(),
})

export default resolver.pipe(
  resolver.zod(BodyMetrics),
  resolver.authorize(),
  async function logBodyMetrics(data, ctx) {
    const { weightInKilograms, date } = data

    const normalizedDate = getSameDayInUTC(date)

    const goals = await db.userGoals.findFirstOrThrow({
      where: { userId: ctx.session.userId, completed: false },
      select: {
        id: true,
      },
    })

    return db.bodyMetrics.upsert({
      where: {
        uniqueDatePerUser: { date: normalizedDate, userId: ctx.session.userId },
      },
      create: {
        userId: ctx.session.userId,
        userGoalsId: goals.id,
        weightInKilograms,
        date: normalizedDate,
      },
      update: {
        weightInKilograms,
      },
    })
  }
)
