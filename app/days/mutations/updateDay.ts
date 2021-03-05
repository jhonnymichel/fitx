import { Ctx } from 'blitz'
import db, { Prisma } from 'db'

type UpdateDayInput = {
  data: Pick<
    Prisma.DayUpdateInput,
    'cardioType' | 'cardioCount' | 'foodCalories' | 'strengthDone' | 'strengthType'
  >
  where: Pick<Prisma.DayUpdateArgs['where'], 'id'>
}

export default async function updateDay({ where, data }: UpdateDayInput, ctx: Ctx) {
  ctx.session.$authorize()

  const prevDay = await db.day.findFirst({ where: { id: where.id, userId: ctx.session.userId } })

  if (!prevDay) {
    throw new Error('Wrong credentials')
  }

  const day = await db.day.update({ where, data })

  return day
}
