import { Ctx } from 'blitz'
import db, { Prisma } from 'db'

type CreateDayInput = {
  data: Omit<
    Prisma.DayCreateArgs['data'],
    'userId' | 'id' | 'cardioType' | 'cardioCount' | 'strengthDone' | 'strengthType'
  >
}

export default async function createDay({ data }: CreateDayInput, ctx: Ctx) {
  ctx.session.$authorize()

  const goals = await db.userGoals.findFirstOrThrow({ where: { userId: ctx.session.userId } })

  const day = await db.day.create({
    data: {
      ...data,
      user: {
        connect: {
          id: ctx.session.userId,
        },
      },
      goals: {
        create: {
          ...goals,
        },
      },
    },
  })

  return day
}
