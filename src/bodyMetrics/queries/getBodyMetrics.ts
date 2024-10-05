import { resolver } from '@blitzjs/rpc'
import { NotFoundError } from 'blitz'
import db from 'db'
import { z } from 'zod'

const BodyMetrics = z.object({
  date: z.date(),
})

export default resolver.pipe(
  resolver.zod(BodyMetrics),
  resolver.authorize(),
  async function getBodyMetrics(data, ctx) {
    const metrics = db.bodyMetrics.findFirst({
      where: {
        userId: ctx.session.userId,
        date: { lte: data.date },
      },
    })

    if (!metrics) {
      throw new NotFoundError()
    }

    return metrics
  }
)
