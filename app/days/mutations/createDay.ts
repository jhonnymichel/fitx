import { Ctx } from 'blitz'
import db, { Prisma } from 'db'

type CreateDayInput = Pick<Prisma.DayCreateArgs, 'data'>
export default async function createDay({ data }: CreateDayInput, ctx: Ctx) {
  ctx.session.$authorize()

  const day = await db.day.create({
    data: {
      ...data,
      user: {
        connect: {
          id: ctx.session.userId,
        },
      },
    },
  })

  return day
}
