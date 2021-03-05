import { Ctx } from 'blitz'
import db, { Day, Prisma } from 'db'

type DeleteDayInput = Pick<Prisma.DayDeleteArgs, 'where'>

export default async function deleteDay({ where }: DeleteDayInput, ctx: Ctx): Promise<Day> {
  ctx.session.$authorize()

  const prevDay = await db.day.findFirst({ where: { id: where.id, userId: ctx.session.userId } })

  if (!prevDay) {
    throw new Error('Wrong credentials')
  }

  const day = await db.day.delete({ where })

  return day
}
