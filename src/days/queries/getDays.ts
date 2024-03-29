import { Ctx } from 'blitz'
import db, { Prisma } from 'db'

type GetDaysInput = Pick<Prisma.DayFindManyArgs, 'where' | 'orderBy' | 'skip' | 'take'>

export default async function getDays({ where, orderBy, skip = 0, take }: GetDaysInput, ctx: Ctx) {
  ctx.session.$authorize()

  const days = await db.day.findMany({
    where: {
      ...where,
      userId: ctx.session.userId,
    },
    orderBy,
    take,
    skip,
  })

  return {
    days,
  }
}
