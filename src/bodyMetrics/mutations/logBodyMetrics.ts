import { resolver } from '@blitzjs/rpc'
import db from 'db'
import { getSameDayInUTC } from 'src/days/dateUtils'
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
    return db.bodyMetrics.create({
      data: {
        userId: ctx.session.userId,
        weightInKilograms,
        date: getSameDayInUTC(date),
      },
    })
  }
)
