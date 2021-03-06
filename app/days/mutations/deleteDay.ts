import { Ctx } from 'blitz'
import db, { Day, Prisma } from 'db'

export default async function deleteDay(date: Date, ctx: Ctx): Promise<Day> {
  ctx.session.$authorize()

  const day = await db.day.delete({
    where: { uniqueDatePerUser: { date, userId: ctx.session.userId } },
  })

  return day
}
