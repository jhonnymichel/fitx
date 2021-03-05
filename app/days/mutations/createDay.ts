import { Ctx } from 'blitz'
import db, { Prisma } from 'db'

type CreateDayInput = { data: Omit<Prisma.DayCreateArgs['data'], 'userId' | 'id'> }

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
